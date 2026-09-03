import type { ContactApiFailure, ContactApiResponse } from "@/lib/contact/api-types";
import {
  CONTACT_LIMITS,
  GENERIC_ERROR_MESSAGE,
  HONEYPOT_FIELD,
  PAYLOAD_TOO_LARGE,
  RATE_LIMIT_MESSAGE,
  TIMESTAMP_FIELD,
  UNAVAILABLE_MESSAGE,
} from "@/lib/contact/constants";
import { sendContactMail } from "@/lib/contact/mail";
import { isAllowedOrigin } from "@/lib/contact/origin";
import { checkContactRateLimit, getRequestIp } from "@/lib/contact/rate-limit";
import { planEmailAttachments } from "@/lib/contact/storage";
import { verifyFormTimestampToken } from "@/lib/contact/time-trap";
import {
  parsePrivacy,
  validateContactFields,
  validateUploadedFiles,
} from "@/lib/contact/validation";

function genericFail(): ContactApiFailure {
  return { ok: false, error: "generic", message: GENERIC_ERROR_MESSAGE };
}

function unavailableFail(): ContactApiFailure {
  return { ok: false, error: "unavailable", message: UNAVAILABLE_MESSAGE };
}

function log503(label: string, extra?: Record<string, unknown>) {
  if (extra && Object.keys(extra).length > 0) {
    console.error("[contact] 503", label, extra);
    return;
  }
  console.error("[contact] 503", label);
}

function rateLimitFail(): ContactApiFailure {
  return { ok: false, error: "generic", message: RATE_LIMIT_MESSAGE };
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function collectPhotoFiles(formData: FormData): File[] {
  const fromPhotos = formData.getAll("photos");
  const files = fromPhotos.filter((entry): entry is File => entry instanceof File);
  return files;
}

export async function processContactForm(
  request: Request,
): Promise<{ status: number; body: ContactApiResponse }> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > CONTACT_LIMITS.maxRequestBytes) {
    return { status: 413, body: genericFail() };
  }

  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return { status: 400, body: genericFail() };
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return { status: 400, body: genericFail() };
  }

  const honeypot = readString(formData, HONEYPOT_FIELD).trim();
  if (honeypot) {
    return { status: 200, body: { ok: true } };
  }

  const ip = getRequestIp(request);
  const rate = checkContactRateLimit(ip);
  if (!rate.allowed) {
    return { status: 429, body: rateLimitFail() };
  }

  const timestamp = verifyFormTimestampToken(readString(formData, TIMESTAMP_FIELD));
  if (timestamp === "unavailable") {
    log503("TIMESTAMP_SECRET_MISSING");
    return { status: 503, body: unavailableFail() };
  }
  if (timestamp === "rejected") {
    return { status: 400, body: genericFail() };
  }

  const fieldsResult = validateContactFields({
    name: readString(formData, "name"),
    email: readString(formData, "email"),
    phone: readString(formData, "phone"),
    service: readString(formData, "service"),
    message: readString(formData, "message"),
    privacy: parsePrivacy(formData.get("privacy")),
  });

  if ("fields" in fieldsResult) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "validation",
        message: "Bitte prüfen Sie Ihre Angaben.",
        fields: fieldsResult.fields,
      },
    };
  }

  const filesResult = await validateUploadedFiles(collectPhotoFiles(formData));
  if ("error" in filesResult) {
    if (filesResult.error === PAYLOAD_TOO_LARGE) {
      return { status: 413, body: genericFail() };
    }
    return {
      status: 400,
      body: {
        ok: false,
        error: "validation",
        message: "Bitte prüfen Sie Ihre Angaben.",
        fields: { photos: filesResult.error },
      },
    };
  }

  const attachments = planEmailAttachments(filesResult.files);
  const mail = await sendContactMail({
    fields: fieldsResult.data,
    attachments,
    submittedAt: new Date().toISOString(),
    requestMeta: {
      origin: request.headers.get("origin") ?? "",
      userAgent: request.headers.get("user-agent") ?? "",
    },
  });

  if (!mail.ok) {
    log503("MAIL_SEND_FAILED", {
      reason: mail.reason,
      ...(mail.debug ?? {}),
    });
    return { status: 503, body: genericFail() };
  }

  return { status: 200, body: { ok: true } };
}
