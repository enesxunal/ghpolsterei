/**
 * Scroll through the page to trigger lazy images, then return to the top
 * and wait until layout has settled before a full-page screenshot.
 */
export async function settleForFullPageScreenshot(page) {
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const height = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    );

    for (let y = 0; y < height; y += 480) {
      window.scrollTo(0, y);
      await wait(140);
    }

    window.scrollTo(0, height);
    await wait(300);

    window.scrollTo(0, 0);
    for (let i = 0; i < 25; i += 1) {
      if (window.scrollY === 0) break;
      window.scrollTo(0, 0);
      await wait(50);
    }

    await wait(400);
  });
}
