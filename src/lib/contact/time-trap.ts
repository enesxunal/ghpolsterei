import { createHmac, timingSafeEqual } from "node:crypto";
import { CONTACT_LIMITS, DEV_FORM_SECRET } from "@/lib/contact/constants";
import { getFormSecret, isHostedDeploy } from "@/lib/contact/env";

function resolveSecret(): string | null {
  const configured = getFormSecret();
  if (configured) return configured;
  if (isHostedDeploy()) return null;
  return DEV_FORM_SECRET;
}

export function createFormTimestampToken(): string | null {
  const secret = resolveSecret();
  if (!secret) return null;
  const issuedAt = Date.now().toString();
  const hmac = createHmac("sha256", secret).update(issuedAt).digest("hex");
  return `${issuedAt}.${hmac}`;
}

export type TimestampCheck = "ok" | "unavailable" | "rejected";

export function verifyFormTimestampToken(token: string | null): TimestampCheck {
  const secret = resolveSecret();
  if (!secret) return "unavailable";
  if (!token || !token.includes(".")) return "rejected";

  const [issuedRaw, signature] = token.split(".");
  if (!issuedRaw || !signature) return "rejected";

  const expected = createHmac("sha256", secret).update(issuedRaw).digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(signature, "utf8");
  if (expectedBuf.length !== actualBuf.length) return "rejected";
  if (!timingSafeEqual(expectedBuf, actualBuf)) return "rejected";

  const issuedAt = Number(issuedRaw);
  if (!Number.isFinite(issuedAt)) return "rejected";

  const age = Date.now() - issuedAt;
  if (age < CONTACT_LIMITS.minSubmitMs) return "rejected";
  if (age > CONTACT_LIMITS.maxFormAgeMs) return "rejected";

  return "ok";
}
