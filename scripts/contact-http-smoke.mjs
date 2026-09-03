import { createHmac } from "node:crypto";

const baseUrl = (process.env.CONTACT_HTTP_BASE ?? "http://127.0.0.1:3000").replace(
  /\/$/,
  "",
);
const apiUrl = `${baseUrl}/api/contact`;
const pageUrl = `${baseUrl}/kontakt`;
const DEV_FORM_SECRET =
  process.env.CONTACT_FORM_SECRET || "dev-only-contact-form-secret";

function signTimestamp(issuedAt) {
  const hmac = createHmac("sha256", DEV_FORM_SECRET)
    .update(String(issuedAt))
    .digest("hex");
  return `${issuedAt}.${hmac}`;
}

function validForm(overrides = {}) {
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
  body.set("_t", overrides._t ?? signTimestamp(Date.now() - 4000));
  return body;
}

async function post(body, headers = {}) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers,
    body,
  });
  let json = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }
  return { status: response.status, json };
}

let failed = 0;

function report(label, ok, detail) {
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${detail ? ` ${detail}` : ""}`);
}

async function main() {
  const page = await fetch(pageUrl);
  const pageText = await page.text();
  report(
    "kontakt-page",
    page.status === 200 &&
      !pageText.toLowerCase().includes("turnstile") &&
      !pageText.toLowerCase().includes("cf-turnstile") &&
      !pageText.toLowerCase().includes("challenges.cloudflare.com"),
    `status=${page.status}`,
  );

  const success = await post(validForm(), {
    origin: "http://localhost:3000",
    "x-forwarded-for": "198.51.100.21",
  });
  const successJson = JSON.stringify(success.json ?? {}).toLowerCase();
  const noTurnstile = !successJson.includes("turnstile") && !successJson.includes("cf-turnstile");
  const validOk =
    (success.status === 200 && success.json?.ok === true) ||
    (success.status === 503 && success.json?.ok === false && noTurnstile);
  report(
    "valid-form",
    validOk && noTurnstile,
    `status=${success.status}`,
  );

  const badOrigin = await post(validForm(), {
    origin: "https://evil.example",
    "x-forwarded-for": "198.51.100.22",
  });
  report("bad-origin", badOrigin.status === 400, `status=${badOrigin.status}`);

  const badTimestamp = await post(validForm({ _t: "not-a-token" }), {
    origin: "http://localhost:3000",
    "x-forwarded-for": "198.51.100.23",
  });
  report(
    "bad-timestamp",
    badTimestamp.status === 400,
    `status=${badTimestamp.status}`,
  );

  const invalidFields = await post(
    validForm({ name: "A", message: "kurz" }),
    {
      origin: "http://localhost:3000",
      "x-forwarded-for": "198.51.100.24",
    },
  );
  report(
    "invalid-fields",
    invalidFields.status === 400 && invalidFields.json?.error === "validation",
    `status=${invalidFields.status}`,
  );

  const rateIp = "198.51.100.25";
  let lastStatus = 0;
  for (let i = 0; i < 31; i += 1) {
    const result = await post(validForm({ _t: "not-a-token" }), {
      origin: "http://localhost:3000",
      "x-forwarded-for": rateIp,
    });
    lastStatus = result.status;
  }
  report("rate-limit-exceeded", lastStatus === 429, `status=${lastStatus}`);

  if (failed) {
    console.error(`contact-http-smoke: ${failed} case(s) failed`);
    process.exit(1);
  }
  console.log("contact-http-smoke: all cases passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
