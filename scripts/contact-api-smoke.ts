import { createHmac } from "node:crypto";
import { CONTACT_LIMITS, DEV_FORM_SECRET } from "../src/lib/contact/constants";
import { processContactForm } from "../src/lib/contact/process";

type EnvKey =
  | "VERCEL"
  | "NODE_ENV"
  | "CONTACT_FORM_SECRET"
  | "SMTP_HOST"
  | "SMTP_PORT"
  | "SMTP_SECURE"
  | "SMTP_USER"
  | "SMTP_PASSWORD"
  | "CONTACT_FROM_EMAIL"
  | "CONTACT_TO_EMAIL";

const SMTP_KEYS: EnvKey[] = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "CONTACT_FROM_EMAIL",
  "CONTACT_TO_EMAIL",
];

function signTimestamp(secret: string, issuedAt: number): string {
  const hmac = createHmac("sha256", secret).update(String(issuedAt)).digest("hex");
  return `${issuedAt}.${hmac}`;
}

function validForm(overrides: Record<string, string> = {}): FormData {
  const body = new FormData();
  body.set("name", overrides.name ?? "Anna Muster");
  body.set("email", overrides.email ?? "anna@example.com");
  body.set("phone", overrides.phone ?? "");
  body.set("service", overrides.service ?? "aufpolstern");
  body.set(
    "message",
    overrides.message ?? "Bitte um ein Angebot für ein Sofa in Wesseling.",
  );
  body.set("privacy", overrides.privacy ?? "true");
  body.set("company_website", overrides.company_website ?? "");
  if (overrides._t !== undefined) {
    body.set("_t", overrides._t);
  }
  return body;
}

function makeRequest(
  body: FormData,
  options: { origin?: string | null; ip?: string } = {},
): Request {
  const headers = new Headers();
  if (options.origin !== null) {
    headers.set("origin", options.origin ?? "http://localhost:3000");
  }
  headers.set("x-forwarded-for", options.ip ?? "203.0.113.10");
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers,
    body,
  });
}

async function withEnv<T>(
  patch: Partial<Record<EnvKey, string | undefined>>,
  fn: () => Promise<T>,
): Promise<T> {
  const env = process.env as Record<string, string | undefined>;
  const prev: Partial<Record<EnvKey, string | undefined>> = {};
  for (const key of Object.keys(patch) as EnvKey[]) {
    prev[key] = env[key];
    const value = patch[key];
    if (value === undefined) delete env[key];
    else env[key] = value;
  }
  try {
    return await fn();
  } finally {
    for (const key of Object.keys(patch) as EnvKey[]) {
      const value = prev[key];
      if (value === undefined) delete env[key];
      else env[key] = value;
    }
  }
}

function clearSmtpPatch(): Partial<Record<EnvKey, string | undefined>> {
  return Object.fromEntries(SMTP_KEYS.map((key) => [key, undefined])) as Partial<
    Record<EnvKey, string | undefined>
  >;
}

let failed = 0;

async function expectStatus(
  label: string,
  expected: number,
  request: Request,
): Promise<void> {
  const result = await processContactForm(request);
  const ok = result.status === expected;
  if (!ok) failed += 1;
  const error =
    !result.body.ok && "error" in result.body ? result.body.error : undefined;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${label} expected=${expected} actual=${result.status}${
      error ? ` error=${error}` : ""
    }`,
  );
}

async function runPipeline(): Promise<void> {
  const agedToken = signTimestamp(DEV_FORM_SECRET, Date.now() - 4000);

  await withEnv({ VERCEL: undefined, ...clearSmtpPatch() }, async () => {
    await expectStatus(
      "valid-form-console-mail",
      200,
      makeRequest(validForm({ _t: agedToken }), { ip: "203.0.113.21" }),
    );

    await expectStatus(
      "bad-origin",
      400,
      makeRequest(validForm({ _t: agedToken }), {
        origin: "https://evil.example",
        ip: "203.0.113.22",
      }),
    );

    await expectStatus(
      "bad-timestamp",
      400,
      makeRequest(validForm({ _t: "not-a-token" }), { ip: "203.0.113.23" }),
    );

    await expectStatus(
      "invalid-fields",
      400,
      makeRequest(
        validForm({
          _t: agedToken,
          name: "A",
          message: "kurz",
        }),
        { ip: "203.0.113.24" },
      ),
    );

    const rateIp = "203.0.113.25";
    const limit = CONTACT_LIMITS.rateLimitMaxDev;
    for (let i = 0; i < limit; i += 1) {
      const result = await processContactForm(
        makeRequest(validForm({ _t: "not-a-token" }), { ip: rateIp }),
      );
      if (result.status !== 400) {
        failed += 1;
        console.log(
          `FAIL rate-limit-warmup #${i + 1} expected=400 actual=${result.status}`,
        );
      }
    }
    await expectStatus(
      "rate-limit-exceeded",
      429,
      makeRequest(validForm({ _t: "not-a-token" }), { ip: rateIp }),
    );
  });

  const hostedSecret = "contact-api-smoke-form-secret";
  const hostedToken = signTimestamp(hostedSecret, Date.now() - 4000);
  await withEnv(
    {
      VERCEL: "1",
      NODE_ENV: "production",
      CONTACT_FORM_SECRET: hostedSecret,
      ...clearSmtpPatch(),
    },
    async () => {
      await expectStatus(
        "smtp-missing-hosted",
        503,
        makeRequest(validForm({ _t: hostedToken }), { ip: "203.0.113.26" }),
      );
    },
  );
}

async function main(): Promise<void> {
  await runPipeline();

  if (failed) {
    console.error(`contact-api-smoke: ${failed} case(s) failed`);
    process.exit(1);
  }
  console.log("contact-api-smoke: pipeline cases passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
