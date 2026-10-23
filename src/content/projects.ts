import type { ImageName } from "@/lib/images.gen";

export type Swatch = { name: string; hex: `#${string}` };

export type Project = {
  slug: "yolura" | "eko-sound" | "lagoon-line" | "field-guide" | "agbe-report";
  kind: "deck" | "document";
  /** "Deck 01": the folder tab, the page label ("Deck 01 · 2026") and next-project label. */
  number: string;
  year: string;
  /** The big pixel title on the project page. */
  title: string;
  /** The title on the home folder card. */
  cardTitle: string;
  /** The title on the previous project's "Next project" card. */
  nextTitle: string;
  cardMeta: string;
  cardLine: string;
  subtitle: string;
  /** Folder-card colour (a Portfolio / Colour token). */
  colour: "dark" | "yellow" | "blue" | "pink" | "mint";
  tags: string[];
  meta: { role: string; format: string; tools: string; year: string };
  brief: { headline: string; body: string };
  direction: [string, string, string, string];
  system: {
    swatches: [Swatch, Swatch, Swatch, Swatch];
    /** The type sample's words; its artwork is src/type-samples/<slug>{,-mobile}.svg. */
    typeSample: string;
    typeLabel: string;
  };
  slidesHeading: string;
  /** Captions in order; images are work/<slug>/01, 02 … and the first is the cover. */
  slides: string[];
};

export const projects: Project[] = [
  {
    slug: "yolura",
    kind: "deck",
    number: "Deck 01",
    year: "2026",
    title: "Yolura",
    cardTitle: "Yolura",
    nextTitle: "Yolura",
    cardMeta: "Pitch deck · 6 slides",
    cardLine: "The operating system for wellness businesses, pitched in its real brand.",
    subtitle: "The operating system for wellness businesses, pitched in its real brand.",
    colour: "dark",
    tags: ["Pitch deck", "Branded", "6 slides"],
    meta: { role: "Art direction", format: "6 slides, 16:9", tools: "Figma + AI", year: "2026" },
    brief: {
      headline: "Make a pitch deck for Yolura, using the real brand as much as possible.",
      body: "Yolura is a booking and payments platform for spas, salons, barbershops and gyms in Nigeria. The deck had to feel calm and premium, like the brand, while staying mostly text with only a few visuals.",
    },
    direction: [
      "Pulled the logo, colours and Plus Jakarta Sans straight from the brand file.",
      "Reused real landing-page lines, like “Software that speaks Naira.”",
      "Limited visuals to three: one brand photo and two real product screens.",
      "One italic accent word per headline, in Muted Sage.",
    ],
    system: {
      swatches: [
        { name: "Deep Forest", hex: "#2F3A2F" },
        { name: "Muted Sage", hex: "#A8C3A0" },
        { name: "Warm Stone", hex: "#EDEBE6" },
        { name: "Soft Gold", hex: "#C9A45C" },
      ],
      typeSample: "The operating system for wellness businesses.",
      typeLabel: "Plus Jakarta Sans · Medium + Italic",
    },
    slidesHeading: "all six slides",
    slides: ["Cover", "The problem", "Chat to book", "Dashboard", "Why Yolura", "The ask"],
  },
  {
    slug: "eko-sound",
    kind: "deck",
    number: "Deck 02",
    year: "2026",
    title: "Èkó Sound",
    cardTitle: "Èkó Sound",
    nextTitle: "Èkó Sound",
    cardMeta: "Year in review · 6 slides",
    cardLine: "A Lagos record label’s year, in chunky offset type.",
    subtitle: "A Lagos record label’s year in review, in chunky offset type.",
    colour: "yellow",
    tags: ["Year in review", "Nkabom", "6 slides"],
    meta: { role: "Art direction", format: "6 slides, 16:9", tools: "Figma + AI", year: "2026" },
    brief: {
      headline:
        "Make a year-in-review deck for a Lagos record label, in an African-textile direction.",
      body: "Èkó Sound is a fictional Lagos label looking back on 2025: streams, artists, songs, big moments and plans for 2026. I wanted it loud and confident, but mostly type.",
    },
    direction: [
      "Took the Nkabom poster as the reference: paper, brown and mustard.",
      "Chunky Dela Gothic with a mustard offset shadow.",
      "A dashed border and triangle markers on every slide. No illustration.",
      "Chose song names the display fonts can render, so no Yoruba letter breaks.",
    ],
    system: {
      swatches: [
        { name: "Paper", hex: "#EEEAE3" },
        { name: "Brown", hex: "#2B1A1A" },
        { name: "Mustard", hex: "#F2B705" },
        { name: "Grey", hex: "#8C8580" },
      ],
      typeSample: "ÈKÓ SOUND",
      typeLabel: "Dela Gothic One · Oswald",
    },
    slidesHeading: "the slides",
    slides: ["Cover", "In numbers", "Our artists", "Top songs", "Big moments", "2026"],
  },
  {
    slug: "lagoon-line",
    kind: "deck",
    number: "Deck 03",
    year: "2026",
    title: "Lagoon Line",
    cardTitle: "Lagoon Line",
    nextTitle: "Lagoon Line",
    cardMeta: "Seed deck · 5 slides",
    cardLine: "A Lagos ferry startup’s seed deck, type-led, from a vintage travel poster.",
    subtitle: "A Lagos ferry startup’s seed deck, type-led, from a vintage travel poster.",
    colour: "blue",
    tags: ["Seed deck", "Type-led", "5 slides"],
    meta: { role: "Art direction", format: "5 slides, 16:9", tools: "Figma + AI", year: "2026" },
    brief: {
      headline: "Make a seed deck for a Lagos lagoon ferry, from a 1940s Swiss travel poster.",
      body: "Lagoon Line is a fictional ferry startup pitching fast crossings over the lagoon instead of hours on the bridge. The poster gave the type and colour; the content stayed simple.",
    },
    direction: [
      "Started illustration-heavy, then pulled it back to type-led with photos on two slides only.",
      "Stacked Barlow Condensed caps with a brush-script accent, from the poster.",
      "A dotted route line is the only illustration.",
      "Fixed squashed route circles and centred the A, B, C markers.",
    ],
    system: {
      swatches: [
        { name: "Shadow green", hex: "#1F3A34" },
        { name: "Meadow", hex: "#7FB23A" },
        { name: "Ferry blue", hex: "#5E7FB8" },
        { name: "Cream", hex: "#F3EFE4" },
      ],
      typeSample: "LAGOON LINE",
      typeLabel: "Barlow Condensed · Kaushan Script",
    },
    slidesHeading: "the slides",
    slides: ["Cover", "The problem", "Routes", "By the numbers", "The ask"],
  },
  {
    slug: "field-guide",
    kind: "document",
    number: "Doc 01",
    year: "2026",
    title: "Field Guide",
    cardTitle: "Street Food Field Guide",
    nextTitle: "Street Food Guide",
    cardMeta: "Editorial · 6 pages",
    cardLine: "Four Lagos street foods, in a guidebook full of stamps and tickets.",
    subtitle: "Four Lagos street foods, in a guidebook full of stamps and tickets.",
    colour: "pink",
    tags: ["Editorial", "Guidebook", "6 pages"],
    meta: {
      role: "Art direction",
      format: "6 pages, landscape",
      tools: "Figma + AI",
      year: "2026",
    },
    brief: {
      headline:
        "Make a short field guide to Lagos street food, treating each dish like a specimen.",
      body: "Suya, puff-puff, boli and akara, each with what it is, where to find it, when to go and how to order. Warm, friendly and easy to carry around.",
    },
    direction: [
      "Took a printed city guidebook as the reference: burnt orange, cream and stamps.",
      "Square red stamps for numbers, cream ticket cards for every list.",
      "Used food photos in cards instead of the reference’s illustrations.",
      "A slab serif for headings, a book serif for reading.",
    ],
    system: {
      swatches: [
        { name: "Orange", hex: "#C4522B" },
        { name: "Cream", hex: "#F3E3C3" },
        { name: "Tan", hex: "#E6CC9A" },
        { name: "Ink", hex: "#3B2A22" },
      ],
      typeSample: "STREET FOOD",
      typeLabel: "Roboto Slab · Bitter",
    },
    slidesHeading: "the slides",
    slides: [
      "Cover",
      "Welcome & contents",
      "The specimens",
      "No. 01 Suya",
      "Where to eat",
      "Street rules",
    ],
  },
  {
    slug: "agbe-report",
    kind: "document",
    number: "Doc 02",
    year: "2026",
    title: "Àgbẹ̀ Report",
    cardTitle: "Àgbẹ̀ Co-op Report",
    nextTitle: "Àgbẹ̀ Co-op Report",
    cardMeta: "Annual report · 6 pages",
    cardLine: "A farmer co-op’s year, as a clean sage-green report.",
    subtitle: "A farmer co-op’s year, as a clean sage-green annual report.",
    colour: "mint",
    tags: ["Annual report", "Landscape", "6 pages"],
    meta: {
      role: "Art direction",
      format: "6 pages, landscape",
      tools: "Figma + AI",
      year: "2026",
    },
    brief: {
      headline: "Make an annual report for a farmer co-operative, from a clean corporate report.",
      body: "Àgbẹ̀ is a fictional co-op moving produce from Ogun and Oyo farms into Lagos markets. The report covers the chair’s letter, key numbers, the year, the money and what’s next.",
    },
    direction: [
      "Heavy wide caps with a short sage underline, from the reference.",
      "Sage blocks, numbered rows on hairlines and sage number circles.",
      "Raised body text from 17 to 24 after review, so it reads without zooming.",
      "Rebuilt the portrait pages as landscape to match the decks.",
    ],
    system: {
      swatches: [
        { name: "Sage", hex: "#A7AF8E" },
        { name: "Sage light", hex: "#DDE0D2" },
        { name: "Ink", hex: "#1B1B1B" },
        { name: "Grey", hex: "#6E6E6E" },
      ],
      typeSample: "ANNUAL REPORT",
      typeLabel: "Archivo Black · Montserrat",
    },
    slidesHeading: "the slides",
    slides: ["Cover", "Contents + chair", "At a glance", "Our year", "The money", "Looking ahead"],
  },
];

export const slideImage = (p: Project, i: number) =>
  `work/${p.slug}/${String(i + 1).padStart(2, "0")}` as ImageName;

export const cover = (p: Project) => slideImage(p, 0);

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

/** The order loops: the last project's next is the first. */
export function nextProject(p: Project) {
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length]!;
  return { project: next, label: i === projects.length - 1 ? "Back to" : next.number };
}

export const decks = projects.filter((p) => p.kind === "deck");
export const documents = projects.filter((p) => p.kind === "document");
