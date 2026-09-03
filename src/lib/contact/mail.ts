import nodemailer from "nodemailer";
import { contactServiceOptions } from "@/data/contact";
import { site } from "@/data/site";
import {
  getContactToEmail,
  getSmtpConfig,
  hasPartialSmtpConfig,
  isHostedDeploy,
  type SmtpConfig,
} from "@/lib/contact/env";
import type { AttachmentPlan } from "@/lib/contact/storage";
import type { ContactFields, ValidatedFile } from "@/lib/contact/validation";
import { normalizePhone } from "@/lib/contact/validation";

export type ContactRequestMeta = {
  origin: string;
  userAgent: string;
};

export type ContactMailInput = {
  fields: ContactFields;
  attachments: AttachmentPlan;
  submittedAt: string;
  requestMeta?: ContactRequestMeta;
};

export type MailResult =
  | { ok: true }
  | { ok: false; reason: string; debug?: SafeMailDebug };

export type SafeMailDebug = {
  name?: string;
  code?: string;
  command?: string;
  responseCode?: number;
  message?: string;
};

function sanitizeMailMessage(message: string | undefined): string | undefined {
  if (!message) return undefined;
  const collapsed = message.replace(/[\r\n\u0000]+/g, " ").trim();
  const redacted = collapsed.replace(
    /(pass(?:word)?|secret|token)\s*[:=]\s*\S+/gi,
    "$1=[redacted]",
  );
  return redacted.length > 180 ? `${redacted.slice(0, 180)}…` : redacted;
}

export function safeMailDebug(error: unknown): SafeMailDebug {
  const record =
    error && typeof error === "object" ? (error as Record<string, unknown>) : undefined;
  const name =
    (typeof record?.name === "string" && record.name) ||
    (error instanceof Error ? error.name : undefined);
  const codeValue = record?.code;
  const code =
    typeof codeValue === "string" || typeof codeValue === "number"
      ? String(codeValue)
      : undefined;
  const command = typeof record?.command === "string" ? record.command : undefined;
  const responseCode =
    typeof record?.responseCode === "number" ? record.responseCode : undefined;
  const rawMessage =
    (typeof record?.message === "string" && record.message) ||
    (error instanceof Error ? error.message : undefined);
  const message = sanitizeMailMessage(rawMessage);

  return {
    ...(name ? { name } : {}),
    ...(code ? { code } : {}),
    ...(command ? { command } : {}),
    ...(responseCode !== undefined ? { responseCode } : {}),
    ...(message ? { message } : {}),
  };
}

function serviceLabel(value: string): string {
  return (
    contactServiceOptions.find((option) => option.value === value)?.label ??
    value
  );
}

function sanitizeMeta(value: string | undefined, max = 200): string {
  const cleaned = (value ?? "").replace(/[\r\n\u0000]+/g, " ").trim();
  if (!cleaned) return "—";
  return cleaned.length > max ? `${cleaned.slice(0, max)}…` : cleaned;
}

export function buildContactMailText(input: ContactMailInput): {
  subject: string;
  text: string;
  attachments: { filename: string; content: Buffer; contentType: string }[];
} {
  const { fields, attachments, submittedAt, requestMeta } = input;
  const phone = fields.phone ? normalizePhone(fields.phone) : "—";
  const email = fields.email || "—";
  const fileLines =
    attachments.files.length > 0
      ? attachments.files
          .map((file) => `- ${file.filename} (${file.size} Bytes, ${file.mime})`)
          .join("\n")
      : "keine";

  const text = [
    "Neue Anfrage über das Kontaktformular",
    "",
    `Name: ${fields.name}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone}`,
    `Leistung: ${serviceLabel(fields.service)}`,
    `Zeitpunkt: ${submittedAt}`,
    "",
    "Nachricht:",
    fields.message,
    "",
    "Anhänge:",
    fileLines,
    attachments.skippedNote ? `\n${attachments.skippedNote}` : "",
    "",
    "Technische Angaben:",
    `Herkunft: ${sanitizeMeta(requestMeta?.origin, 120)}`,
    `User-Agent: ${sanitizeMeta(requestMeta?.userAgent, 240)}`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const subject = `Neue Anfrage über ghpolsterei.de – ${serviceLabel(fields.service)}`;

  const mailAttachments = attachments.attachToEmail
    ? attachments.files.map((file: ValidatedFile) => ({
        filename: file.filename,
        content: Buffer.from(file.bytes),
        contentType: file.mime,
      }))
    : [];

  return { subject, text, attachments: mailAttachments };
}

function smtpFailureReason(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code?: string }).code);
    if (code === "EAUTH") return "smtp-auth";
    if (
      code === "ECONNECTION" ||
      code === "ETIMEDOUT" ||
      code === "ESOCKET" ||
      code === "EDNS"
    ) {
      return "smtp-connection";
    }
  }
  return "smtp-send";
}

function recipientAccepted(
  accepted: unknown,
  rejected: unknown,
  to: string,
): boolean {
  const acceptedList = Array.isArray(accepted)
    ? accepted.map((entry) => String(entry).toLowerCase())
    : [];
  const rejectedList = Array.isArray(rejected)
    ? rejected.map((entry) => String(entry).toLowerCase())
    : [];
  const target = to.toLowerCase();

  if (rejectedList.some((entry) => entry.includes(target))) {
    return false;
  }
  if (acceptedList.some((entry) => entry.includes(target))) {
    return true;
  }
  return acceptedList.length > 0 && rejectedList.length === 0;
}

async function sendWithSmtp(
  input: ContactMailInput,
  config: SmtpConfig,
): Promise<MailResult> {
  const { subject, text, attachments } = buildContactMailText(input);

  let transporter: nodemailer.Transporter | undefined;

  try {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    const info = await transporter.sendMail({
      from: `GH Polsterei Website <${config.fromEmail}>`,
      to: config.toEmail,
      replyTo: input.fields.email || undefined,
      subject,
      text,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (!recipientAccepted(info.accepted, info.rejected, config.toEmail)) {
      return { ok: false, reason: "smtp-rejected" };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: smtpFailureReason(error),
      debug: safeMailDebug(error),
    };
  } finally {
    transporter?.close();
  }
}

function sendToConsole(input: ContactMailInput): MailResult {
  const { subject, text, attachments } = buildContactMailText(input);
  console.info("[contact-mail:dev]", {
    subject,
    to: getContactToEmail(site.email),
    text,
    attachmentCount: attachments.length,
    attachmentNames: attachments.map((file) => file.filename),
  });
  return { ok: true };
}

export async function sendContactMail(input: ContactMailInput): Promise<MailResult> {
  const config = getSmtpConfig();

  if (config) {
    return sendWithSmtp(input, config);
  }

  if (isHostedDeploy() || hasPartialSmtpConfig()) {
    return { ok: false, reason: "missing-smtp-config" };
  }

  return sendToConsole(input);
}

export type { ValidatedFile };
