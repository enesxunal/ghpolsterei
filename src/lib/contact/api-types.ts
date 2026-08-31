import type { FieldErrors } from "@/lib/contact/validation";

export type ContactApiSuccess = { ok: true };

export type ContactApiFailure = {
  ok: false;
  error: "validation" | "generic" | "unavailable";
  message: string;
  fields?: FieldErrors;
};

export type ContactApiResponse = ContactApiSuccess | ContactApiFailure;
