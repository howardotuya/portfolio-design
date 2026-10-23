// Cut Inter, Gochi Hand and Space Mono down to the characters the site uses
// (Google Fonts' text= API), so the first view downloads ~30 KB less. Google's
// full subsets stay behind them in the font stacks: a character added later
// that isn't in a cut falls through to those and loads on demand.
// Usage, after a content change: pnpm build && pnpm fonts && pnpm build
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { root } from "./serve.mjs";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const cuts = [
  { file: "inter-core.woff2", family: "Inter:wght@400..600" },
  { file: "gochi-core.woff2", family: "Gochi+Hand" },
  { file: "mono-core.woff2", family: "Space+Mono:wght@700" },
];

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return name === "_next" ? [] : pages(full);
    return name.endsWith(".html") ? [full] : [];
  });
}

// Every character of visible text in the static export, plus the basic Latin set.
const chars = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;!?'\"-()&/",
);
for (const file of pages(path.join(root, "out"))) {
  const text = readFileSync(file, "utf8")
    .replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(
      /&(amp|lt|gt|quot|nbsp);/g,
      (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " " })[e],
    );
  for (const c of text) if (c.codePointAt(0) < 0x2190 || c.codePointAt(0) > 0x2199) chars.add(c);
}
const text = [...chars]
  .filter((c) => !/\s/.test(c) || c === " ")
  .sort()
  .join("");
console.log(`${chars.size} characters: ${text}`);

for (const { file, family } of cuts) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`,
    { headers: { "User-Agent": UA } },
  ).then((r) => r.text());
  const url = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!url) throw new Error(`No font URL for ${family}:\n${css}`);
  const buf = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
  writeFileSync(path.join(root, "src", "fonts", file), buf);
  console.log(`${file.padEnd(18)} ${(buf.length / 1024).toFixed(1)} KB`);
}
