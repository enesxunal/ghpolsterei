import { chromium } from "playwright";
import { createHmac } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { settleForFullPageScreenshot } from "./qa-settle.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "docs/screenshots");
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const pageUrl = `${baseUrl}/kontakt`;
const apiUrl = `${baseUrl}/api/contact`;

const DEV_FORM_SECRET =
  process.env.CONTACT_FORM_SECRET || "dev-only-contact-form-secret";

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

function writeNoisyJpeg(filePath, width, height, quality) {
  const py = `
from PIL import Image
import os
path = ${JSON.stringify(filePath)}
w, h = ${width}, ${height}
im = Image.frombytes("RGB", (w, h), os.urandom(w * h * 3))
im.save(path, "JPEG", quality=${quality})
print(os.path.getsize(path))
`;
  const result = spawnSync("python3", ["-c", py], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr || "Failed to create JPEG fixture");
  }
  return Number(result.stdout.trim());
}

const expectedLabels = [
  "Name",
  "E-Mail",
  "Telefon",
  "Leistung / Anliegen",
  "Nachricht",
  "Fotos",
];

function signTimestamp(issuedAt) {
  const hmac = createHmac("sha256", DEV_FORM_SECRET)
    .update(String(issuedAt))
    .digest("hex");
  return `${issuedAt}.${hmac}`;
}

function validFormData(overrides = {}) {
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
  body.set(
    "_t",
    overrides._t ?? signTimestamp(Date.now() - 4000),
  );
  body.set("company_website", overrides.company_website ?? "");
  if (overrides.photos) {
    for (const file of overrides.photos) {
      body.append("photos", file);
    }
  }
  return body;
}

async function postContact(body) {
  const response = await fetch(apiUrl, { method: "POST", body });
  let json = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }
  return { status: response.status, json };
}

async function runDomChecks(page, viewport) {
  return page.evaluate((vp) => {
    const issues = [];
    const scrollOverflow =
      document.documentElement.scrollWidth > window.innerWidth;
    if (scrollOverflow) {
      issues.push(
        `Horizontal overflow: scrollWidth=${document.documentElement.scrollWidth} > innerWidth=${window.innerWidth}`,
      );
    }

    const h1s = document.querySelectorAll("h1");
    if (h1s.length !== 1) {
      issues.push(`Expected 1 H1, found ${h1s.length}`);
    }

    const badLinks = [...document.querySelectorAll("a[href]")].filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return href === "" || href === "#";
    });
    if (badLinks.length) {
      issues.push(`${badLinks.length} link(s) with empty or # href`);
    }

    const breadcrumbJson = [
      ...document.querySelectorAll('script[type="application/ld+json"]'),
    ]
      .map((el) => {
        try {
          return JSON.parse(el.textContent ?? "");
        } catch {
          return null;
        }
      })
      .find((data) => data?.["@type"] === "BreadcrumbList");

    if (!breadcrumbJson) {
      issues.push("BreadcrumbList JSON-LD not found");
    }

    const localBusiness = [
      ...document.querySelectorAll('script[type="application/ld+json"]'),
    ]
      .map((el) => {
        try {
          return JSON.parse(el.textContent ?? "");
        } catch {
          return null;
        }
      })
      .find((data) => data?.["@type"] === "LocalBusiness");

    if (!localBusiness) {
      issues.push("LocalBusiness JSON-LD not found");
    }

    const tel = [...document.querySelectorAll('a[href^="tel:"]')].map(
      (a) => a.getAttribute("href") ?? "",
    );
    if (!tel.some((href) => href === "tel:01636924387")) {
      issues.push(`tel: href missing or wrong: ${tel.join(", ") || "none"}`);
    }

    const mailto = [...document.querySelectorAll('a[href^="mailto:"]')].map(
      (a) => a.getAttribute("href") ?? "",
    );
    if (!mailto.some((href) => href === "mailto:info@ghpolsterei.de")) {
      issues.push(
        `mailto: href missing or wrong: ${mailto.join(", ") || "none"}`,
      );
    }

    const wa = [...document.querySelectorAll('a[href^="https://wa.me/"]')];
    if (wa.length < 1) {
      issues.push("wa.me link missing");
    } else if (!wa.every((a) => (a.getAttribute("href") ?? "").startsWith("https://wa.me/491636924387"))) {
      issues.push(
        `wa.me href unexpected: ${wa.map((a) => a.getAttribute("href")).join(", ")}`,
      );
    }

    const labels = [...document.querySelectorAll("label")].map((el) =>
      (el.textContent ?? "").replace(/\s+/g, " ").trim(),
    );

    return {
      viewport: vp,
      issues,
      h1: h1s[0]?.textContent?.trim() ?? "",
      title: document.title,
      labels,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  }, viewport);
}

async function fillValidForm(page, options = {}) {
  await page.getByLabel("Name", { exact: true }).fill("Anna Muster");
  if (options.email !== false) {
    await page.getByLabel("E-Mail", { exact: true }).fill(
      options.email ?? "anna@example.com",
    );
  }
  if (options.phone) {
    await page.getByLabel("Telefon", { exact: true }).fill(options.phone);
  }
  await page.getByLabel("Leistung / Anliegen").selectOption("aufpolstern");
  await page.getByRole("textbox", { name: "Nachricht" }).fill(
    "Bitte um ein Angebot für ein Sofa in Wesseling.",
  );
  if (options.privacy !== false) {
    await page.getByLabel(/Datenschutzerklärung/).check();
  }
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const results = [];

  const pageResponse = await fetch(pageUrl);
  results.push({
    viewport: "http:/kontakt",
    status: pageResponse.status,
    issues:
      pageResponse.status === 200
        ? []
        : [`HTTP ${pageResponse.status}`],
  });

  const browser = await chromium.launch();

  for (const vp of [
    { name: "1440x1200", width: 1440, height: 1200 },
    { name: "390x844", width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    await settleForFullPageScreenshot(page);

    const file = path.join(outDir, `kontakt-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`Screenshot: ${file}`);

    const dom = await runDomChecks(page, `kontakt-${vp.name}`);
    for (const label of expectedLabels) {
      const found = dom.labels.some((text) => text.includes(label));
      if (!found) {
        dom.issues.push(`Missing form label: ${label}`);
      }
    }
    if (!dom.labels.some((text) => text.includes("Datenschutzerklärung"))) {
      dom.issues.push("Missing privacy checkbox label");
    }
    results.push(dom);
    if (dom.issues.length) {
      console.log(`DOM issues [${vp.name}]:`, dom.issues);
    }
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    await page.getByRole("button", { name: "Kostenloses Angebot anfragen" }).click();
    await page.waitForTimeout(200);

    const requiredIssues = [];
    const nameError = await page.locator("#main-content").getByText("Bitte geben Sie Ihren Namen an.").count();
    const contactError = await page.getByText("Bitte geben Sie mindestens eine E-Mail-Adresse oder Telefonnummer an.").count();
    const serviceError = await page.getByText("Bitte wählen Sie ein Anliegen.").count();
    const messageError = await page.getByText("Bitte beschreiben Sie Ihr Anliegen").count();
    const privacyError = await page.getByText("Bitte bestätigen Sie die Datenschutzerklärung.").count();

    if (!nameError) requiredIssues.push("Name required message missing");
    if (!contactError) requiredIssues.push("Email-or-phone required message missing");
    if (!serviceError) requiredIssues.push("Service required message missing");
    if (!messageError) requiredIssues.push("Message required message missing");
    if (!privacyError) requiredIssues.push("Privacy required message missing");

    await settleForFullPageScreenshot(page);
    const errorShot = path.join(outDir, "kontakt-validation-1440x1200.png");
    await page.screenshot({ path: errorShot, fullPage: true });
    console.log(`Screenshot: ${errorShot}`);

    results.push({
      viewport: "client-required-validation",
      issues: requiredIssues,
    });
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    await fillValidForm(page, { email: false, privacy: true });
    await page.getByRole("button", { name: "Kostenloses Angebot anfragen" }).click();
    await page.waitForTimeout(200);
    const visible = await page
      .getByText("Bitte geben Sie mindestens eine E-Mail-Adresse oder Telefonnummer an.")
      .count();
    results.push({
      viewport: "client-email-or-phone",
      issues: visible ? [] : ["Email-or-phone group error missing"],
    });
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    await fillValidForm(page, { email: "nicht-gueltig", privacy: true });
    await page.getByRole("button", { name: "Kostenloses Angebot anfragen" }).click();
    await page.waitForTimeout(200);
    const visible = await page
      .getByText("Bitte geben Sie eine gültige E-Mail-Adresse an.")
      .count();
    results.push({
      viewport: "client-invalid-email",
      issues: visible ? [] : ["Invalid email message missing"],
    });
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    await fillValidForm(page, { privacy: false });
    await page.getByRole("button", { name: "Kostenloses Angebot anfragen" }).click();
    await page.waitForTimeout(200);
    const visible = await page
      .getByText("Bitte bestätigen Sie die Datenschutzerklärung.")
      .count();
    results.push({
      viewport: "client-privacy",
      issues: visible ? [] : ["Privacy checkbox error missing"],
    });
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.route("**/api/contact", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.goto(pageUrl, { waitUntil: "load" });
    await fillValidForm(page);
    const submit = page.getByRole("button", {
      name: "Kostenloses Angebot anfragen",
    });
    await submit.click();
    const loadingVisible = await page
      .getByRole("button", { name: "Wird gesendet …" })
      .isDisabled();
    const loadingIssues = loadingVisible
      ? []
      : ["Submit loading/disabled state missing"];
    await page.getByText("Vielen Dank für Ihre Anfrage.").waitFor({
      timeout: 5000,
    });
    await settleForFullPageScreenshot(page);
    const successShot = path.join(outDir, "kontakt-success-1440x1200.png");
    await page.screenshot({ path: successShot, fullPage: true });
    console.log(`Screenshot: ${successShot}`);
    results.push({
      viewport: "client-loading-and-success",
      issues: loadingIssues,
    });
    await context.close();
  }

  const fixtureDir = path.join(tmpdir(), "ghpolsterei-contact-qa");
  await mkdir(fixtureDir, { recursive: true });
  const mediumJpeg = path.join(fixtureDir, "medium.jpg");
  const largeJpeg = path.join(fixtureDir, "large.jpg");
  const mediumSize = writeNoisyJpeg(mediumJpeg, 2000, 1400, 90);
  const largeSize = writeNoisyJpeg(largeJpeg, 3600, 2700, 85);
  console.log(`Fixtures: medium ${mediumSize} B, large ${largeSize} B`);

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.goto(pageUrl, { waitUntil: "load" });
    await fillValidForm(page);
    await page.locator('input[name="photos"]').setInputFiles(
      Array.from({ length: 5 }, (_, index) => ({
        name: `foto-${index}.jpg`,
        mimeType: "image/jpeg",
        buffer: readFileSync(mediumJpeg),
      })),
    );
    await page.getByText(/Fotos bereit/).waitFor({ timeout: 20000 });
    const readyText = (await page.getByText(/Fotos bereit/).textContent()) ?? "";
    const mbMatch = readyText.replace(",", ".").match(/([\d.]+)\s*MB/);
    const readyMb = mbMatch ? Number(mbMatch[1]) : Infinity;
    const issues = [];
    if (readyMb > 3.5) {
      issues.push(`Processed total ${readyMb} MB exceeds 3.5 MB`);
    }
    await page.getByRole("button", { name: "Kostenloses Angebot anfragen" }).click();
    await page.getByText("Vielen Dank für Ihre Anfrage.").waitFor({ timeout: 8000 });
    results.push({ viewport: "client-five-optimized", issues });
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    const issues = [];
    if (largeSize < 7 * 1024 * 1024 || largeSize > 8 * 1024 * 1024) {
      issues.push(`Large fixture size ${largeSize} is not 7–8 MB`);
    }
    await page.locator('input[name="photos"]').setInputFiles({
      name: "telefon.jpg",
      mimeType: "image/jpeg",
      buffer: readFileSync(largeJpeg),
    });
    try {
      await page.getByText(/^\d+ Foto/).waitFor({ timeout: 90000 });
    } catch {
      const err =
        (await page.locator("p").filter({ hasText: "nicht vorbereitet" }).textContent()) ||
        (await page.locator("p").filter({ hasText: "zu groß" }).textContent()) ||
        "";
      issues.push(
        `7–8 MB JPEG was not optimized to a ready state${err.trim() ? `: ${err.trim()}` : ""}`,
      );
    }
    results.push({ viewport: "client-large-jpeg-optimize", issues, largeSize });
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    await page.locator('input[name="photos"]').setInputFiles({
      name: "zu-gross.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.alloc(8 * 1024 * 1024 + 1),
    });
    const visible = await page
      .getByText("Jedes Foto darf höchstens 8 MB groß sein.")
      .count();
    results.push({
      viewport: "client-reject-over-8mb",
      issues: visible ? [] : [">8 MB raw file was not rejected"],
    });
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    await page.locator('input[name="photos"]').setInputFiles(
      Array.from({ length: 6 }, (_, index) => ({
        name: `extra-${index}.png`,
        mimeType: "image/png",
        buffer: PNG_1X1,
      })),
    );
    const visible = await page
      .getByText("Bitte höchstens 5 Fotos auswählen.")
      .count();
    results.push({
      viewport: "client-reject-six-files",
      issues: visible ? [] : ["6 files were not rejected"],
    });
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    await page.locator('input[name="photos"]').setInputFiles({
      name: "plan.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4"),
    });
    const visible = await page
      .getByText("Bitte nur JPG, PNG oder WebP hochladen.")
      .count();
    results.push({
      viewport: "client-reject-pdf",
      issues: visible ? [] : ["PDF was not rejected"],
    });
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.createImageBitmap = () => Promise.reject(new Error("qa-force-fail"));
    });
    await page.goto(pageUrl, { waitUntil: "load" });
    await page.locator('input[name="photos"]').setInputFiles({
      name: "werkstatt.png",
      mimeType: "image/png",
      buffer: PNG_1X1,
    });
    const visible = await page
      .getByText("Die Fotos konnten nicht vorbereitet werden.")
      .count();
    results.push({
      viewport: "client-compression-failure",
      issues: visible ? [] : ["Compression failure did not show an upload error"],
    });
    await context.close();
  }

  {
    const svg = new File(
      ['<svg xmlns="http://www.w3.org/2000/svg"></svg>'],
      "payload.svg",
      { type: "image/svg+xml" },
    );
    const invalidType = await postContact(
      validFormData({ photos: [svg] }),
    );
    const typeOk =
      invalidType.status === 400 &&
      invalidType.json?.fields?.photos &&
      String(invalidType.json.fields.photos).includes("JPG");
    results.push({
      viewport: "api-invalid-file-type",
      status: invalidType.status,
      issues: typeOk ? [] : [`Unexpected: ${JSON.stringify(invalidType.json)}`],
    });
  }

  {
    const big = Buffer.alloc(1024 * 1024 + 64);
    big[0] = 0xff;
    big[1] = 0xd8;
    big[2] = 0xff;
    const large = new File([big], "gross.jpg", { type: "image/jpeg" });
    const oversized = await postContact(validFormData({ photos: [large] }));
    const sizeOk =
      oversized.status === 400 &&
      String(oversized.json?.fields?.photos ?? "").length > 0;
    results.push({
      viewport: "api-large-file",
      status: oversized.status,
      issues: sizeOk ? [] : [`Unexpected: ${JSON.stringify(oversized.json)}`],
    });
  }

  {
    const photos = Array.from({ length: 4 }, (_, index) => {
      const buf = Buffer.alloc(900 * 1024);
      buf[0] = 0xff;
      buf[1] = 0xd8;
      buf[2] = 0xff;
      return new File([buf], `bypass-${index}.jpg`, { type: "image/jpeg" });
    });
    const bypass = await postContact(validFormData({ photos }));
    const bypassOk =
      bypass.status === 413 &&
      bypass.json?.ok === false &&
      bypass.json?.error === "generic";
    results.push({
      viewport: "api-payload-bypass",
      status: bypass.status,
      issues: bypassOk ? [] : [`Unexpected: ${JSON.stringify(bypass.json)}`],
    });
  }

  {
    const mismatch = new File(
      [Buffer.from("%PDF-1.4 fake")],
      "angebot.jpg",
      { type: "image/jpeg" },
    );
    const magic = await postContact(validFormData({ photos: [mismatch] }));
    const magicOk =
      magic.status === 400 &&
      String(magic.json?.fields?.photos ?? "").includes("JPG");
    results.push({
      viewport: "api-magic-mismatch",
      status: magic.status,
      issues: magicOk ? [] : [`Unexpected: ${JSON.stringify(magic.json)}`],
    });
  }

  {
    const photos = Array.from({ length: 6 }, (_, index) => {
      const copy = Uint8Array.from(PNG_1X1);
      return new File([copy], `foto-${index}.png`, { type: "image/png" });
    });
    const tooMany = await postContact(validFormData({ photos }));
    const countOk =
      tooMany.status === 400 &&
      String(tooMany.json?.fields?.photos ?? "").includes("5 Fotos");
    results.push({
      viewport: "api-max-file-count",
      status: tooMany.status,
      issues: countOk ? [] : [`Unexpected: ${JSON.stringify(tooMany.json)}`],
    });
  }

  {
    const honeypot = await postContact(
      validFormData({ company_website: "https://spam.example" }),
    );
    const silent =
      honeypot.status === 200 && honeypot.json?.ok === true;
    results.push({
      viewport: "api-honeypot",
      status: honeypot.status,
      issues: silent
        ? []
        : [`Honeypot should silently succeed, got ${JSON.stringify(honeypot.json)}`],
    });
  }

  {
    const fast = await postContact(
      validFormData({ _t: signTimestamp(Date.now()) }),
    );
    const rejected =
      fast.status === 400 &&
      fast.json?.ok === false &&
      fast.json?.error === "generic" &&
      !JSON.stringify(fast.json).toLowerCase().includes("honeypot") &&
      !JSON.stringify(fast.json).toLowerCase().includes("turnstile") &&
      !JSON.stringify(fast.json).toLowerCase().includes("time");
    results.push({
      viewport: "api-time-trap",
      status: fast.status,
      issues: rejected
        ? []
        : [`Time trap should generic-fail, got ${JSON.stringify(fast.json)}`],
    });
  }

  await browser.close();

  const reportPath = path.join(outDir, "kontakt-dom-check-results.json");
  await writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report: ${reportPath}`);

  const failed = results.some((row) => row.issues?.length);
  if (failed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
