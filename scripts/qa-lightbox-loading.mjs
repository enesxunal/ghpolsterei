import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:4189";
const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

try {
  for (const viewport of [
    { width: 1440, height: 900, name: "desktop" },
    { width: 390, height: 844, name: "mobile" },
  ]) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    let releaseSlowImage;
    const slowImageGate = new Promise((resolve) => {
      releaseSlowImage = resolve;
    });
    let delayedRequests = 0;
    let failedRequests = 0;

    await page.route("**/_next/image?**", async (route) => {
      const requestUrl = new URL(route.request().url());
      const src = requestUrl.searchParams.get("url") ?? "";
      const width = Number(requestUrl.searchParams.get("w") ?? 0);
      // Only hold modal-sized responses; allow small gallery thumbnails to load.
      if (src.includes("cabrio-verdeck-werkstatt-02.jpg") && width >= 640) {
        delayedRequests += 1;
        await slowImageGate;
        await route.continue();
      } else if (
        src.includes("cabrio-verdeck-werkstatt-03.jpg") &&
        !src.includes("lightboxRetry=") &&
        width >= 640
      ) {
        failedRequests += 1;
        await route.fulfill({ status: 503, contentType: "text/plain", body: "unavailable" });
      } else {
        await route.continue();
      }
    });

    await page.goto(`${baseUrl}/`, { waitUntil: "load" });
    // Wait for Next.js hydration before clicking a server-rendered button.
    await page.waitForTimeout(1500);
    const gallery = page.locator("#startseite-projektgalerie");
    await gallery.locator("button").first().click();
    const modal = page.getByRole("dialog");
    await modal.waitFor();
    await modal.getByRole("status", { name: "Bild wird geladen …" }).waitFor({ state: "hidden", timeout: 20000 }).catch(async () => {
      // A cached first photo may load before the status is observed.
      await modal.locator("figure img.opacity-100").waitFor();
    });

    await modal.getByRole("button", { name: "Nächstes Bild" }).click();
    const spinner = modal.getByText("Bild wird geladen …");
    await spinner.waitFor({ state: "visible", timeout: 10000 });
    assert.ok(delayedRequests >= 1, "Second image full-size request should be delayed");
    const waitingSrc = await modal.locator("figure img").getAttribute("src");
    assert.ok(decodeURIComponent(waitingSrc).includes("cabrio-verdeck-werkstatt-02.jpg"));
    assert.equal(await modal.locator("figure img").count(), 1, "No previous image should remain in the modal");
    assert.ok(await modal.locator("figure img").evaluate((image) => getComputedStyle(image).opacity === "0"));
    assert.match((await modal.locator("figcaption").innerText()) ?? "", /2 \/ 41/);

    releaseSlowImage();
    await spinner.waitFor({ state: "hidden", timeout: 20000 });
    await modal.locator("figure img.opacity-100").waitFor({ timeout: 20000 });
    assert.ok(await modal.locator("figure img").evaluate((image) => image.complete && image.naturalWidth > 0));

    await modal.getByRole("button", { name: "Nächstes Bild" }).click();
    await modal.getByText("Das Bild konnte nicht geladen werden.").waitFor({ timeout: 15000 });
    assert.ok(failedRequests >= 1, "Third image request should simulate failure");
    assert.ok(await modal.locator("figure img").evaluate((image) => getComputedStyle(image).opacity === "0"));
    assert.match((await modal.locator("figcaption").innerText()) ?? "", /3 \/ 41/);

    await modal.getByRole("button", { name: "Erneut versuchen" }).click();
    await modal.locator("figure img.opacity-100").waitFor({ timeout: 20000 });
    assert.ok(await modal.locator("figure img").evaluate((image) => image.complete && image.naturalWidth > 0));

    await page.keyboard.press("ArrowLeft");
    assert.match((await modal.locator("figcaption").innerText()) ?? "", /2 \/ 41/);
    await page.keyboard.press("Escape");
    await modal.waitFor({ state: "hidden" });
    assert.equal(await page.evaluate(() => document.body.style.overflow), "");
    assert.deepEqual(errors, []);
    console.log(`PASS ${viewport.name}: slow loading hides old image; failed image shows retry; arrows and close work`);
    await page.close();
  }
} finally {
  await browser.close();
}
