// Open Graph cards for the project pages: each deck's cover slide cropped to
// 1200×630 (the home page's card is src/app/opengraph-image.jpg).
// Usage: node scripts/og.mjs
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { root } from "./serve.mjs";

const work = path.join(root, "images", "work");
const out = path.join(root, "public", "og");
mkdirSync(out, { recursive: true });

for (const slug of readdirSync(work).sort()) {
  const file = path.join(out, `${slug}.jpg`);
  await sharp(path.join(work, slug, "01.png"))
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(file);
  console.log(path.relative(root, file));
}
