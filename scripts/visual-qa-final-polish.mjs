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
  { name: "projekte", path: "/projekte" },
  { name: "kontakt", path: "/kontakt" },
];

const mobilePages = [
  { name: "home", path: "/" },
  { name: "leistungen", path: "/leistungen" },
  { name: "projekte", path: "/projekte" },
  { name: "kontakt", path: "/kontakt" },
];

const bannedClaims = [
  "15+",
  "1.500+",
  "1.500",
  "2.500+",
  "2.500",
  "150+",
  "20%",
  "Neukunden-Rabatt",
  "20% Rabatt",
  "generationenbetriebener",
  "generationenbetrieb",
  "zertifiziert",
  "Zertifiziert",
  "Familienbetrieb",
  "jahrzehnt",
  "langjährig",
];

const expectedServiceTitles = [
  "Polstermöbel neu beziehen",
  "Cabrioverdecke neu beziehen",
  "Möbel aufpolstern",
  "Markisen & Planen",
  "Gastronomie-Sitzbänke: Neubau & Restaurierung",
  "Autositze neu beziehen & restaurieren",
];

async function inspectPage(page, viewport, pagePath) {
  return page.evaluate(
    ({ vp, pagePath: currentPath, banned, expectedTitles }) => {
      const issues = [];

      if (document.documentElement.scrollWidth > window.innerWidth + 1) {
        issues.push(
          `Horizontal overflow: ${document.documentElement.scrollWidth} > ${window.innerWidth}`,
        );
      }

      if (window.scrollY !== 0) {
        issues.push(`Screenshot scrollY is ${window.scrollY}, expected 0`);
      }

      const header = document.querySelector("header");
      const headerStyle = header ? getComputedStyle(header) : null;
      const isMobile = window.innerWidth < 1024;
      if (headerStyle && isMobile && (headerStyle.position === "sticky" || headerStyle.position === "fixed")) {
        issues.push(`Mobile header is ${headerStyle.position}; expected static`);
      }
      if (headerStyle && !isMobile && headerStyle.position !== "sticky") {
        issues.push(`Desktop header is ${headerStyle.position}; expected sticky`);
      }

      const headerRect = header?.getBoundingClientRect();
      if (headerRect && (headerRect.top < -4 || headerRect.top > 8) && window.scrollY === 0) {
        issues.push(`Header top at ${Math.round(headerRect.top)}px after scroll-to-top`);
      }

      const h1s = document.querySelectorAll("h1");
      if (h1s.length !== 1) {
        issues.push(`Expected 1 H1, found ${h1s.length}`);
      }
      const h1 = (h1s[0]?.textContent ?? "").replace(/\s+/g, " ").trim();
      if (currentPath === "/" && h1 !== "Polsterei & Sattlerei in Wesseling") {
        issues.push(`Homepage H1 mismatch: "${h1}"`);
      }

      const bodyText = document.body.innerText;
      for (const claim of banned) {
        if (bodyText.includes(claim)) {
          issues.push(`Unverified claim still visible: "${claim}"`);
        }
      }

      if (currentPath === "/leistungen") {
        for (const title of expectedTitles) {
          if (!bodyText.includes(title)) {
            issues.push(`Missing service title: ${title}`);
          }
        }
        const stale = [
          "Neu Bezug von Polstermöbeln",
          "Cabrio neu beziehen",
          "Neubau/Restaurierung von Gastronomie Sitzbänken",
          "Sattlerei Arbeiten wie Autositze",
        ];
        for (const title of stale) {
          if (bodyText.includes(title)) {
            issues.push(`Stale service title still visible: ${title}`);
          }
        }
      }

      if (currentPath === "/leistungen/neu-bezug-von-polstermoebeln" && h1 !== "Polstermöbel neu beziehen") {
        issues.push(`Detail H1 mismatch: "${h1}"`);
      }

      const headerLogo = document.querySelector("header img");
      const footerLogo = document.querySelector("footer img");
      const headerLogoRect = headerLogo?.getBoundingClientRect();
      const footerLogoRect = footerLogo?.getBoundingClientRect();
      const minHeader = isMobile ? 54 : 72;
      const minFooter = isMobile ? 76 : 88;
      if (!headerLogoRect || headerLogoRect.height < minHeader) {
        issues.push(`Header logo too small: ${headerLogoRect?.height ?? "missing"}`);
      }
      if (!footerLogoRect || footerLogoRect.height < minFooter) {
        issues.push(`Footer logo too small: ${footerLogoRect?.height ?? "missing"}`);
      }

      const wa = document.querySelector('a[aria-label*="WhatsApp"]');
      if (!wa || !wa.href.startsWith("https://wa.me/")) {
        issues.push(`WhatsApp link invalid: ${wa?.href ?? "missing"}`);
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
        if (
          rgb &&
          rgb.length >= 3 &&
          rgb[0] < 40 &&
          rgb[1] < 40 &&
          rgb[2] < 60 &&
          bg === "rgba(0, 0, 0, 0)"
        ) {
          invisible.push(`${text.slice(0, 40)} color=${color}`);
        }
      }
      if (invisible.length) {
        issues.push(`Invisible dark-section CTA: ${invisible.join(" | ")}`);
      }

      return {
        viewport: vp,
        issues,
        h1,
        scrollY: window.scrollY,
        headerPosition: headerStyle?.position ?? null,
        headerLogo: headerLogoRect
          ? { width: Math.round(headerLogoRect.width), height: Math.round(headerLogoRect.height) }
          : null,
        footerLogo: footerLogoRect
          ? { width: Math.round(footerLogoRect.width), height: Math.round(footerLogoRect.height) }
          : null,
      };
    },
    {
      vp: viewport,
      pagePath,
      banned: bannedClaims,
      expectedTitles: expectedServiceTitles,
    },
  );
}

async function shot(browser, { width, height, name, path: pagePath }) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const response = await page.goto(`${baseUrl}${pagePath}`, { waitUntil: "load" });
  await settleForFullPageScreenshot(page);
  const file = path.join(outDir, `final-polish-${name}-${width}x${height}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const report = await inspectPage(page, `${name}-${width}x${height}`, pagePath);
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

  const reportPath = path.join(outDir, "final-polish-dom-check-results.json");
  await writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report: ${reportPath}`);

  const failed = results.some((row) => row.issues?.length);
  if (failed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
