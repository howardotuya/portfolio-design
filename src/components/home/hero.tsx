import type { CSSProperties, ReactNode } from "react";
import { photos, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Pencil } from "../icons";
import { fs, Note, Pill, Polaroid, px } from "../paper";

// Figma 4:18 (1440) / 8:14 (390). From 1024 up the hero is the 1440
// composition scaled to the viewport (sizes in px(), see paper.tsx); below
// that it reflows as the 390 frame's grid. Coordinates are Figma's, minus
// the 64px nav.

/** Centre a sticker on a Figma point from 1024 up; in flow below. */
function At({
  x,
  y,
  className,
  children,
}: {
  x: number;
  y: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "lg:absolute lg:top-(--y) lg:left-(--x) lg:-translate-x-1/2 lg:-translate-y-1/2",
        className,
      )}
      style={{ "--x": px(x), "--y": px(y) } as CSSProperties}
    >
      {children}
    </div>
  );
}

// Each sticker drops in and lands at its tilt; staggered after the name.
const drop = (ms: number) =>
  ({
    animationDelay: `${ms}ms`,
  }) as CSSProperties;
const dropIn = "motion-safe:animate-[drop-in_520ms_var(--ease-out-expo)_backwards]";

export function Hero() {
  const letters = [..."Howard"];
  return (
    <section id="top" aria-labelledby="hero-name" className="relative overflow-x-clip">
      <div className="relative mx-auto grid max-w-[34rem] grid-cols-2 px-5 pt-[34px] pb-[60px] lg:block lg:h-[calc(736*var(--px))] lg:max-w-[1440px] lg:p-0">
        <At x={357} y={119} className="col-start-1 row-start-1 justify-self-start">
          <Pill colour="mint" angle={5} shadow className={dropIn} style={drop(520)}>
            Designs <Pencil className="size-[1.05em]" />
          </Pill>
        </At>
        <At x={1072} y={108} className="col-start-2 row-start-1 -mt-[11px] justify-self-end">
          <Pill colour="beige" angle={-5} shadow className={dropIn} style={drop(600)}>
            Builds &lt;/&gt;
          </Pill>
        </At>

        <p
          className="col-span-2 row-start-2 mt-[9px] text-center font-hand text-lg leading-[1.5] lg:absolute lg:top-(--y) lg:left-1/2 lg:mt-0 lg:-translate-x-1/2 lg:text-(length:--fs)"
          style={{ "--y": px(76), "--fs": fs(24, 18) } as CSSProperties}
        >
          my name is
        </p>

        {/* The name, in the orange box that draws itself around it. */}
        <div
          className="relative col-span-2 row-start-3 mt-[11px] justify-self-center lg:absolute lg:top-(--y) lg:left-1/2 lg:mt-0 lg:-translate-x-1/2"
          style={{ "--y": px(126) } as CSSProperties}
        >
          <h1
            id="hero-name"
            className="relative px-[0.11em] pt-[0.026em] font-pixel text-name leading-[0.9] uppercase lg:text-(length:--fs)"
            style={{ "--fs": px(190) } as CSSProperties}
          >
            {letters.map((l, i) => (
              <span
                key={i}
                className="motion-safe:animate-[pixel-on_1ms_steps(1)_backwards]"
                style={{ animationDelay: `${60 + i * 70}ms` }}
              >
                {l}
              </span>
            ))}
          </h1>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[4px] border-[2.5px] border-orange motion-safe:animate-[draw-box_700ms_var(--ease-in-out-quart)_250ms_backwards] lg:border-3"
          />
        </div>

        <At x={397} y={347} className="col-start-1 row-start-4 mt-[27px] justify-self-start">
          <Note colour="yellow" angle={5} className={dropIn} style={drop(680)}>
            Design engineer
          </Note>
        </At>
        <At x={1074} y={335} className="col-start-2 row-start-4 mt-[18px] justify-self-end">
          <Note colour="mint" angle={-4} className={dropIn} style={drop(760)}>
            Lagos, NG
          </Note>
        </At>

        <p
          className="col-span-2 row-start-5 mt-[14px] flex items-center justify-center gap-2 font-mono text-[11px] leading-[1.3] font-bold tracking-[0.08em] uppercase lg:absolute lg:top-(--y) lg:left-(--x) lg:mt-0 lg:-translate-y-1/2 lg:gap-(--gap) lg:text-(length:--fs) lg:tracking-[0.1em]"
          style={
            { "--x": px(540), "--y": px(340), "--gap": px(10), "--fs": fs(13, 11) } as CSSProperties
          }
        >
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full bg-green lg:size-(--dot)"
            style={{ "--dot": px(10) } as CSSProperties}
          />
          {site.status}
        </p>

        <div
          className="col-span-2 row-start-6 mt-[22px] text-center lg:absolute lg:top-(--y) lg:left-1/2 lg:mt-0 lg:w-(--w) lg:-translate-x-1/2"
          style={{ "--y": px(406), "--w": px(1100) } as CSSProperties}
        >
          <p
            className="mx-auto max-w-[11ch] text-headline font-semibold lg:max-w-none lg:text-(length:--fs)"
            style={{ "--fs": px(60) } as CSSProperties}
          >
            {site.headline}
          </p>
          <p
            className="mx-auto mt-[13px] max-w-[22rem] text-sub text-soft md:max-w-[34rem] lg:mt-(--gap) lg:max-w-(--w) lg:text-(length:--fs)"
            style={{ "--gap": px(21), "--w": px(800), "--fs": fs(24, 16) } as CSSProperties}
          >
            {site.description}
          </p>
          <a
            href="#work"
            className="group mt-3 inline-flex press items-center gap-2.5 bg-ink px-4 py-3 font-mono text-[12px] leading-[1.3] font-bold tracking-[0.08em] text-white lg:mt-(--gap) lg:gap-(--g2) lg:px-(--px-x) lg:py-(--px-y) lg:text-(length:--fs)"
            style={
              {
                "--gap": px(28),
                "--g2": px(12),
                "--px-x": px(20),
                "--px-y": px(14),
                "--fs": fs(14, 12),
              } as CSSProperties
            }
          >
            <span
              aria-hidden
              className="size-5 bg-blue lg:size-(--sq)"
              style={{ "--sq": px(26) } as CSSProperties}
            />
            SEE THE WORK
            <span
              aria-hidden
              className="transition-transform duration-300 ease-out-expo group-hover:translate-y-0.5"
            >
              ↓
            </span>
          </a>
        </div>

        {/* Taped polaroids: desktop composition only; the 390 frame moves "me" into About. */}
        <Polaroid
          photo={photos.me}
          size="sm"
          angle={6}
          className={cn("absolute! top-(--y) left-(--x) max-lg:hidden", dropIn)}
          style={{ "--x": px(98), "--y": px(244), animationDelay: "820ms" } as CSSProperties}
        />
        <Polaroid
          photo={photos.desk}
          size="sm"
          angle={-5}
          className={cn("absolute! top-(--y) left-(--x) max-lg:hidden", dropIn)}
          style={{ "--x": px(1179), "--y": px(448), animationDelay: "900ms" } as CSSProperties}
        />
      </div>
    </section>
  );
}
