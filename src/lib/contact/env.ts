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

export function getUpstashConfig(): { url: string; token: string } | undefined {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return undefined;
  return { url, token };
}

export function getContactToEmail(fallback: string): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || fallback;
}

export function getFormSecret(): string | undefined {
  const secret = process.env.CONTACT_FORM_SECRET?.trim();
  return secret || undefined;
}

const SIMPLE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isSimpleEmail(value: string): boolean {
  return SIMPLE_EMAIL.test(value) && !/[\r\n]/.test(value);
}

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromEmail: string;
  toEmail: string;
};

function readSmtpEnv(): {
  host: string;
  portRaw: string;
  secureRaw: string;
  user: string;
  password: string;
  fromEmail: string;
  toEmail: string;
} {
  return {
    host: process.env.SMTP_HOST?.trim() ?? "",
    portRaw: process.env.SMTP_PORT?.trim() ?? "",
    secureRaw: process.env.SMTP_SECURE?.trim() ?? "",
    user: process.env.SMTP_USER?.trim() ?? "",
    password: process.env.SMTP_PASSWORD?.trim() ?? "",
    fromEmail: process.env.CONTACT_FROM_EMAIL?.trim() ?? "",
    toEmail: process.env.CONTACT_TO_EMAIL?.trim() ?? "",
  };
}

export function getSmtpConfig(): SmtpConfig | undefined {
  const env = readSmtpEnv();
  if (
    !env.host ||
    !env.portRaw ||
    !env.secureRaw ||
    !env.user ||
    !env.password ||
    !env.fromEmail ||
    !env.toEmail
  ) {
    return undefined;
  }

  const port = Number(env.portRaw);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    return undefined;
  }

  if (env.secureRaw !== "true" && env.secureRaw !== "false") {
    return undefined;
  }

  if (!isSimpleEmail(env.fromEmail) || !isSimpleEmail(env.toEmail)) {
    return undefined;
  }

  return {
    host: env.host,
    port,
    secure: env.secureRaw === "true",
    user: env.user,
    password: env.password,
    fromEmail: env.fromEmail,
    toEmail: env.toEmail,
  };
}

/** True when some SMTP_* vars are set but the config is not complete/valid. */
export function hasPartialSmtpConfig(): boolean {
  if (getSmtpConfig()) return false;
  const env = readSmtpEnv();
  return Boolean(env.host || env.portRaw || env.secureRaw || env.user || env.password);
}
