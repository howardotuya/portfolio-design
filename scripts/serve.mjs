// Minimal static server for `out/`, close to how Vercel serves a static export:
// clean URLs (/app -> app.html), gzip/brotli, immutable caching for hashed
// assets. Used by shoot.mjs and lighthouse.mjs.
// Usage: node scripts/serve.mjs [port=4000]
import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};
const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".txt", ".xml", ".svg"]);

function resolveFile(dir, urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/index";
  for (const candidate of [clean, `${clean}.html`, path.join(clean, "index.html")]) {
    const file = path.join(dir, candidate);
    if (file.startsWith(dir) && existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

export function serve(port = 4000) {
  const dir = path.join(root, "out");
  if (!existsSync(dir)) throw new Error("No build in out/. Run `pnpm build` first.");

  const server = http.createServer((req, res) => {
    const file = resolveFile(dir, req.url ?? "/");
    const status = file ? 200 : 404;
    const target = file ?? path.join(dir, "404.html");
    const ext = path.extname(target);

    res.setHeader("Content-Type", TYPES[ext] ?? "application/octet-stream");
    res.setHeader(
      "Cache-Control",
      req.url?.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : "no-cache",
    );

    const accept = String(req.headers["accept-encoding"] ?? "");
    let stream = createReadStream(target);
    if (COMPRESSIBLE.has(ext) && accept.includes("br")) {
      res.setHeader("Content-Encoding", "br");
      // Quality 5 is what CDNs use on the fly; the default (11) takes hundreds of ms
      // per page and would show up as slow server response in Lighthouse.
      stream = stream.pipe(
        zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }),
      );
    } else if (COMPRESSIBLE.has(ext) && accept.includes("gzip")) {
      res.setHeader("Content-Encoding", "gzip");
      stream = stream.pipe(zlib.createGzip());
    }
    res.writeHead(status);
    stream.pipe(res);
  });

  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] ?? 4000);
  await serve(port);
  console.log(`Serving out/ at http://localhost:${port}`);
}
