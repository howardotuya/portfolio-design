import { images, type ImageName } from "./images.gen";

export type ImageFormat = "avif" | "webp";

// Map a width next/image asks for onto the nearest file scripts/images.mjs
// generated (the next size up, or the largest one when the source is smaller).
export function imageUrl(name: string, width: number, format: ImageFormat) {
  const meta = images[name as ImageName];
  if (!meta) throw new Error(`Unknown image "${name}". Run: pnpm images`);
  const w = meta.widths.find((v) => v >= width) ?? meta.widths[meta.widths.length - 1];
  return `/img/${name}-${w}.${meta.hash}.${format}`;
}

export default function webpLoader({ src, width }: { src: string; width: number }) {
  return imageUrl(src, width, "webp");
}
