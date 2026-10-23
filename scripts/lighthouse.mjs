// Lighthouse (default mobile profile: Moto G Power, simulated slow 4G) against
// the production build, served the way Vercel would serve it. Local runs are
// noisy, so each route runs several times and the median run is reported.
// Usage: node scripts/lighthouse.mjs [route ...] [--runs=3]   (default route: /)
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import { root, serve } from "./serve.mjs";

const args = process.argv.slice(2);
const runs = Number(args.find((a) => a.startsWith("--runs="))?.split("=")[1] ?? 3);
const routes = args.filter((a) => !a.startsWith("--"));
if (!routes.length) routes.push("/");

const port = 4100;
const reportDir = path.join(root, "reports", "lighthouse");
mkdirSync(reportDir, { recursive: true });

const server = await serve(port);
const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new"] });

const pct = (score) => Math.round((score ?? 0) * 100);
const ms = (audit) => `${Math.round(audit.numericValue)} ms`;

try {
  for (const route of routes) {
    const results = [];
    for (let i = 0; i < runs; i++) {
      results.push(
        await lighthouse(`http://localhost:${port}${route}`, {
          port: chrome.port,
          output: ["html", "json"],
          logLevel: "error",
        }),
      );
    }
    // Median by performance score, then LCP.
    results.sort(
      (a, b) =>
        a.lhr.categories.performance.score - b.lhr.categories.performance.score ||
        b.lhr.audits["largest-contentful-paint"].numericValue -
          a.lhr.audits["largest-contentful-paint"].numericValue,
    );
    const { lhr, report } = results[Math.floor(results.length / 2)];

    const slug = route === "/" ? "index" : route.replace(/^\/|\/$/g, "").replace(/\//g, "-");
    writeFileSync(path.join(reportDir, `${slug}.html`), report[0]);
    writeFileSync(path.join(reportDir, `${slug}.json`), report[1]);

    const c = lhr.categories;
    const a = lhr.audits;
    const spread = results.map((r) => pct(r.lhr.categories.performance.score)).join("/");
    console.log(`\n${route}  (median of ${runs}; performance per run ${spread})`);
    console.log(
      `  Performance ${pct(c.performance.score)}  Accessibility ${pct(c.accessibility.score)}  ` +
        `Best Practices ${pct(c["best-practices"].score)}  SEO ${pct(c.seo.score)}`,
    );
    console.log(
      `  LCP ${ms(a["largest-contentful-paint"])}  FCP ${ms(a["first-contentful-paint"])}  ` +
        `TBT ${ms(a["total-blocking-time"])}  CLS ${a["cumulative-layout-shift"].numericValue.toFixed(3)}  ` +
        `SI ${ms(a["speed-index"])}`,
    );
    const failing = Object.values(c)
      .flatMap((cat) => cat.auditRefs)
      .map((ref) => a[ref.id])
      .filter(
        (audit) =>
          audit.score !== null && audit.score < 0.9 && audit.scoreDisplayMode !== "informative",
      )
      .map((audit) => `${audit.id} (${pct(audit.score)})`);
    if (failing.length) console.log(`  Below 90: ${[...new Set(failing)].join(", ")}`);
  }
} finally {
  chrome.kill();
  server.close();
}
