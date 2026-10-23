import type { CSSProperties } from "react";
import { about, photos } from "@/content/site";
import { cn } from "@/lib/cn";
import { fs, Polaroid, px, TapeChip } from "../paper";

// Figma 4:72–4:101 (1440) / 8:43–8:66 (390). Desktop: the 1440 composition,
// scaled; coordinates are from the top of the curve divider (y 800).

// Labels are ink except on blue: white on the green and pink chips fails AA at
// the 18px mobile size (Howard chose ink at every size, 2026-10-23).
const chips = [
  // Figma widths at the 24px label size; the 390 frame swaps two outlines.
  { width: 232, shape: "slant", mobileShape: "zigzag" },
  { width: 190, shape: "slant" },
  { width: 204, shape: "zigzag", mobileShape: "slant" },
  { width: 274, shape: "slant" },
] as const;

export function CurveDivider() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="block h-[30px] w-full overflow-visible lg:h-[calc(60*var(--px))]"
    >
      <path
        d="M0 50C480 10 960 6.67 1440 40"
        fill="none"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        className="stroke-ink"
      />
    </svg>
  );
}

const pos = (x: number | "c", y: number, extra?: Record<string, string>) =>
  ({ ...(x === "c" ? {} : { "--x": px(x) }), "--y": px(y), ...extra }) as CSSProperties;

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-x-clip">
      <CurveDivider />
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-5 pt-5 lg:block lg:h-[calc(670*var(--px))] lg:p-0">
        <p
          id="about-title"
          className="self-start font-hand text-label-hand lg:absolute lg:top-(--y) lg:left-(--x) lg:text-(length:--fs)"
          style={pos(120, 20, { "--fs": fs(24, 18) })}
        >
          about me!
        </p>

        <Polaroid photo={photos.me} size="sm" angle={4} className="mt-[29px] lg:hidden" />

        <h2
          className="mt-6 rounded-[4px] border-2 border-ink bg-white px-3 py-1.5 text-whatsup font-medium lg:absolute lg:top-(--y) lg:left-1/2 lg:mt-0 lg:-translate-x-1/2 lg:px-(--pad-x) lg:py-(--pad-y) lg:text-(length:--fs)"
          style={pos("c", 70, { "--pad-x": px(16), "--pad-y": px(8), "--fs": px(28) })}
        >
          what’s up
        </h2>

        <p
          className="mt-4 max-w-[22rem] text-center font-hand text-about leading-[1.55] md:max-w-[34rem] lg:absolute lg:top-(--y) lg:left-1/2 lg:mt-0 lg:w-(--w) lg:max-w-none lg:-translate-x-1/2 lg:text-(length:--fs) lg:leading-[1.6]"
          style={pos("c", 150, { "--w": px(700), "--fs": px(32) })}
        >
          {about.paragraph} <span className="font-sans">✏️</span>
        </p>

        <Polaroid
          photo={photos.year}
          size="lg"
          angle={4}
          className="absolute! top-(--y) left-(--x) max-lg:hidden"
          style={pos(130, 207)}
        />
        <Polaroid
          photo={photos.workspace}
          size="lg"
          angle={-4}
          className="absolute! top-(--y) left-(--x) max-lg:hidden"
          style={pos(1110, 132)}
        />

        <ul
          aria-label="What I do"
          className={cn(
            "-mx-3 mt-[30px] flex w-[calc(100%+24px)] max-w-[21em] flex-wrap justify-center gap-3 text-chip lg:absolute lg:top-(--y) lg:left-1/2 lg:mx-0 lg:mt-0 lg:w-auto lg:max-w-none lg:-translate-x-1/2 lg:flex-nowrap lg:gap-(--gap) lg:text-(length:--fs)",
          )}
          style={pos("c", 530, { "--gap": px(20), "--fs": px(24) })}
        >
          {about.skills.map((skill, i) => (
            <TapeChip
              key={skill.label}
              label={skill.label}
              colour={skill.colour}
              light={skill.colour === "blue"}
              {...chips[i]!}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
