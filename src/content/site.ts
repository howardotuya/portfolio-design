import type { ImageName } from "@/lib/images.gen";

export const site = {
  name: "Howard Otuya",
  url: "https://design.howardotuya.com",
  host: "design.howardotuya.com",
  headline: "I design it, then I build it.",
  description: "Decks, documents and web apps. Designed with taste, shipped in React and Next.js.",
  email: "howardotuya@yahoo.com",
  status: "Open to design + build work",
  developerSite: { label: "howardotuya.com", url: "https://howardotuya.com" },
  year: "2026",
} as const;

export type NavId = "home" | "decks" | "documents" | "web" | "about";

/** Home section anchors; project pages link back to them as /#id. */
export const nav: { id: NavId; label: string; hash: string }[] = [
  { id: "home", label: "Home", hash: "" },
  { id: "decks", label: "Decks", hash: "#decks" },
  { id: "documents", label: "Documents", hash: "#documents" },
  { id: "web", label: "Web", hash: "#web" },
  { id: "about", label: "About", hash: "#about" },
];

/**
 * The three dots in the nav. Decorative until Howard sends the accounts:
 * give one a `url` and `label` and it renders as a link.
 */
export const socials: { colour: "yellow" | "pink" | "green"; label?: string; url?: string }[] = [
  { colour: "yellow" },
  { colour: "pink" },
  { colour: "green" },
];

export type Photo = { caption: string; image?: ImageName; alt?: string };

/** Howard's polaroids (images/me/); without an image a polaroid shows the "PHOTO" slot. */
export const photos = {
  me: {
    caption: "me, 2026",
    image: "me/me-2026",
    alt: "Howard in round glasses and a black T-shirt, a selfie on the rooftop",
  },
  desk: {
    caption: "my desk",
    image: "me/my-desk",
    alt: "Howard at the desk outdoors, under a patterned metal canopy",
  },
  year: {
    caption: "2025",
    image: "me/2025",
    alt: "Howard in a black T-shirt, giving a thumbs up",
  },
  workspace: {
    caption: "workspace",
    image: "me/workspace",
    alt: "The rooftop workspace: green turf, a table and office chairs under a steel canopy",
  },
} satisfies Record<string, Photo>;

export const about = {
  paragraph:
    "I’m a frontend engineer who designs. I’ve shipped a SaaS platform used by Nestlé and Coca-Cola, built a design system from scratch, and art-directed decks and documents. I care about type, grids, and the small details everyone else skips.",
  skills: [
    { label: "Presentation", colour: "yellow" },
    { label: "Editorial", colour: "green" },
    { label: "Web design", colour: "pink" },
    { label: "React + Next.js", colour: "blue" },
  ],
} as const;

export const howIWork = {
  title: "Art directed by me, built with AI.",
  body: "For decks and documents, I pick the reference, set the design system, write the brief and push every revision until it’s right. AI does the building. For web, I design it and write the code myself.",
  note: "every project starts with a reference",
} as const;

export const talk = {
  title: "Let’s talk",
  body: "Got a deck, a report, a web app or a messy problem? Send it over. I read every message.",
} as const;
