import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { settleForFullPageScreenshot } from "./qa-settle.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "docs/screenshots");
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

const jobs = [
  { name: "customer-revision-home-1440", path: "/", width: 1440, height: 1200 },
  { name: "customer-revision-leistungen-1440", path: "/leistungen", width: 1440, height: 1200 },
  { name: "customer-revision-projekte-1440", path: "/projekte", width: 1440, height: 1200 },
  {
    name: "customer-revision-cabrio-1440",
    path: "/leistungen/cabrio-neu-beziehen",
    width: 1440,
    height: 1200,
  },
  { name: "customer-revision-ueber-uns-1440", path: "/ueber-uns", width: 1440, height: 1200 },
  { name: "customer-revision-kontakt-1440", path: "/kontakt", width: 1440, height: 1200 },
  { name: "customer-revision-home-390", path: "/", width: 390, height: 844 },
  { name: "customer-revision-leistungen-390", path: "/leistungen", width: 390, height: 844 },
  { name: "customer-revision-projekte-390", path: "/projekte", width: 390, height: 844 },
  { name: "customer-revision-ueber-uns-390", path: "/ueber-uns", width: 390, height: 844 },
];

async function inspect(page, pagePath, width) {
  return page.evaluate(
    ({ currentPath, viewportWidth }) => {
      const issues = [];
      const bodyText = document.body.innerText;

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
      if (bodyText.includes("Persönliche Beratung") && currentPath === "/") {
        issues.push("Homepage still shows Persönliche Beratung");
      }
      if (bodyText.includes("Handwerksrolle Köln")) {
        issues.push("Old Handwerksrolle Köln label still visible");
      }
      if (bodyText.includes("Abholung in Wesseling")) {
        issues.push("Pickup still limited to Wesseling");
      }

      if (currentPath === "/") {
        if (!bodyText.includes("Kostenlose Beratung")) {
          issues.push("Homepage missing Kostenlose Beratung");
        }
        if (!bodyText.includes("Zertifikat")) {
          issues.push("Homepage missing Zertifikat");
        }
        const h1 = (h1s[0]?.textContent ?? "").replace(/\s+/g, " ").trim();
        if (h1 !== "Polsterei & Sattlerei in Wesseling") {
          issues.push(`H1 unexpected: "${h1}"`);
        }
        if (viewportWidth >= 1024) {
          const h1El = h1s[0];
          const range = document.createRange();
          const firstSpan = h1El?.querySelector("span");
          if (firstSpan) {
            range.selectNodeContents(firstSpan);
            const rects = [...range.getClientRects()];
            if (rects.length > 1) {
              issues.push("Desktop H1: Polsterei & Sattlerei wraps onto multiple lines");
            }
          }
        }
      }

      if (currentPath === "/ueber-uns" && !bodyText.includes("Abhol-/Lieferservice nach Absprache")) {
        issues.push("Über uns missing Abhol-/Lieferservice nach Absprache");
      }

      if (currentPath === "/leistungen/cabrio-neu-beziehen") {
        if (!bodyText.includes("Einblicke aus der Werkstatt")) {
          issues.push("Cabrio page missing workshop section");
        }
        const workshopImgs = [...document.querySelectorAll("img")].filter((img) =>
          (img.getAttribute("src") ?? "").includes("cabrio-verdeck-werkstatt"),
        );
        if (workshopImgs.length < 3) {
          issues.push(`Cabrio workshop images missing, found ${workshopImgs.length}`);
        }
      }

      if (currentPath === "/projekte") {
        const customerImgs = [...document.querySelectorAll("img")].filter((img) =>
          (img.getAttribute("src") ?? "").includes("customer-2026"),
        );
        if (customerImgs.length < 5) {
          issues.push(`Projekte missing new customer images, found ${customerImgs.length}`);
        }
      }

      return {
        issues,
        h1: (h1s[0]?.textContent ?? "").replace(/\s+/g, " ").trim(),
      };
    },
    { currentPath: pagePath, viewportWidth: width },
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

    const dom = await inspect(page, job.path, job.width);
    results.push({
      viewport: job.name,
      status: response?.status() ?? null,
      issues: dom.issues,
      h1: dom.h1,
    });

    await context.close();
  }

  await browser.close();

  const reportPath = path.join(outDir, "customer-revision-dom-check-results.json");
  await writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report: ${reportPath}`);

  const failed = results.some((row) => row.issues?.length);
  if (failed) {
    for (const row of results.filter((item) => item.issues?.length)) {
      console.log(`FAIL [${row.viewport}]:`, row.issues);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
