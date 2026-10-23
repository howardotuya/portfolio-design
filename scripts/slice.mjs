// Slice a tall screenshot into fixed-height PNG strips for side-by-side review.
// Usage: node scripts/slice.mjs <image.png> [stripHeight=900]
import path from "node:path";
import sharp from "sharp";

const [input, heightArg] = process.argv.slice(2);
if (!input) {
  console.error("Usage: node scripts/slice.mjs <image.png> [stripHeight]");
  process.exit(1);
}

const strip = Number(heightArg ?? 900);
const { width, height } = await sharp(input).metadata();
const { dir, name } = path.parse(input);

for (let top = 0, i = 0; top < height; top += strip, i++) {
  const h = Math.min(strip, height - top);
  const out = path.join(dir, `${name}-${String(i).padStart(2, "0")}.png`);
  await sharp(input).extract({ left: 0, top, width, height: h }).toFile(out);
  console.log(out);
}
