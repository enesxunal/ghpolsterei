import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { settleForFullPageScreenshot } from "./qa-settle.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "docs/screenshots");
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const canonicalBase = "https://ghpolsterei.de";

const serviceSlugs = [
  "neu-bezug-von-polstermoebeln",
  "cabrio-neu-beziehen",
  "aufpolstern",
  "markisen",
  "neubau-restaurierung-gastronomie-sitzbaenke",
  "sattlerei-autositze",
];

const marketingPages = [
  { path: "/", h1: "Polsterei & Sattlerei in Wesseling", index: true },
  { path: "/ueber-uns", h1: "Handwerk mit Anspruch", index: true },
  { path: "/leistungen", h1: "Leistungen der GH Polsterei", index: true },
  ...serviceSlugs.map((slug) => ({
    path: `/leistungen/${slug}`,
    h1: null,
    index: true,
  })),
  { path: "/projekte", h1: "Unsere Projekte", index: true },
  { path: "/kontakt", h1: "Ihr Projekt. Unsere Handarbeit.", index: true },
  { path: "/impressum", h1: "Anbieterkennzeichnung", index: false },
  { path: "/datenschutz", h1: "Datenschutzerklärung", index: false },
];

function parseJsonLd(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  while ((match = re.exec(html))) {
    try {
      blocks.push(JSON.parse(match[1]));
    } catch {
      blocks.push({ parseError: true });
    }
  }
  return blocks;
}

function metaContent(html, name) {
  const named = html.match(
    new RegExp(`<meta name="${name}" content="([^"]*)"`, "i"),
  );
  if (named) return named[1];
  return null;
}

function propertyContent(html, property) {
  const match = html.match(
    new RegExp(`<meta property="${property}" content="([^"]*)"`, "i"),
  );
  return match ? match[1] : null;
}

function canonicalHref(html) {
  const match = html.match(
    /<link rel="canonical" href="([^"]+)"/i,
  );
  return match ? match[1] : null;
}

function titleText(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1] : null;
}

function robotsContent(html) {
  return metaContent(html, "robots");
}

async function fetchStatus(url, options = {}) {
  const response = await fetch(url, {
    redirect: options.redirect ?? "manual",
  });
  return {
    status: response.status,
    location: response.headers.get("location"),
    text: options.body ? await response.text() : null,
    headers: response.headers,
  };
}

async function inspectDom(page, pagePath) {
  return page.evaluate((currentPath) => {
    const issues = [];

    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
      issues.push(
        `Horizontal overflow: ${document.documentElement.scrollWidth} > ${window.innerWidth}`,
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

    const bodyText = document.body.innerText;
    const banned = [
      "generationenbetriebener",
      "generationenbetrieb",
      "zertifiziert",
      "Familienbetrieb",
      "1.500+",
      "2.500+",
    ];
    const lower = bodyText.toLowerCase();
    for (const claim of banned) {
      if (lower.includes(claim.toLowerCase())) {
        issues.push(`Unverified claim still visible: "${claim}"`);
      }
    }

    const jsonBlocks = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((el) => {
        try {
          return JSON.parse(el.textContent ?? "");
        } catch {
          return { parseError: true };
        }
      });

    if (jsonBlocks.some((block) => block.parseError)) {
      issues.push("JSON-LD failed to parse");
    }

    const serialized = JSON.stringify(jsonBlocks);
    if (/aggregateRating|reviewRating|"@type":"Review"/i.test(serialized)) {
      issues.push("Fake review/rating schema present");
    }

    const breadcrumb = jsonBlocks.find((block) => block?.["@type"] === "BreadcrumbList");
    if (
      currentPath === "/ueber-uns" ||
      currentPath === "/leistungen" ||
      currentPath.startsWith("/leistungen/") ||
      currentPath === "/projekte" ||
      currentPath === "/kontakt"
    ) {
      if (!breadcrumb) issues.push("BreadcrumbList JSON-LD missing");
    }

    if (currentPath.startsWith("/leistungen/") && currentPath !== "/leistungen") {
      const service = jsonBlocks.find((block) => block?.["@type"] === "Service");
      if (!service) issues.push("Service JSON-LD missing");
    }

    if (currentPath === "/" || currentPath === "/kontakt") {
      const local = jsonBlocks.find((block) => block?.["@type"] === "LocalBusiness");
      if (!local) issues.push("LocalBusiness JSON-LD missing");
    }

    return {
      issues,
      h1: (h1s[0]?.textContent ?? "").replace(/\s+/g, " ").trim(),
      title: document.title,
      lang: document.documentElement.lang,
    };
  }, pagePath);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const results = [];
  const titles = new Map();
  const descriptions = new Map();

  const expected200 = [
    "/",
    "/ueber-uns",
    "/leistungen",
    ...serviceSlugs.map((slug) => `/leistungen/${slug}`),
    "/projekte",
    "/kontakt",
    "/impressum",
    "/datenschutz",
  ];

  for (const pagePath of expected200) {
    const response = await fetch(`${baseUrl}${pagePath}`);
    const issues = [];
    if (response.status !== 200) {
      issues.push(`Expected 200, got ${response.status}`);
    }
    results.push({ viewport: `http:${pagePath}`, status: response.status, issues });
  }

  {
    const unknown = await fetch(`${baseUrl}/diese-seite-gibt-es-nicht-${Date.now()}`);
    const issues = unknown.status === 404 ? [] : [`Unknown route expected 404, got ${unknown.status}`];
    results.push({ viewport: "http:unknown", status: unknown.status, issues });
  }

  {
    const gone = await fetchStatus(`${baseUrl}/hello-world`);
    const issues = gone.status === 410 ? [] : [` /hello-world expected 410, got ${gone.status}`];
    results.push({ viewport: "http:/hello-world", status: gone.status, issues });
  }

  {
    const redirect = await fetchStatus(`${baseUrl}/leistungsangebot`);
    const issues = [];
    if (redirect.status !== 308 && redirect.status !== 301) {
      issues.push(`/leistungsangebot expected 301/308, got ${redirect.status}`);
    }
    const location = redirect.location ?? "";
    if (!location.endsWith("/leistungen")) {
      issues.push(`/leistungsangebot location unexpected: ${location}`);
    }
    results.push({
      viewport: "redirect:/leistungsangebot",
      status: redirect.status,
      location,
      issues,
    });
  }

  {
    const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
    const xml = await sitemap.text();
    const issues = [];
    if (sitemap.status !== 200) issues.push(`sitemap.xml HTTP ${sitemap.status}`);
    if (!xml.includes(`${canonicalBase}/ueber-uns`)) {
      issues.push("sitemap missing /ueber-uns");
    }
    if (!xml.includes(`${canonicalBase}/leistungen`)) {
      issues.push("sitemap missing /leistungen");
    }
    if (xml.includes("/impressum") || xml.includes("/datenschutz")) {
      issues.push("sitemap includes noindex legal pages");
    }
    if (xml.includes("/api/")) issues.push("sitemap includes /api/");
    if (xml.includes("/hello-world")) issues.push("sitemap includes /hello-world");
    if (xml.includes("localhost")) issues.push("sitemap contains localhost");
    if (xml.includes("<lastmod>")) {
      issues.push("sitemap should omit lastmod without a content timestamp source");
    }
    results.push({ viewport: "http:/sitemap.xml", status: sitemap.status, issues });
  }

  {
    const home = await fetch(`${baseUrl}/`);
    const issues = [];
    const powered = home.headers.get("x-powered-by");
    if (powered) issues.push(`X-Powered-By present: ${powered}`);
    if (home.headers.get("x-content-type-options") !== "nosniff") {
      issues.push("missing X-Content-Type-Options: nosniff");
    }
    if (home.headers.get("x-frame-options") !== "DENY") {
      issues.push("missing X-Frame-Options: DENY");
    }
    results.push({
      viewport: "headers:/",
      status: home.status,
      issues,
    });
  }

  {
    const robots = await fetch(`${baseUrl}/robots.txt`);
    const text = await robots.text();
    const issues = [];
    if (robots.status !== 200) issues.push(`robots.txt HTTP ${robots.status}`);
    if (!text.includes("Disallow: /api/")) issues.push("robots missing Disallow: /api/");
    if (!text.includes(`${canonicalBase}/sitemap.xml`)) {
      issues.push(`robots sitemap URL missing ${canonicalBase}/sitemap.xml`);
    }
    if (text.includes("localhost")) issues.push("robots contains localhost");
    results.push({ viewport: "http:/robots.txt", status: robots.status, issues });
  }

  for (const page of marketingPages) {
    const response = await fetch(`${baseUrl}${page.path}`);
    const html = await response.text();
    const issues = [];
    const title = titleText(html);
    const description = metaContent(html, "description");
    const canonical = canonicalHref(html);
    const ogTitle = propertyContent(html, "og:title");
    const ogDescription = propertyContent(html, "og:description");
    const ogUrl = propertyContent(html, "og:url");
    const robots = robotsContent(html) ?? "";
    const jsonLd = parseJsonLd(html);

    if (!title) issues.push("Missing title");
    if (!description) issues.push("Missing meta description");
    if (canonical && canonical.includes("localhost")) {
      issues.push(`localhost canonical: ${canonical}`);
    }
    const expectedCanonical =
      page.path === "/" ? canonicalBase : `${canonicalBase}${page.path}`;
    if (canonical !== expectedCanonical) {
      issues.push(`canonical expected ${expectedCanonical}, got ${canonical}`);
    }
    if (ogTitle !== title) issues.push("OpenGraph title mismatch");
    if (ogDescription !== description) issues.push("OpenGraph description mismatch");
    if (ogUrl !== expectedCanonical) {
      issues.push(`OpenGraph URL expected ${expectedCanonical}, got ${ogUrl}`);
    }
    if (!html.includes('lang="de"')) issues.push('html lang is not "de"');

    if (page.index) {
      if (/noindex/i.test(robots)) issues.push("Indexable page has noindex");
    } else if (!/noindex/i.test(robots)) {
      issues.push("Legal page missing noindex");
    }

    if (jsonLd.some((block) => block.parseError)) {
      issues.push("JSON-LD parse error");
    }
    if (JSON.stringify(jsonLd).match(/aggregateRating|reviewRating/i)) {
      issues.push("Fake rating schema in HTML");
    }

    if (title) {
      const previous = titles.get(title);
      if (previous && previous !== page.path) {
        issues.push(`Duplicate title with ${previous}`);
      } else {
        titles.set(title, page.path);
      }
    }
    if (description) {
      const previous = descriptions.get(description);
      if (previous && previous !== page.path) {
        issues.push(`Duplicate description with ${previous}`);
      } else {
        descriptions.set(description, page.path);
      }
    }

    results.push({
      viewport: `meta:${page.path}`,
      title,
      description,
      canonical,
      issues,
    });
  }

  const browser = await chromium.launch();

  const screenshotJobs = [
    { name: "legal-seo-ueber-uns-1440x1200", path: "/ueber-uns", width: 1440, height: 1200 },
    { name: "legal-seo-impressum-1440x1200", path: "/impressum", width: 1440, height: 1200 },
    { name: "legal-seo-datenschutz-1440x1200", path: "/datenschutz", width: 1440, height: 1200 },
    { name: "legal-seo-not-found-1440x1200", path: "/diese-seite-gibt-es-nicht", width: 1440, height: 1200 },
    { name: "legal-seo-ueber-uns-390x844", path: "/ueber-uns", width: 390, height: 844 },
    { name: "legal-seo-datenschutz-390x844", path: "/datenschutz", width: 390, height: 844 },
  ];

  for (const job of screenshotJobs) {
    const context = await browser.newContext({
      viewport: { width: job.width, height: job.height },
    });
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}${job.path}`, { waitUntil: "load" });
    await settleForFullPageScreenshot(page);

    const file = path.join(outDir, `${job.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`Screenshot: ${file}`);

    const expectedH1 = marketingPages.find((item) => item.path === job.path)?.h1;
    const dom = await inspectDom(page, job.path);
    if (job.path === "/diese-seite-gibt-es-nicht") {
      if (response?.status() !== 404) {
        dom.issues.push(`not-found expected HTTP 404, got ${response?.status()}`);
      }
      if (dom.h1 !== "Diese Seite wurde nicht gefunden.") {
        dom.issues.push(`404 H1 mismatch: "${dom.h1}"`);
      }
    } else if (expectedH1 && dom.h1 !== expectedH1) {
      dom.issues.push(`H1 expected "${expectedH1}", got "${dom.h1}"`);
    }
    if (dom.lang !== "de") {
      dom.issues.push(`lang expected de, got ${dom.lang}`);
    }

    results.push({
      viewport: job.name,
      status: response?.status() ?? null,
      issues: dom.issues,
      h1: dom.h1,
    });

    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/kontakt`, { waitUntil: "load" });
    const privacy = page.getByRole("link", { name: "Datenschutzerklärung" });
    const issues = [];
    if ((await privacy.count()) < 1) {
      issues.push("Privacy link missing on /kontakt");
    } else {
      await privacy.first().click();
      await page.waitForURL("**/datenschutz");
      if (!page.url().includes("/datenschutz")) {
        issues.push(`Privacy link did not reach /datenschutz: ${page.url()}`);
      }
      const heading = await page.locator("h1").textContent();
      if ((heading ?? "").trim() !== "Datenschutzerklärung") {
        issues.push(`Datenschutz H1 unexpected: "${heading}"`);
      }
    }
    results.push({ viewport: "kontakt-privacy-link", issues });
    await context.close();
  }

  await browser.close();

  const reportPath = path.join(outDir, "legal-seo-dom-check-results.json");
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
