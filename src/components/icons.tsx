import type { SVGProps } from "react";

// Symbols the four site fonts don't have (✦ ★ ♥ ✎ ☰ ✕). In Figma they fall
// back to system glyphs, which differ per OS, so they're drawn here instead.
// All are decorative: the text next to them carries the meaning.

type IconProps = SVGProps<SVGSVGElement>;

const base = { "aria-hidden": true, focusable: false } as const;

/** The pink smiley logo. */
export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" {...base} {...props}>
      <circle cx="16" cy="16" r="15" className="fill-pink" />
      <circle cx="11" cy="13" r="2" className="fill-ink" />
      <circle cx="21" cy="13" r="2" className="fill-ink" />
      <path
        d="M10 19c4 4 8 4 12 0"
        fill="none"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="stroke-ink"
      />
    </svg>
  );
}

/** ✦ four-point sparkle. */
export function Sparkle(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="0.9em" height="0.9em" fill="currentColor" {...base} {...props}>
      <path d="M8 0c.6 4.2 2.7 6.9 8 8-5.3 1.1-7.4 3.8-8 8-.6-4.2-2.7-6.9-8-8 5.3-1.1 7.4-3.8 8-8Z" />
    </svg>
  );
}

/** ★ solid star. */
export function Star(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" {...base} {...props}>
      <path d="m8 .8 2.2 4.6 5 .7-3.6 3.5.9 5L8 12.2l-4.5 2.4.9-5L.8 6.1l5-.7L8 .8Z" />
    </svg>
  );
}

/** ♥ heart, in its own red like the emoji in the Figma render. */
export function Heart(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" {...base} {...props}>
      <path
        fill="var(--color-heart, currentColor)"
        d="M8 14.6S1 10.4 1 5.6A3.6 3.6 0 0 1 8 4.3a3.6 3.6 0 0 1 7 1.3c0 4.8-7 9-7 9Z"
      />
    </svg>
  );
}

/** ✎ pencil. */
export function Pencil(props: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      {...base}
      {...props}
    >
      <path d="M2.5 13.5 3.3 10 11 2.3a1.4 1.4 0 0 1 2 0l.7.7a1.4 1.4 0 0 1 0 2L6 12.7l-3.5.8ZM9.6 3.7l2.7 2.7" />
    </svg>
  );
}

/** ☰ menu. */
export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 14 14" width="1em" height="1em" fill="currentColor" {...base} {...props}>
      <path d="M1 2.5h12v1.8H1zM1 6.1h12v1.8H1zM1 9.7h12v1.8H1z" />
    </svg>
  );
}

/** ✕ close. */
export function CloseIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      width="1em"
      height="1em"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      {...base}
      {...props}
    >
      <path d="m2.5 2.5 9 9m0-9-9 9" />
    </svg>
  );
}

/** The hand-drawn arrows from the Web section (Figma "Arrow"). */
export function Scribble({ flip, ...props }: IconProps & { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 70 52"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...base}
      {...props}
    >
      {flip ? (
        <>
          <path pathLength={1} className="draw" d="M2 2c26 8.4 47 24 62 46" />
          <path pathLength={1} className="draw draw-late" d="m52 46 12 2V36" />
        </>
      ) : (
        <>
          <path pathLength={1} className="draw" d="M68 2C42 10.4 21 26 6 48" />
          <path pathLength={1} className="draw draw-late" d="M6 36v12l12-2" />
        </>
      )}
    </svg>
  );
}
