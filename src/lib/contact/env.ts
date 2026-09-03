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
  const user = process.env.SMTP_USER?.trim() ?? "";
  return {
    host: process.env.SMTP_HOST?.trim() ?? "",
    portRaw: process.env.SMTP_PORT?.trim() || "465",
    secureRaw: process.env.SMTP_SECURE?.trim() || "true",
    user,
    password: process.env.SMTP_PASSWORD?.trim() ?? "",
    fromEmail: process.env.CONTACT_FROM_EMAIL?.trim() || user,
    toEmail: process.env.CONTACT_TO_EMAIL?.trim() || "info@ghpolsterei.de",
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
  return Boolean(
    process.env.SMTP_HOST?.trim() ||
      process.env.SMTP_PORT?.trim() ||
      process.env.SMTP_SECURE?.trim() ||
      process.env.SMTP_USER?.trim() ||
      process.env.SMTP_PASSWORD?.trim() ||
      process.env.CONTACT_FROM_EMAIL?.trim() ||
      process.env.CONTACT_TO_EMAIL?.trim(),
  );
}
