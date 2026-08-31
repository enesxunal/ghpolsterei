export function isVercelDeploy(): boolean {
  return process.env.VERCEL === "1";
}

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Public Vercel deployment (production or preview). Missing security infra must fail closed. */
export function isHostedDeploy(): boolean {
  return isVercelDeploy() && isProductionRuntime();
}

export function getTurnstileSiteKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  return key || undefined;
}

export function getTurnstileSecret(): string | undefined {
  const key = process.env.TURNSTILE_SECRET_KEY?.trim();
  return key || undefined;
}

export function getResendApiKey(): string | undefined {
  const key = process.env.RESEND_API_KEY?.trim();
  return key || undefined;
}

export function getUpstashConfig(): { url: string; token: string } | undefined {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return undefined;
  return { url, token };
}

export function getContactToEmail(fallback: string): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || fallback;
}

export function getContactFromEmail(): string | undefined {
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  return from || undefined;
}

export function getFormSecret(): string | undefined {
  const secret = process.env.CONTACT_FORM_SECRET?.trim();
  return secret || undefined;
}
