import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { settleForFullPageScreenshot } from "./qa-settle.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "docs/screenshots");
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

const serviceSlugs = [
  "neu-bezug-von-polstermoebeln",
  "cabrio-neu-beziehen",
  "aufpolstern",
  "markisen",
  "neubau-restaurierung-gastronomie-sitzbaenke",
  "sattlerei-autositze",
];

const screenshotServices = [
  "neu-bezug-von-polstermoebeln",
  "cabrio-neu-beziehen",
];

async function runDomChecks(page, viewport, options = {}) {
  const { expectServiceSchema = false } = options;

  return page.evaluate(
    ({ vp, expectService }) => {
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

      const jsonBlocks = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((el) => {
          try {
            return JSON.parse(el.textContent ?? "");
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const breadcrumbJson = jsonBlocks.find(
        (data) => data?.["@type"] === "BreadcrumbList",
      );
      if (!breadcrumbJson) {
        issues.push("BreadcrumbList JSON-LD not found");
      }

      if (expectService) {
        const serviceJson = jsonBlocks.find((data) => data?.["@type"] === "Service");
        if (!serviceJson) {
          issues.push("Service JSON-LD not found");
        }
      }

      const title = document.title;
      const metaDescription = document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content");

      return {
        viewport: vp,
        issues,
        title,
        metaDescription,
        h1: h1s[0]?.textContent?.trim() ?? "",
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      };
    },
    { vp: viewport, expectService: expectServiceSchema },
  );
}

async function checkRedirect(url, expectedPath) {
  let currentUrl = url;
  let hops = 0;
  const chain = [];

  while (hops < 5) {
    const response = await fetch(currentUrl, { redirect: "manual" });
    chain.push({
      url: currentUrl,
      status: response.status,
      location: response.headers.get("location"),
    });

    if (response.status !== 308 && response.status !== 301) {
      break;
    }

    const location = response.headers.get("location");
    if (!location) {
      break;
    }

    currentUrl = new URL(location, currentUrl).toString();
    hops += 1;
  }

  const finalPath = new URL(currentUrl).pathname.replace(/\/$/, "");
  const normalizedExpected = expectedPath.replace(/\/$/, "");
  const issues = [];

  if (!finalPath.endsWith(normalizedExpected)) {
    issues.push(
      `Final path "${finalPath}" does not match "${normalizedExpected}" (chain: ${JSON.stringify(chain)})`,
    );
  }

  return {
    viewport: `redirect:${url}`,
    chain,
    finalPath,
    issues,
  };
}

async function checkHomepageServiceLinks(page) {
  const issues = [];
  const hrefs = await page.$$eval(
    'section[aria-labelledby="leistungen-heading"] a[href^="/leistungen/"]',
    (links) => links.map((a) => a.getAttribute("href")),
  );

  if (hrefs.length !== 6) {
    issues.push(`Expected 6 homepage service links, found ${hrefs.length}`);
  }

  for (const href of hrefs) {
    if (!href) continue;
    const response = await fetch(`${baseUrl}${href}`);
    if (response.status !== 200) {
      issues.push(`Homepage service link ${href} returned ${response.status}`);
    }
  }

  return {
    viewport: "homepage-service-links",
    hrefs,
    issues,
  };
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const results = [];

  const overviewResponse = await fetch(`${baseUrl}/leistungen`);
  results.push({
    viewport: "http:/leistungen",
    status: overviewResponse.status,
    issues: overviewResponse.status === 200 ? [] : [`HTTP ${overviewResponse.status}`],
  });

  for (const slug of serviceSlugs) {
    const response = await fetch(`${baseUrl}/leistungen/${slug}`);
    results.push({
      viewport: `http:/leistungen/${slug}`,
      status: response.status,
      issues: response.status === 200 ? [] : [`HTTP ${response.status}`],
    });
  }

  results.push(
    await checkRedirect(`${baseUrl}/leistungsangebot/`, "/leistungen"),
  );
  results.push(
    await checkRedirect(`${baseUrl}/leistungsangebot`, "/leistungen"),
  );

  const detailTitles = new Map();

  for (const vp of [
    { name: "1440x1200", width: 1440, height: 1200 },
    { name: "390x844", width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/leistungen`, { waitUntil: "load" });
    await settleForFullPageScreenshot(page);

    const file = path.join(outDir, `leistungen-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`Screenshot: ${file}`);

    const dom = await runDomChecks(page, `leistungen-${vp.name}`);
    results.push(dom);
    if (dom.issues.length) {
      console.log(`DOM issues [leistungen ${vp.name}]:`, dom.issues);
    }

    await context.close();
  }

  for (const slug of screenshotServices) {
    for (const vp of [
      { name: "1440x1200", width: 1440, height: 1200 },
      { name: "390x844", width: 390, height: 844 },
    ]) {
      if (vp.name === "390x844" && slug === screenshotServices[1]) {
        continue;
      }

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();
      const pageUrl = `${baseUrl}/leistungen/${slug}`;
      await page.goto(pageUrl, { waitUntil: "load" });
      await settleForFullPageScreenshot(page);

      const file = path.join(outDir, `leistungen-${slug}-${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`Screenshot: ${file}`);

      const dom = await runDomChecks(page, `${slug}-${vp.name}`, {
        expectServiceSchema: true,
      });
      results.push(dom);

      if (dom.title) {
        const previousSlug = detailTitles.get(dom.title);
        if (previousSlug && previousSlug !== slug) {
          dom.issues.push(`Duplicate page title with ${previousSlug}: ${dom.title}`);
        } else {
          detailTitles.set(dom.title, slug);
        }
      }

      if (dom.issues.length) {
        console.log(`DOM issues [${slug} ${vp.name}]:`, dom.issues);
      }

      await context.close();
    }
  }

  for (const slug of serviceSlugs) {
    if (screenshotServices.includes(slug)) continue;

    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/leistungen/${slug}`, { waitUntil: "load" });
    await page.waitForTimeout(300);

    const dom = await runDomChecks(page, `${slug}-dom-only`, {
      expectServiceSchema: true,
    });
    results.push(dom);

    if (dom.title) {
      const previousSlug = detailTitles.get(dom.title);
      if (previousSlug && previousSlug !== slug) {
        dom.issues.push(`Duplicate page title with ${previousSlug}: ${dom.title}`);
      } else {
        detailTitles.set(dom.title, slug);
      }
    }

    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: "load" });
    await page.waitForTimeout(300);
    results.push(await checkHomepageServiceLinks(page));
    await context.close();
  }

  await browser.close();

  const reportPath = path.join(outDir, "leistungen-dom-check-results.json");
  await writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report: ${reportPath}`);

  const failed = results.some((r) => r.issues?.length);
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
