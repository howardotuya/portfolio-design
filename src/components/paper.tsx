import type { CSSProperties, ReactNode } from "react";
import { Picture } from "@/components/picture";
import type { Photo } from "@/content/site";
import { cn } from "@/lib/cn";
import type { ImageName } from "@/lib/images.gen";

// The scrapbook pieces. Sizes are Figma 1440 pixels times --px (see
// globals.css), so one set of numbers draws them at every breakpoint.

/** n Figma pixels. */
export const px = (n: number) => `calc(${n} * var(--px))`;
/** A font size in Figma pixels that never drops below `min` CSS pixels. */
export const fs = (n: number, min = 10) => `max(${min}px, ${px(n)})`;

export type Colour =
  "yellow" | "mint" | "green" | "pink" | "blue" | "orange" | "beige" | "white" | "line" | "dark";

export const bg: Record<Colour, string> = {
  yellow: "bg-yellow",
  mint: "bg-mint",
  green: "bg-green",
  pink: "bg-pink",
  blue: "bg-blue",
  orange: "bg-orange",
  beige: "bg-beige",
  white: "bg-white",
  line: "bg-line",
  dark: "bg-dark",
};

/** Inline --tilt; with `lg`, a different angle from 1024 up. */
const tilt = (deg: number, lg?: number): CSSProperties =>
  lg === undefined
    ? ({ "--tilt": `${deg}deg` } as CSSProperties)
    : ({ "--tilt-sm": `${deg}deg`, "--tilt-lg": `${lg}deg` } as CSSProperties);
const tiltClass = (lg?: number) =>
  lg === undefined ? "" : "[--tilt:var(--tilt-sm)] lg:[--tilt:var(--tilt-lg)]";

/** A strip of tape. Position it with `style` (left/right/top in px()). */
export function Tape({
  colour,
  w,
  h,
  angle,
  style,
  className,
}: {
  colour: Colour;
  w: number;
  h: number;
  angle: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute block", bg[colour], className)}
      style={{ width: px(w), height: px(h), rotate: `${angle}deg`, ...style }}
    />
  );
}

type PillSize = "sticker" | "web" | "stack" | "status";

const pillSize: Record<PillSize, { font: string; padX: number; padY: number; className: string }> =
  {
    // "Designs ✎", "Builds </>", the Decks / Documents / Web filters.
    sticker: { font: fs(13, 11), padX: 16, padY: 8, className: "uppercase tracking-[0.08em]" },
    // "✦ Web 01 · SaaS"
    web: { font: fs(12, 11), padX: 14, padY: 7, className: "tracking-[0.06em]" },
    // "Next.js", "Tailwind" …
    stack: { font: fs(11, 10), padX: 14, padY: 7, className: "tracking-[0.06em]" },
    // "● building in code"
    status: { font: fs(10, 10), padX: 14, padY: 7, className: "tracking-[0.06em]" },
  };

/** A rounded sticker / tag in Space Mono Bold. */
export function Pill({
  colour,
  size = "sticker",
  angle = 0,
  shadow,
  outline,
  className,
  style,
  children,
}: {
  colour: Colour;
  size?: PillSize;
  angle?: number;
  shadow?: boolean;
  outline?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const s = pillSize[size];
  return (
    <span
      className={cn(
        "inline-flex tilt items-center gap-[0.4em] rounded-full font-mono leading-none font-bold whitespace-nowrap text-ink",
        bg[colour],
        shadow && "shadow-paper",
        outline && "border-[1.5px] border-ink",
        s.className,
        className,
      )}
      style={{
        fontSize: s.font,
        paddingInline: px(s.padX),
        paddingBlock: `calc(${px(s.padY)} + 0.15em)`,
        ...tilt(angle),
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** A handwritten sticky note. */
export function Note({
  colour,
  angle,
  angleLg,
  lifted,
  size = 22,
  className,
  style,
  children,
}: {
  colour: Colour;
  angle: number;
  /** A different tilt from 1024 up (the frames disagree). */
  angleLg?: number;
  /** The Web section's notes cast the bigger shadow. */
  lifted?: boolean;
  size?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "inline-flex w-max tilt items-center gap-[0.3em] font-hand leading-[1.2] whitespace-nowrap text-ink",
        bg[colour],
        lifted ? "shadow-lift" : "shadow-paper",
        tiltClass(angleLg),
        className,
      )}
      style={{
        fontSize: fs(size, 16),
        paddingInline: px(16),
        paddingBlock: px(10),
        ...tilt(angle, angleLg),
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** The dashed grey "PHOTO" slot from the Figma "Image slot" component. */
export function PhotoSlot({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <span
      className={cn(
        "flex items-center justify-center border-2 border-dashed border-soft bg-line font-mono font-bold tracking-[0.08em] text-soft uppercase",
        className,
      )}
      style={{ fontSize: fs(14, 10), ...style }}
    >
      Photo
    </span>
  );
}

const polaroidSize = {
  // "me, 2026" and "my desk": 174 × 220, a 150 square photo.
  sm: { w: 174, h: 220, slotW: 150, slotH: 150, pad: 12, beigeTop: -28 },
  // "2026" and "workspace": 214 × 280, a 190 × 210 photo.
  lg: { w: 214, h: 280, slotW: 190, slotH: 210, pad: 12, beigeTop: -40 },
};

/**
 * A taped polaroid: a photo (or, without one, the Figma "PHOTO" placeholder)
 * and a handwritten caption. Hover lifts it and turns it most of the way to straight.
 */
export function Polaroid({
  photo,
  size,
  angle,
  className,
  style,
}: {
  photo: Photo;
  size: keyof typeof polaroidSize;
  angle: number;
  className?: string;
  style?: CSSProperties;
}) {
  const s = polaroidSize[size];
  const slot = { left: px(s.pad), top: px(s.pad), width: px(s.slotW), height: px(s.slotH) };
  return (
    <figure
      className={cn("relative lift tilt bg-white shadow-paper", className)}
      style={{ width: px(s.w), height: px(s.h), ...tilt(angle), ...style }}
    >
      {photo.image ? (
        <span className="absolute overflow-hidden bg-line" style={slot}>
          <Picture
            name={photo.image}
            alt={photo.alt ?? ""}
            width={s.slotW}
            height={s.slotH}
            sizes={`${s.slotW}px`}
            loading="lazy"
            className="block size-full object-cover"
          />
        </span>
      ) : (
        <PhotoSlot className="absolute" style={slot} />
      )}
      <figcaption
        className="absolute inset-x-0 text-center font-hand leading-none text-soft"
        style={{ top: px(s.pad * 2 + s.slotH + 4), fontSize: fs(18, 14) }}
      >
        {photo.caption}
      </figcaption>
      {/* Tape: blue across the top-left corner, beige off the top-right. */}
      <Tape colour="blue" w={80} h={26} angle={25 - angle} style={{ left: px(-3), top: px(5) }} />
      <Tape
        colour="beige"
        w={80}
        h={26}
        angle={-22 - angle}
        style={{ right: px(-1), top: px(s.beigeTop) }}
      />
    </figure>
  );
}

type ChipShape = "slant" | "zigzag";

// Tape-chip outlines from the Figma vectors: a zigzag top edge, then either a
// slanted right edge and flat bottom ("slant") or a zigzag bottom ("zigzag").
function chipPath(w: number, shape: ChipShape) {
  const teeth: string[] = [];
  for (let x = 12; x < w - 4; x += 12) teeth.push(`L${x} ${(x / 12) % 2 ? 3 : 0}`);
  const top = `M0 0${teeth.join("")}`;
  if (shape === "slant") return `${top}L${w} 53H4Z`;
  const bottom: string[] = [];
  for (let x = w - 12; x > 4; x -= 12) bottom.push(`L${x} ${(x / 12) % 2 ? 56 : 53}`);
  return `${top}L${w} 3V53${bottom.join("")}L0 56Z`;
}

/**
 * A skill chip on a strip of torn tape. Sized in em so the outline scales with
 * the label (the list sets the font size); the 390 frame swaps some outlines,
 * hence two shapes.
 */
export function TapeChip({
  label,
  colour,
  width,
  shape,
  mobileShape = shape,
  light,
}: {
  label: string;
  colour: Colour;
  /** Figma width at the 24px label size. */
  width: number;
  shape: ChipShape;
  mobileShape?: ChipShape;
  /** White label (on green, pink and blue). */
  light?: boolean;
}) {
  const fill = { yellow: "fill-yellow", green: "fill-green", pink: "fill-pink", blue: "fill-blue" }[
    colour as "yellow"
  ];
  return (
    <li
      className={cn(
        "relative grid press place-items-center font-semibold whitespace-nowrap",
        light ? "text-white" : "text-ink",
      )}
      style={{ width: `${width / 24}em`, height: `${56 / 24}em` }}
    >
      <svg
        aria-hidden
        viewBox={`0 0 ${width} 56`}
        preserveAspectRatio="none"
        className={cn("absolute inset-0 size-full", fill)}
      >
        <path className="lg:hidden" d={chipPath(width, mobileShape)} />
        <path className="hidden lg:block" d={chipPath(width, shape)} />
      </svg>
      <span className="relative -translate-y-[0.06em]">{label}</span>
    </li>
  );
}

/** A browser window with the site's hero in it. */
export function BrowserWindow({
  host,
  image,
  className,
}: {
  host: string;
  image: ImageName;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[6px] border-2 border-ink bg-white shadow-lift lg:rounded-[13px]",
        className,
      )}
    >
      <div className="relative flex h-[18px] items-center border-b-2 border-ink lg:h-[calc(39*var(--px))]">
        <span aria-hidden className="absolute flex gap-[6px] pl-[6px] lg:gap-[6px] lg:pl-[13px]">
          {(["pink", "yellow", "green"] as const).map((c) => (
            <span key={c} className={cn("size-[5px] rounded-full lg:size-[11px]", bg[c])} />
          ))}
        </span>
        <span className="mx-auto flex h-[13px] w-1/2 items-center justify-center gap-1 rounded-full bg-paper font-mono text-[9px] leading-none font-bold whitespace-nowrap text-soft lg:h-[calc(25*var(--px))] lg:text-[max(10px,calc(12*var(--px)))]">
          <span aria-hidden className="text-[0.85em]">
            🔒
          </span>
          {host}
        </span>
      </div>
      <Picture
        name={image}
        alt=""
        width={700}
        height={394}
        sizes="(width >= 64rem) 50vw, 90vw"
        loading="lazy"
        className="aspect-[700/394] w-full object-cover object-top"
      />
    </div>
  );
}

/** The slanted folder tab above a folder card. */
export function FolderTab({
  colour,
  className,
  style,
  children,
}: {
  colour: Colour;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const fill = {
    dark: "fill-dark",
    yellow: "fill-yellow",
    blue: "fill-blue",
    pink: "fill-pink",
    mint: "fill-mint",
  }[colour as "dark"];
  return (
    <div className={cn("relative flex items-center", className)} style={style}>
      <svg
        aria-hidden
        viewBox="0 0 220 46"
        preserveAspectRatio="none"
        className={cn("absolute inset-0 size-full", fill)}
      >
        <path d="M0 46V0h180l40 46H0Z" />
      </svg>
      <span className="relative">{children}</span>
    </div>
  );
}
