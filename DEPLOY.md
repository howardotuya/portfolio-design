# Deploying the design portfolio

A static site: `output: "export"` makes `next build` write plain HTML/CSS/JS to `out/`. There's no
server runtime, no API routes and no environment variables.

Production URL: `https://design.howardotuya.com`

## One-time Vercel setup

1. In Vercel, **Add New → Project** and import this repository.
2. Framework preset: **Next.js**. Leave the root directory, build, install and output settings on
   their defaults. Vercel sees `pnpm-lock.yaml` and installs with pnpm.
3. **Settings → General → Node.js Version**: `22.x`.
4. **Settings → Domains**: add `design.howardotuya.com`, then create the DNS record Vercel shows (a
   `CNAME` for `design`) at the `howardotuya.com` DNS provider.

## Checks before deploying

```bash
pnpm install
pnpm lint && pnpm typecheck && pnpm build
pnpm measure                 # first-load JS per route, gzip (budget 140 KB)
pnpm lighthouse / /work/yolura --runs=5   # mobile Lighthouse, median of 5
pnpm shoot / --widths=390,1440            # full-page screenshots in reports/shots
```

Local Lighthouse swings with machine load; check `uptime` and judge by the median.

## Changing content

- **Copy** lives in `src/content/` (`projects.ts`, `web.ts`, `site.ts`). Project pages are generated
  from `projects.ts`; the order of that list is also the "Next project" loop.
- **When a web project goes live**, set its `status` to `"live"` in `web.ts`: the "building in
  code" sticker disappears. Swap its thumbnail for a crop of the live site if you like.
- **Social links**: give a dot in `site.ts` a `url` and `label` and it becomes a link.

## Images

Sources are in `images/` (slides at 2x from the deck files, web-site hero crops, and `images/me/`
for the polaroid photos once they exist). They're pre-rendered:

```bash
pnpm images   # AVIF + WebP width ladder into public/, manifest in src/lib/images.gen.ts
pnpm og       # 1200×630 Open Graph cards for the project pages (public/og/)
```

Commit the results. The home page's Open Graph card is `src/app/opengraph-image.jpg`, captured
from the built hero at 1440 wide.

## Fonts

- `pnpm fonts` re-cuts Familjen Grotesk, Gochi Hand and Space Mono to the characters the built site
  uses, and cuts the arrow subsets.
  Run it after a content change (`pnpm build && pnpm fonts && pnpm build`). Skipping it is safe:
  a missing character falls through to Google's full subsets.
- `src/fonts/pixel-patch.woff2` and `hand-patch.woff2` add Ẹ Ọ Ṣ ₦ and the tone-marked vowels to
  Jersey 10 and Gochi Hand, and `sans-patch-*.woff2` adds Ṣ ṣ to Familjen Grotesk, all drawn from
  each font's own glyphs. Rebuild with
  `python3 scripts/glyph-patches.py <Jersey10-Regular.ttf> <GochiHand-Regular.ttf> <FamiljenGrotesk[wght].ttf>`
  (needs `pip install fonttools brotli`; sources from github.com/google/fonts).
- Project type samples are SVG outlines in `src/type-samples/`, exported from Figma, so those
  fonts are never loaded.
