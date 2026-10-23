import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Gochi_Hand, Jersey_10, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { RevealScript } from "@/components/reveal-script";
import { site } from "@/content/site";
import "./globals.css";

// The hero name: preloaded. The text faces come first as cuts of just the
// characters the site uses (scripts/font-subsets.mjs); Google's full subsets
// sit behind them and only load if a page uses a character the cuts lack.
const jersey = Jersey_10({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jersey",
  display: "swap",
});
// Body type: Familjen Grotesk (Howard moved the file off Inter on 2026-10-23).
const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
  display: "swap",
  preload: false,
});
const gochi = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gochi",
  display: "swap",
  preload: false,
});
// Every Space Mono label in the file is Bold.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-space-mono",
  display: "swap",
  preload: false,
});

// No fallback faces of their own: a character missing from a cut must fall
// through to Google's subsets, not to a local Arial. All three are preloaded:
// they're small, every page's first view uses them, and the fallback mono is
// wide enough to wrap the project tags onto a second row (a 0.13 layout shift).
const familjenCore = localFont({
  src: "../fonts/familjen-core.woff2",
  weight: "400 600",
  variable: "--font-familjen-core",
  display: "swap",
  adjustFontFallback: false,
});
const gochiCore = localFont({
  src: "../fonts/gochi-core.woff2",
  weight: "400",
  variable: "--font-gochi-core",
  display: "swap",
  adjustFontFallback: false,
});
const monoCore = localFont({
  src: "../fonts/mono-core.woff2",
  weight: "700",
  variable: "--font-mono-core",
  display: "swap",
  adjustFontFallback: false,
});

// Ẹ ẹ Ọ ọ Ṣ ṣ ₦, the combining grave / acute / dot below, and ẹ̀ ẹ́ ọ̀ ọ́ drawn
// from Jersey 10 and Gochi Hand's own glyphs, and Ṣ ṣ for Familjen Grotesk
// (scripts/glyph-patches.py). (next/font needs literal options, hence the repetition.)
const pixelPatch = localFont({
  src: "../fonts/pixel-patch.woff2",
  variable: "--font-pixel-patch",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+1EB8-1EB9, U+1ECC-1ECD, U+1E62-1E63, U+20A6, U+0300-0301, U+0323",
    },
  ],
});
const handPatch = localFont({
  src: "../fonts/hand-patch.woff2",
  variable: "--font-hand-patch",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+1EB8-1EB9, U+1ECC-1ECD, U+1E62-1E63, U+20A6, U+0300-0301, U+0323",
    },
  ],
});
const sansPatch = localFont({
  src: [
    { path: "../fonts/sans-patch-400.woff2", weight: "400" },
    { path: "../fonts/sans-patch-600.woff2", weight: "600" },
  ],
  variable: "--font-sans-patch",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+1E62-1E63" }],
});
// Arrows cut from Space Mono Bold and Familjen Grotesk: Google's latin subsets
// only carry ↑ ↓.
const monoArrows = localFont({
  src: "../fonts/mono-arrows.woff2",
  weight: "700",
  variable: "--font-mono-arrows",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+2190-2199" }],
});
const sansArrows = localFont({
  src: "../fonts/sans-arrows.woff2",
  weight: "400 700",
  variable: "--font-sans-arrows",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+2190-2199" }],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.headline}`, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: site.name, locale: "en_NG", url: "/" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f4f3ef",
};

const fonts = [
  jersey,
  familjen,
  gochi,
  spaceMono,
  familjenCore,
  gochiCore,
  monoCore,
  pixelPatch,
  handPatch,
  sansPatch,
  monoArrows,
  sansArrows,
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={fonts.map((f) => f.variable).join(" ")}>
      <head>
        <RevealScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
