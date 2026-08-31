import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { settleForFullPageScreenshot } from "./qa-settle.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "docs/screenshots");
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

const desktopPages = [
  { name: "home", path: "/" },
  { name: "leistungen", path: "/leistungen" },
  { name: "leistungen-neu-bezug", path: "/leistungen/neu-bezug-von-polstermoebeln" },
  { name: "leistungen-cabrio", path: "/leistungen/cabrio-neu-beziehen" },
  { name: "projekte", path: "/projekte" },
  { name: "kontakt", path: "/kontakt" },
];

const mobilePages = [
  { name: "home", path: "/" },
  { name: "leistungen", path: "/leistungen" },
  { name: "projekte", path: "/projekte" },
  { name: "kontakt", path: "/kontakt" },
];

async function settleLazyImages(page) {
  await settleForFullPageScreenshot(page);
}

async function inspectPage(page, viewport) {
  return page.evaluate((vp) => {
    const issues = [];

    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
      issues.push(
        `Horizontal overflow: ${document.documentElement.scrollWidth} > ${window.innerWidth}`,
      );
    }

    const headerLogo = document.querySelector("header img");
    const footerLogo = document.querySelector("footer img");
    const headerRect = headerLogo?.getBoundingClientRect();
    const footerRect = footerLogo?.getBoundingClientRect();

    if (!headerRect || headerRect.height < 48) {
      issues.push(`Header logo too small: ${headerRect?.height ?? "missing"}`);
    }
    if (!footerRect || footerRect.height < 60) {
      issues.push(`Footer logo too small: ${footerRect?.height ?? "missing"}`);
    }

    const darkButtons = [...document.querySelectorAll("a, button")].filter((el) => {
      const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
      if (!text || text.length < 2) return false;
      let node = el.parentElement;
      while (node) {
        const bg = getComputedStyle(node).backgroundColor;
        if (bg.includes("19, 29, 59") || bg.includes("13, 21, 43")) return true;
        node = node.parentElement;
      }
      return false;
    });

    const invisible = [];
    for (const el of darkButtons) {
      const style = getComputedStyle(el);
      const color = style.color;
      const bg = style.backgroundColor;
      const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
      if (color === bg) {
        invisible.push(text.slice(0, 40));
        continue;
      }
      const rgb = color.match(/\d+/g)?.map(Number);
      if (rgb && rgb.length >= 3 && rgb[0] < 40 && rgb[1] < 40 && rgb[2] < 60 && bg === "rgba(0, 0, 0, 0)") {
        invisible.push(`${text.slice(0, 40)} color=${color}`);
      }
    }
    if (invisible.length) {
      issues.push(`Invisible dark-section CTA: ${invisible.join(" | ")}`);
    }

    const projectImgs = [
      ...document.querySelectorAll(
        'section[aria-labelledby="projekte-heading"] img, section[aria-label="Projektgalerie"] img',
      ),
    ];
    const unloaded = projectImgs.filter((img) => !img.naturalWidth);
    if (unloaded.length) {
      issues.push(`${unloaded.length} project image(s) not loaded`);
    }

    return {
      viewport: vp,
      issues,
      headerLogo: headerRect
        ? { width: Math.round(headerRect.width), height: Math.round(headerRect.height) }
        : null,
      footerLogo: footerRect
        ? { width: Math.round(footerRect.width), height: Math.round(footerRect.height) }
        : null,
      darkButtonCount: darkButtons.length,
      darkButtonLabels: darkButtons.map((el) =>
        (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 48),
      ),
    };
  }, viewport);
}

async function shot(browser, { width, height, name, path: pagePath }) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const response = await page.goto(`${baseUrl}${pagePath}`, { waitUntil: "load" });
  await settleLazyImages(page);
  const file = path.join(outDir, `redesign-${name}-${width}x${height}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const report = await inspectPage(page, `${name}-${width}x${height}`);
  report.status = response?.status() ?? 0;
  report.file = file;
  if (report.status !== 200) {
    report.issues.push(`HTTP ${report.status}`);
  }
  await context.close();
  console.log(`Screenshot: ${file}`);
  if (report.issues.length) console.log(`Issues [${report.viewport}]:`, report.issues);
  return report;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  for (const page of desktopPages) {
    results.push(
      await shot(browser, {
        width: 1440,
        height: 1200,
        name: page.name,
        path: page.path,
      }),
    );
  }

  for (const page of mobilePages) {
    results.push(
      await shot(browser, {
        width: 390,
        height: 844,
        name: page.name,
        path: page.path,
      }),
    );
  }

  await browser.close();

  const reportPath = path.join(outDir, "redesign-dom-check-results.json");
  await writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report: ${reportPath}`);

  const failed = results.some((row) => row.issues?.length);
  if (failed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
