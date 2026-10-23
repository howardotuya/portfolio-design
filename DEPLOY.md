# Deploying the design portfolio

A static site: `output: "export"` makes `next build` write plain HTML/CSS/JS to `out/`. There's no
server runtime, no API routes and no environment variables.

Production URL: `https://design.howardotuya.com`

## Netlify

The site is hosted on Netlify, building from `main`:

- **Build command:** `pnpm build`. Netlify sees `pnpm-lock.yaml` and installs with pnpm.
- **Publish directory:** `out`
- **Node:** 22, from `.nvmrc`.
- **Domain:** `design.howardotuya.com` under **Domain management**, with a `CNAME` for `design`
  pointing at the site's `.netlify.app` address at the `howardotuya.com` DNS provider.

`public/_headers` is copied into `out/` and sets the response headers: `/img/` (the rendered
images) is cached for a year as immutable (their file names carry a content hash, see Images). Everything else keeps
Netlify's default, which revalidates on every request. `/_next/static/` is cached as immutable by
Netlify's Next.js support. `pnpm preview` applies the same `_headers` rules locally.

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
- **Web projects** are all `"live"` in `web.ts` (a `"building"` one shows a "building in code"
  sticker). Their thumbnails are the live heroes captured at a 1440×810 viewport at 2x, with
  reduced motion, saved as `images/web/<slug>.png`; run `pnpm images web` after replacing one.
- **Social links**: give a dot in `site.ts` a `url` and `label` and it becomes a link.

## Images

Sources are in `images/` (slides at 2x from the deck files, web-site hero crops, and the polaroid
photos in `images/me/`, cropped and listed in `photos` in `src/content/site.ts`). They're
pre-rendered, with a hash of the source file in each name (`01-1280.1d3265be.avif`), so a
replaced image gets new URLs and the year-long cache never serves a stale one:

```bash
pnpm images      # AVIF + WebP width ladder into public/img/, manifest in src/lib/images.gen.ts
pnpm images me   # just one folder (the full run takes a while)
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
