import type { CSSProperties } from "react";
import { site, talk } from "@/content/site";
import { CopyEmail } from "../copy-email";
import { fs, px } from "../paper";

/**
 * The big smiley (Figma "Smiley"). It blinks now and then, and smiles wider
 * while the email button is hovered (see .talk in globals.css).
 */
function Smiley({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 140 140" className={className} style={style}>
      <circle cx="70" cy="70" r="66" strokeWidth="3" className="fill-yellow stroke-ink" />
      <g className="smiley-eyes fill-ink">
        <ellipse cx="50" cy="58" rx="7" ry="11" />
        <ellipse cx="90" cy="58" rx="7" ry="11" />
      </g>
      <circle cx="34" cy="84" r="10" className="fill-pink opacity-50" />
      <circle cx="106" cy="84" r="10" className="fill-pink opacity-50" />
      <path
        d="M42 86c18.67 20 37.33 20 56 0"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        className="smiley-mouth stroke-ink"
      />
    </svg>
  );
}

// Figma 4:209–4:219 (1440) / 8:159–8:167 (390).
export function LetsTalk() {
  return (
    <section
      id="contact"
      aria-labelledby="talk-title"
      className="talk container-page flex flex-col items-center pt-[50px] text-center lg:pt-[calc(168*var(--px))]"
    >
      <Smiley className="size-24 lg:size-(--s)" style={{ "--s": px(140) } as CSSProperties} />
      <h2
        id="talk-title"
        className="mt-3.5 font-pixel text-talk leading-[0.9] uppercase lg:mt-(--gap) lg:text-(length:--fs)"
        style={{ "--gap": px(30), "--fs": px(150) } as CSSProperties}
      >
        {talk.title}
      </h2>
      <p
        className="mt-3.5 max-w-[22rem] font-hand text-invite text-soft md:max-w-[30rem] lg:mt-(--gap) lg:max-w-(--w) lg:text-(length:--fs)"
        style={{ "--gap": px(15), "--w": px(640), "--fs": fs(26, 20) } as CSSProperties}
      >
        {talk.body}
      </p>
      <div className="mt-6 lg:mt-(--gap)" style={{ "--gap": px(42) } as CSSProperties}>
        <CopyEmail
          email={site.email}
          className="talk-email inline-flex press items-center gap-[0.6em] bg-ink px-4 py-3 font-mono text-email font-bold text-white uppercase hover:bg-dark lg:px-(--px-x) lg:py-(--px-y) lg:text-(length:--fs)"
          style={{ "--px-x": px(22), "--px-y": px(14), "--fs": fs(15, 12) } as CSSProperties}
        >
          {site.email}
          <span aria-hidden>↗</span>
        </CopyEmail>
      </div>
    </section>
  );
}
