import type { ImageName } from "@/lib/images.gen";

export type WebProject = {
  slug: "kobo" | "buka" | "ekofest";
  name: string;
  /** "✦ Web 01 · SaaS" → number + category. */
  number: string;
  category: string;
  /** Tag pill colour (a Portfolio / Colour token). */
  colour: "yellow" | "mint" | "pink";
  line: string;
  stack: string[];
  /** The handwritten sticky note. */
  note: string;
  url: `https://${string}`;
  /** 1440×810 crop of the site's hero (the Figma frame until the site is deployed). */
  thumbnail: ImageName;
  /** "● building in code" shows only while building. */
  status: "building" | "live";
};

// Howard's order (2026-10-23): Èkó Fest, Bùkà, Kòbò. "Web 0n" follows it.
export const webProjects: WebProject[] = [
  {
    slug: "ekofest",
    name: "Èkó Fest",
    number: "Web 01",
    category: "Festival",
    colour: "pink",
    line: "Three nights of music. A live countdown, ticket tiers and a road-map schedule.",
    stack: ["Next.js", "SVG", "CSS scroll"],
    note: "the road draws itself as you scroll",
    url: "https://ekofest.howardotuya.com",
    thumbnail: "web/ekofest",
    status: "building",
  },
  {
    slug: "buka",
    name: "Bùkà",
    number: "Web 02",
    category: "Restaurant",
    colour: "mint",
    line: "A modern Lagos buka. Menu, booking, and a mobile nav built around the thumb.",
    stack: ["Next.js", "Tailwind"],
    note: "the menu follows you as you scroll",
    url: "https://buka.howardotuya.com",
    thumbnail: "web/buka",
    status: "building",
  },
  {
    slug: "kobo",
    name: "Kòbò",
    number: "Web 03",
    category: "SaaS",
    colour: "yellow",
    line: "Invoicing for Nigerian freelancers. A landing page and a demo dashboard.",
    stack: ["Next.js", "Tailwind", "Motion"],
    note: "watch the invoice get paid",
    url: "https://kobo.howardotuya.com",
    thumbnail: "web/kobo",
    status: "building",
  },
];

export const host = (p: WebProject) => p.url.replace("https://", "");
