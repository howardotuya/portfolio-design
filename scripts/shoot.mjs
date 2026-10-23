// Full-page screenshots of the production build at the review breakpoints.
// Reduced motion is emulated by default so scroll reveals don't hide content;
// pass --motion to capture the animated version.
// Usage: node scripts/shoot.mjs [route=/] [--widths=390,1440] [--motion]
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { root, serve } from "./serve.mjs";

const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")),
);
const [route = "/"] = args.filter((a) => !a.startsWith("--"));

const widths = (flags.widths ?? "360,390,768,1024,1280,1440,1920").split(",").map(Number);
const port = 4200;
const outDir = path.join(root, "reports", "shots");
mkdirSync(outDir, { recursive: true });

const server = await serve(port);
const browser = await chromium.launch();
const slug = route === "/" ? "index" : route.replace(/^\/|\/$/g, "").replace(/\//g, "-");

try {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: "motion" in flags ? "no-preference" : "reduce",
    });
    await page.goto(`http://localhost:${port}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Walk the page so lazy images and in-view reveals load before the capture.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);
    const file = path.join(outDir, `${slug}-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
