export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 120,
  phoneMax: 40,
  messageMin: 10,
  messageMax: 4000,
  maxFiles: 5,
  /** Raw file as selected in the browser, before client optimization. */
  maxRawFileBytes: 8 * 1024 * 1024,
  /** Authoritative per-file cap after optimization / on the server. */
  maxFileBytes: 1024 * 1024,
  /** Authoritative total of processed photo bytes. */
  maxTotalUploadBytes: Math.round(3.5 * 1024 * 1024),
  /** Stay under the Vercel 4.5 MB function body cap, with multipart overhead. */
  maxRequestBytes: 4 * 1024 * 1024,
  maxEdgePx: 1600,
  skipOptimizeUnderBytes: 650 * 1024,
  targetFileBytes: 700 * 1024,
  optimizeQuality: 0.8,
  minSubmitMs: 2500,
  maxFormAgeMs: 24 * 60 * 60 * 1000,
  rateLimitMax: 5,
  rateLimitWindowMs: 10 * 60 * 1000,
  rateLimitMaxDev: 30,
} as const;

export const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

export const HONEYPOT_FIELD = "company_website";
export const TIMESTAMP_FIELD = "_t";
export const PAYLOAD_TOO_LARGE = "payload-too-large";

export const GENERIC_ERROR_MESSAGE =
  "Ihre Anfrage konnte leider nicht gesendet werden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns telefonisch.";

export const UNAVAILABLE_MESSAGE =
  "Das Formular ist derzeit nicht verfügbar. Bitte erreichen Sie uns telefonisch oder per E-Mail.";

export const RATE_LIMIT_MESSAGE =
  "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder rufen Sie uns an.";

/** Local-only HMAC fallback. Never used on Vercel deploys. */
export const DEV_FORM_SECRET = "dev-only-contact-form-secret";
