import { z } from "zod";
import { allowedServiceValues } from "@/data/contact";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME,
  CONTACT_LIMITS,
  PAYLOAD_TOO_LARGE,
} from "@/lib/contact/constants";

const allowedServices: readonly string[] = allowedServiceValues;

export const fieldMessages = {
  name: "Bitte geben Sie Ihren Namen an.",
  email: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
  phone: "Bitte geben Sie eine gültige Telefonnummer an.",
  contact: "Bitte geben Sie mindestens eine E-Mail-Adresse oder Telefonnummer an.",
  service: "Bitte wählen Sie ein Anliegen.",
  message: "Bitte beschreiben Sie Ihr Anliegen (mindestens 10 Zeichen).",
  privacy: "Bitte bestätigen Sie die Datenschutzerklärung.",
  filesType: "Bitte nur JPG, PNG oder WebP hochladen.",
  filesSize: "Jedes Foto darf höchstens 8 MB groß sein.",
  filesProcessedSize: "Die vorbereiteten Fotos sind zu groß.",
  filesCount: "Bitte höchstens 5 Fotos auswählen.",
  filesTotal: "Die Fotos sind zusammen zu groß. Bitte weniger Dateien wählen.",
  filesOptimize:
    "Die Fotos konnten nicht vorbereitet werden. Bitte andere Dateien wählen oder rufen Sie uns an.",
} as const;

export function stripHeaderBreaks(value: string): string {
  return value.replace(/[\r\n\u0000]+/g, " ").trim();
}

export function normalizePhone(value: string): string {
  const trimmed = stripHeaderBreaks(value);
  const kept = trimmed.replace(/[^\d+]/g, "");
  return kept.replace(/(?!^)\+/g, "");
}

export function isValidPhone(value: string): boolean {
  const digits = normalizePhone(value).replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 16;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !value.includes(" ");
}

export const contactFieldsSchema = z
  .object({
    name: z
      .string()
      .transform(stripHeaderBreaks)
      .pipe(
        z
          .string()
          .min(CONTACT_LIMITS.nameMin, fieldMessages.name)
          .max(CONTACT_LIMITS.nameMax, fieldMessages.name),
      ),
    email: z.string().transform(stripHeaderBreaks),
    phone: z.string().transform(stripHeaderBreaks),
    service: z
      .string()
      .refine(
        (value): value is (typeof allowedServiceValues)[number] =>
          allowedServices.includes(value),
        fieldMessages.service,
      ),
    message: z
      .string()
      .transform((value) => value.replace(/\u0000/g, "").trim())
      .pipe(
        z
          .string()
          .min(CONTACT_LIMITS.messageMin, fieldMessages.message)
          .max(CONTACT_LIMITS.messageMax, fieldMessages.message),
      ),
    privacy: z.boolean().refine((value) => value === true, fieldMessages.privacy),
  })
  .superRefine((data, ctx) => {
    const email = data.email;
    const phone = data.phone;

    if (!email && !phone) {
      ctx.addIssue({
        code: "custom",
        message: fieldMessages.contact,
        path: ["contact"],
      });
    }

    if (email) {
      if (email.length > CONTACT_LIMITS.emailMax || !isValidEmail(email)) {
        ctx.addIssue({
          code: "custom",
          message: fieldMessages.email,
          path: ["email"],
        });
      }
    }

    if (phone) {
      if (phone.length > CONTACT_LIMITS.phoneMax || !isValidPhone(phone)) {
        ctx.addIssue({
          code: "custom",
          message: fieldMessages.phone,
          path: ["phone"],
        });
      }
    }
  });

export type ContactFields = z.infer<typeof contactFieldsSchema>;

export type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "contact" | "service" | "message" | "privacy" | "photos", string>
>;

export function parsePrivacy(value: FormDataEntryValue | null): boolean {
  if (typeof value !== "string") return false;
  return value === "true" || value === "on" || value === "1";
}

export function zodToFieldErrors(error: z.ZodError): FieldErrors {
  const fields: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (
      key === "name" ||
      key === "email" ||
      key === "phone" ||
      key === "contact" ||
      key === "service" ||
      key === "message" ||
      key === "privacy"
    ) {
      if (!fields[key]) fields[key] = issue.message;
    }
  }
  return fields;
}

export type ValidatedFile = {
  filename: string;
  mime: "image/jpeg" | "image/png" | "image/webp";
  bytes: Uint8Array;
  size: number;
};

function extensionOf(name: string): string {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? (parts.pop() ?? "") : "";
}

export function sanitizeFilename(name: string): string {
  const cleaned = stripHeaderBreaks(name)
    .replace(/[/\\]/g, "")
    .replace(/[^\w.\-]+/g, "_")
    .slice(0, 80);
  return cleaned || "foto";
}

function sniffImageMime(
  bytes: Uint8Array,
): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export function validateClientFiles(files: File[]): FieldErrors {
  if (files.length > CONTACT_LIMITS.maxFiles) {
    return { photos: fieldMessages.filesCount };
  }

  for (const file of files) {
    const ext = extensionOf(file.name);
    const mimeOk = ALLOWED_IMAGE_MIME.has(file.type.toLowerCase());
    const extOk = ALLOWED_IMAGE_EXTENSIONS.has(ext);
    if (!mimeOk || !extOk) {
      return { photos: fieldMessages.filesType };
    }
    if (file.size > CONTACT_LIMITS.maxRawFileBytes) {
      return { photos: fieldMessages.filesSize };
    }
  }

  return {};
}

export async function validateUploadedFiles(
  files: File[],
): Promise<{ files: ValidatedFile[] } | { error: string }> {
  const nonempty = files.filter((file) => file.size > 0);

  if (nonempty.length > CONTACT_LIMITS.maxFiles) {
    return { error: fieldMessages.filesCount };
  }

  let total = 0;
  const validated: ValidatedFile[] = [];

  for (const file of nonempty) {
    if (file.size > CONTACT_LIMITS.maxFileBytes) {
      return { error: fieldMessages.filesProcessedSize };
    }

    const ext = extensionOf(file.name);
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      return { error: fieldMessages.filesType };
    }

    const declared = file.type.toLowerCase();
    if (declared && !ALLOWED_IMAGE_MIME.has(declared)) {
      return { error: fieldMessages.filesType };
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const sniffed = sniffImageMime(buffer);
    if (!sniffed) {
      return { error: fieldMessages.filesType };
    }

    total += buffer.byteLength;
    if (total > CONTACT_LIMITS.maxTotalUploadBytes) {
      return { error: PAYLOAD_TOO_LARGE };
    }

    const base = sanitizeFilename(file.name.replace(/\.[^.]+$/, ""));
    const outExt = sniffed === "image/jpeg" ? "jpg" : sniffed === "image/png" ? "png" : "webp";

    validated.push({
      filename: `${base}.${outExt}`,
      mime: sniffed,
      bytes: buffer,
      size: buffer.byteLength,
    });
  }

  return { files: validated };
}

export function validateContactFields(input: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  privacy: boolean;
}): { data: ContactFields } | { fields: FieldErrors } {
  const parsed = contactFieldsSchema.safeParse(input);
  if (!parsed.success) {
    return { fields: zodToFieldErrors(parsed.error) };
  }
  return { data: parsed.data };
}
