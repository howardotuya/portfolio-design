import type { Metadata, Viewport } from "next";
import { Gochi_Hand, Inter, Jersey_10, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { RevealScript } from "@/components/reveal-script";
import { site } from "@/content/site";
import "./globals.css";

// The hero name and headline: preloaded. Only `latin` is preloaded; other
// subsets (Inter's Vietnamese range has Ẹ/Ọ) load on demand.
const jersey = Jersey_10({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jersey",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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

// Ẹ ẹ Ọ ọ Ṣ ṣ ₦, the combining grave / acute / dot below, and ẹ̀ ẹ́ ọ̀ ọ́ drawn
// from Jersey 10 and Gochi Hand's own glyphs (scripts/glyph-patches.py).
// (next/font needs literal options, hence the repetition.)
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
// Arrows cut from Space Mono Bold and Inter: Google's latin subsets only carry ↑ ↓.
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

const fonts = [jersey, inter, gochi, spaceMono, pixelPatch, handPatch, monoArrows, sansArrows];

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
