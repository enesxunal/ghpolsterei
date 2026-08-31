import { contactServiceOptions } from "@/data/contact";
import { site } from "@/data/site";
import {
  getContactFromEmail,
  getContactToEmail,
  getResendApiKey,
  isHostedDeploy,
} from "@/lib/contact/env";
import type { AttachmentPlan } from "@/lib/contact/storage";
import type { ContactFields, ValidatedFile } from "@/lib/contact/validation";
import { normalizePhone } from "@/lib/contact/validation";

export type ContactMailInput = {
  fields: ContactFields;
  attachments: AttachmentPlan;
  submittedAt: string;
};

export type MailResult = { ok: true } | { ok: false; reason: string };

function serviceLabel(value: string): string {
  return (
    contactServiceOptions.find((option) => option.value === value)?.label ??
    value
  );
}

function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

export function buildContactMailText(input: ContactMailInput): {
  subject: string;
  text: string;
  attachments: { filename: string; content: string }[];
} {
  const { fields, attachments, submittedAt } = input;
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
  ]
    .filter((line) => line !== "")
    .join("\n");

  const subject = `Neue Anfrage: ${serviceLabel(fields.service)} — ${fields.name}`;

  const mailAttachments = attachments.attachToEmail
    ? attachments.files.map((file) => ({
        filename: file.filename,
        content: toBase64(file.bytes),
      }))
    : [];

  return { subject, text, attachments: mailAttachments };
}

async function sendWithResend(input: ContactMailInput): Promise<MailResult> {
  const apiKey = getResendApiKey();
  const from = getContactFromEmail();
  const to = getContactToEmail(site.email);

  if (!apiKey || !from) {
    return { ok: false, reason: "missing-resend-config" };
  }

  const { subject, text, attachments } = buildContactMailText(input);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.fields.email || undefined,
      subject,
      text,
      attachments: attachments.length > 0 ? attachments : undefined,
    }),
  });

  if (!response.ok) {
    return { ok: false, reason: `resend-${response.status}` };
  }

  return { ok: true };
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
  const apiKey = getResendApiKey();
  const from = getContactFromEmail();

  if (apiKey && from) {
    return sendWithResend(input);
  }

  if (isHostedDeploy()) {
    return { ok: false, reason: "missing-resend-config" };
  }

  return sendToConsole(input);
}

export type { ValidatedFile };
