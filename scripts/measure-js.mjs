// First-load JS per page of the static export: every <script src> in the page's
// HTML, gzipped (and brotli for reference). Next 16 no longer prints this.
// Usage: node scripts/measure-js.mjs [budgetKB=140]
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { root } from "./serve.mjs";

const out = path.join(root, "out");
const budget = Number(process.argv[2] ?? 140) * 1024;

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return name === "_next" ? [] : htmlFiles(full);
    return name.endsWith(".html") && !name.startsWith("_") && name !== "404.html" ? [full] : [];
  });
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
let failed = false;

for (const file of htmlFiles(out).sort()) {
  const html = readFileSync(file, "utf8");
  // noModule scripts (legacy polyfills) are never fetched by modern browsers.
  const srcs = [
    ...new Set(
      [...html.matchAll(/<script([^>]+)src="([^"]+)"[^>]*>/g)]
        .filter((m) => !/nomodule/i.test(m[0]))
        .map((m) => m[2]),
    ),
  ];
  let gzip = 0;
  let brotli = 0;
  for (const src of srcs) {
    const buf = readFileSync(path.join(out, src.split("?")[0]));
    gzip += zlib.gzipSync(buf, { level: 9 }).length;
    brotli += zlib.brotliCompressSync(buf).length;
  }
  const inline = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1])
    .join("");
  const inlineGzip = zlib.gzipSync(inline, { level: 9 }).length;

  const route = "/" + path.relative(out, file).replace(/(index)?\.html$/, "");
  const over = gzip > budget;
  failed ||= over;
  console.log(
    `${route.padEnd(12)} ${kb(gzip).padStart(9)} gzip  ${kb(brotli).padStart(9)} br  ` +
      `${String(srcs.length).padStart(2)} files  (+${kb(inlineGzip)} inline)` +
      (over ? "  OVER BUDGET" : ""),
  );
}

process.exit(failed ? 1 : 0);
