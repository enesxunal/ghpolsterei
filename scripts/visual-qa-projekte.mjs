import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { settleForFullPageScreenshot } from "./qa-settle.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "docs/screenshots");
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const pageUrl = `${baseUrl}/projekte`;

const viewports = [
  { name: "1440x1200", width: 1440, height: 1200 },
  { name: "390x844", width: 390, height: 844 },
];

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

    const galleryImgs = [
      ...document.querySelectorAll('section[aria-label="Projektgalerie"] img'),
    ];
    if (galleryImgs.length < 13) {
      issues.push(`Expected at least 13 gallery images, found ${galleryImgs.length}`);
    }

    const imgs = [...document.querySelectorAll("img")];
    const missingAlt = imgs.filter((img) => !img.getAttribute("alt")?.trim());
    if (missingAlt.length) {
      issues.push(`${missingAlt.length} image(s) missing alt`);
    }

    const breadcrumbJson = [...document.querySelectorAll('script[type="application/ld+json"]')]
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
    } else if (breadcrumbJson.itemListElement?.length !== 2) {
      issues.push(
        `BreadcrumbList expected 2 items, found ${breadcrumbJson.itemListElement?.length ?? 0}`,
      );
    }

    const wa = document.querySelector('a[aria-label*="WhatsApp"]');
    if (!wa || !wa.href.startsWith("https://wa.me/")) {
      issues.push(`WhatsApp link invalid: ${wa?.href ?? "missing"}`);
    }

    return {
      viewport: vp,
      issues,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      galleryImageCount: galleryImgs.length,
    };
  }, viewport.name);
}

async function testLightbox(page, viewportName) {
  const issues = [];

  await page.goto(pageUrl, { waitUntil: "load" });
  await page.waitForTimeout(300);

  const firstThumb = page
    .locator('section[aria-label="Projektgalerie"] button')
    .first();
  await firstThumb.click();
  await page.waitForTimeout(200);

  const dialog = page.locator('[role="dialog"][aria-modal="true"]');
  const dialogVisible = await dialog.isVisible();
  if (!dialogVisible) {
    issues.push("Lightbox dialog did not open");
    return { viewport: `${viewportName}-lightbox`, issues };
  }

  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  if (bodyOverflow !== "hidden") {
    issues.push(`Scroll lock not applied: body.overflow="${bodyOverflow}"`);
  }

  await page.screenshot({
    path: path.join(outDir, `projekte-${viewportName}-lightbox.png`),
    fullPage: true,
  });

  const nextBtn = page.getByRole("button", { name: "Nächstes Bild" });
  await nextBtn.click();
  await page.waitForTimeout(150);
  const captionAfterNext = await page.locator("figcaption").textContent();
  if (!captionAfterNext?.includes("2 / ")) {
    issues.push(`Next navigation failed: caption="${captionAfterNext}"`);
  }

  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(150);
  const captionAfterPrev = await page.locator("figcaption").textContent();
  if (!captionAfterPrev?.includes("1 / ")) {
    issues.push(`ArrowLeft navigation failed: caption="${captionAfterPrev}"`);
  }

  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  const dialogClosed = !(await dialog.isVisible());
  if (!dialogClosed) {
    issues.push("Escape did not close lightbox");
  }

  await firstThumb.click();
  await page.waitForTimeout(150);
  await page.locator('[aria-label="Lightbox schließen"]').first().click({ position: { x: 8, y: 8 } });
  await page.waitForTimeout(150);
  if (await dialog.isVisible()) {
    issues.push("Backdrop click did not close lightbox");
  }

  return { viewport: `${viewportName}-lightbox`, issues };
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const results = [];

  const responseCheck = await fetch(pageUrl);
  results.push({
    viewport: "http",
    status: responseCheck.status,
    issues: responseCheck.status === 200 ? [] : [`HTTP ${responseCheck.status}`],
  });
  console.log(`HTTP ${responseCheck.status} for ${pageUrl}`);

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "load" });
    await settleForFullPageScreenshot(page);

    const file = path.join(outDir, `projekte-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`Screenshot: ${file}`);

    const dom = await runDomChecks(page, vp.name);
    results.push(dom);
    if (dom.issues.length) {
      console.log(`DOM issues [${vp.name}]:`, dom.issues);
    } else {
      console.log(`DOM checks passed [${vp.name}]`);
    }

    const lightbox = await testLightbox(page, vp.name);
    results.push(lightbox);
    if (lightbox.issues.length) {
      console.log(`Lightbox issues [${vp.name}]:`, lightbox.issues);
    } else {
      console.log(`Lightbox checks passed [${vp.name}]`);
    }

    await context.close();
  }

  await browser.close();

  const reportPath = path.join(outDir, "projekte-dom-check-results.json");
  await writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report: ${reportPath}`);

  const failed = results.some((r) => r.issues?.length);
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
