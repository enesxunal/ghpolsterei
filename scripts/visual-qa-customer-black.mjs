import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { settleForFullPageScreenshot } from "./qa-settle.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "docs/screenshots");
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

const forbiddenRgb = [
  "rgb(19, 29, 59)",
  "rgb(13, 21, 43)",
  "#131d3b",
  "#0d152b",
];

const jobs = [
  { name: "customer-black-revision-home-1440", path: "/", width: 1440, height: 1200 },
  { name: "customer-black-revision-kontakt-1440", path: "/kontakt", width: 1440, height: 1200 },
  { name: "customer-black-revision-leistungen-1440", path: "/leistungen", width: 1440, height: 1200 },
  { name: "customer-black-revision-projekte-1440", path: "/projekte", width: 1440, height: 1200 },
  { name: "customer-black-revision-ueber-uns-1440", path: "/ueber-uns", width: 1440, height: 1200 },
  { name: "customer-black-revision-home-390", path: "/", width: 390, height: 844 },
  { name: "customer-black-revision-kontakt-390", path: "/kontakt", width: 390, height: 844 },
];

function isForbiddenColor(value) {
  const normalized = (value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  return forbiddenRgb.some((item) => normalized.includes(item));
}

async function inspect(page, pagePath) {
  return page.evaluate(
    ({ currentPath, forbidden }) => {
      const issues = [];
      const bodyText = document.body.innerText;
      const samples = {};

      const header = document.querySelector("header");
      const footer = document.querySelector("footer");
      const hero = document.querySelector("main section");
      if (header) samples.header = getComputedStyle(header).backgroundColor;
      if (footer) samples.footer = getComputedStyle(footer).backgroundColor;
      if (hero) samples.hero = getComputedStyle(hero).backgroundColor;

      for (const [name, color] of Object.entries(samples)) {
        const lower = color.toLowerCase();
        for (const banned of forbidden) {
          if (lower.includes(banned)) {
            issues.push(`${name} still uses navy color: ${color}`);
          }
        }
      }

      if (document.documentElement.scrollWidth > window.innerWidth + 1) {
        issues.push(
          `Horizontal overflow: ${document.documentElement.scrollWidth} > ${window.innerWidth}`,
        );
      }

      const h1s = document.querySelectorAll("h1");
      if (h1s.length !== 1) issues.push(`Expected 1 H1, found ${h1s.length}`);

      if (bodyText.includes("gh.polsterei@gmail.com")) {
        issues.push("Legacy Gmail still visible");
      }
      if (!bodyText.includes("info@ghpolsterei.de")) {
        issues.push("info@ghpolsterei.de missing");
      }
      if (/\bMo\s*[–\-]\s*Sa\b/.test(bodyText)) {
        issues.push("Old Mo–Sa hours still visible");
      }
      if (!bodyText.includes("nach Absprache")) {
        issues.push("Saturday nach Absprache missing");
      }

      if (currentPath === "/") {
        if (!bodyText.includes("Kostenlose Beratung")) {
          issues.push("Homepage missing Kostenlose Beratung");
        }
        if (!bodyText.includes("Zertifikat")) {
          issues.push("Homepage missing Zertifikat");
        }
        if (bodyText.includes("Persönliche Beratung")) {
          issues.push("Homepage still shows Persönliche Beratung");
        }
        const h1 = (h1s[0]?.textContent ?? "").replace(/\s+/g, " ").trim();
        if (h1 !== "Polsterei & Sattlerei in Wesseling") {
          issues.push(`H1 unexpected: "${h1}"`);
        }
      }

      if (currentPath === "/ueber-uns") {
        if (!bodyText.includes("Abhol-/Lieferservice nach Absprache")) {
          issues.push("Über uns missing Abhol-/Lieferservice nach Absprache");
        }
      }

      return {
        issues,
        samples,
        h1: (h1s[0]?.textContent ?? "").replace(/\s+/g, " ").trim(),
      };
    },
    { currentPath: pagePath, forbidden: forbiddenRgb },
  );
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const results = [];
  const browser = await chromium.launch();

  for (const job of jobs) {
    const context = await browser.newContext({
      viewport: { width: job.width, height: job.height },
    });
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}${job.path}`, { waitUntil: "load" });
    await settleForFullPageScreenshot(page);

    const file = path.join(outDir, `${job.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`Screenshot: ${file}`);

    const dom = await inspect(page, job.path);
    if (Object.values(dom.samples ?? {}).some(isForbiddenColor)) {
      dom.issues.push("Forbidden navy RGB found in color samples");
    }
    results.push({
      viewport: job.name,
      status: response?.status() ?? null,
      issues: dom.issues,
      samples: dom.samples,
      h1: dom.h1,
    });

    await context.close();
  }

  await browser.close();

  const reportPath = path.join(outDir, "customer-black-revision-dom-check-results.json");
  await writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report: ${reportPath}`);

  const failed = results.some((row) => row.issues?.length);
  if (failed) {
    for (const row of results.filter((item) => item.issues?.length)) {
      console.log(`FAIL [${row.viewport}]:`, row.issues, row.samples);
    }
    process.exit(1);
  }

  for (const row of results) {
    console.log(`OK [${row.viewport}]`, row.samples);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
