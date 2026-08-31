import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { settleForFullPageScreenshot } from "./qa-settle.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "docs/screenshots");
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

const viewports = [
  { name: "1440x1200", width: 1440, height: 1200 },
  { name: "1024x1366", width: 1024, height: 1366 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
];

async function runDomChecks(page, viewport) {
  return page.evaluate((vp) => {
    const issues = [];
    const scrollOverflow = document.documentElement.scrollWidth > window.innerWidth;
    if (scrollOverflow) {
      issues.push(
        `Horizontal overflow: scrollWidth=${document.documentElement.scrollWidth} > innerWidth=${window.innerWidth}`,
      );
    }

    const h1s = document.querySelectorAll("h1");
    if (h1s.length !== 1) {
      issues.push(`Expected 1 H1, found ${h1s.length}`);
    }

    const imgs = [...document.querySelectorAll("img")];
    const missingAlt = imgs.filter((img) => !img.getAttribute("alt")?.trim());
    if (missingAlt.length) {
      issues.push(`${missingAlt.length} image(s) missing alt`);
    }

    const badLinks = [...document.querySelectorAll("a[href]")].filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return href === "" || href === "#";
    });
    if (badLinks.length) {
      issues.push(`${badLinks.length} link(s) with empty or # href`);
    }

    const wa = document.querySelector('a[aria-label*="WhatsApp"]');
    if (!wa || !wa.href.startsWith("https://wa.me/")) {
      issues.push(`WhatsApp link invalid: ${wa?.href ?? "missing"}`);
    }

    const telLinks = [...document.querySelectorAll('a[href^="tel:"]')];
    if (!telLinks.length) {
      issues.push("No tel: links found");
    }

    const mailLinks = [...document.querySelectorAll('a[href^="mailto:"]')];
    if (!mailLinks.length) {
      issues.push("No mailto: links found");
    }

    return { viewport: vp, issues, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth };
  }, viewport.name);
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: "load" });
    await settleForFullPageScreenshot(page);

    const file = path.join(outDir, `homepage-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`Screenshot: ${file}`);

    const dom = await runDomChecks(page, vp.name);
    results.push(dom);
    if (dom.issues.length) {
      console.log(`DOM issues [${vp.name}]:`, dom.issues);
    } else {
      console.log(`DOM checks passed [${vp.name}]`);
    }

    await context.close();
  }

  // Mobile menu test on 390x844
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    const menuBtn = page.locator('button[aria-controls="mobile-menu"]');
    await menuBtn.click();
    await page.waitForTimeout(100);
    const menuOpen = await page.locator("#mobile-menu").isVisible();
    const firstNav = await page.locator("#mobile-menu a").first().textContent();
    results.push({
      viewport: "390x844-menu",
      menuOpen,
      firstNavLink: firstNav?.trim(),
      issues: menuOpen ? [] : ["Mobile menu did not open"],
    });
    await page.screenshot({
      path: path.join(outDir, "homepage-390x844-menu-open.png"),
      fullPage: false,
    });
    await context.close();
  }

  await browser.close();

  const reportPath = path.join(outDir, "dom-check-results.json");
  await writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report: ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
