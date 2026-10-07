import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.goto("file:///workspace/.grok/og-card.html", { waitUntil: "load" });
await page.waitForTimeout(200);
await page.screenshot({
  path: "/workspace/.grok/card-raw.png",
  type: "png",
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

const fav = await browser.newPage({
  viewport: { width: 16, height: 16 },
  deviceScaleFactor: 4,
});
await fav.setContent(`
  <html><body style="margin:0;background:#F4EFE8">
    <img src="file:///workspace/.grok/favicon.svg.tmp" width="16" height="16" />
  </body></html>
`);
await fav.waitForTimeout(100);
await fav.screenshot({
  path: "/workspace/.grok/favicon-16.png",
  type: "png",
  clip: { x: 0, y: 0, width: 16, height: 16 },
});

const fav32 = await browser.newPage({
  viewport: { width: 32, height: 32 },
  deviceScaleFactor: 4,
});
await fav32.setContent(`
  <html><body style="margin:0;background:#F4EFE8">
    <img src="file:///workspace/.grok/favicon.svg.tmp" width="32" height="32" />
  </body></html>
`);
await fav32.waitForTimeout(100);
await fav32.screenshot({
  path: "/workspace/.grok/favicon-32.png",
  type: "png",
  clip: { x: 0, y: 0, width: 32, height: 32 },
});

writeFileSync("/workspace/.grok/og-render-ok", "ok");
await browser.close();
