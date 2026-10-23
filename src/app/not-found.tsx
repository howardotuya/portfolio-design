import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Sparkle } from "@/components/icons";
import { fs, Note, Pill, px, Tape } from "@/components/paper";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

// Not in Figma: built from the hero's pieces (pixel type in the orange box,
// a sticky note, a tag, the ink button) so a wrong link still feels like the
// notebook. Static export writes it to out/404.html.

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const dropIn = "motion-safe:animate-[drop-in_520ms_var(--ease-out-expo)_backwards]";

export default function NotFound() {
  return (
    <>
      <SiteHeader onHome={false} />
      <main className="container-page flex min-h-[calc(100dvh-var(--header-h)-8rem)] flex-col items-center justify-center py-16 text-center lg:py-(--py)">
        <p
          className="font-hand text-label-hand lg:text-(length:--fs)"
          style={{ "--fs": fs(24, 18) } as CSSProperties}
        >
          oops, wrong page!
        </p>

        <div className="relative mt-7 lg:mt-(--gap)" style={{ "--gap": px(36) } as CSSProperties}>
          <h1
            className="relative px-[0.11em] pt-[0.026em] font-pixel text-name leading-[0.9] uppercase lg:text-(length:--fs)"
            style={{ "--fs": px(190) } as CSSProperties}
          >
            404
          </h1>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[4px] border-[2.5px] border-orange motion-safe:animate-[draw-box_700ms_var(--ease-in-out-quart)_150ms_backwards] lg:border-3"
          />
          <Tape
            colour="blue"
            w={80}
            h={26}
            angle={-20}
            className="max-sm:hidden"
            style={{ left: px(-46), top: px(-14) }}
          />
          <div className="absolute -top-4 -right-6 sm:-right-16">
            <Pill
              colour="mint"
              angle={6}
              shadow
              className={dropIn}
              style={{ animationDelay: "500ms" }}
            >
              Not found
            </Pill>
          </div>
        </div>

        <div className="mt-7 lg:mt-(--gap)" style={{ "--gap": px(34) } as CSSProperties}>
          <Note colour="yellow" angle={-3} className={dropIn} style={{ animationDelay: "650ms" }}>
            this page isn’t in the notebook <Sparkle />
          </Note>
        </div>

        <p
          className="mt-6 max-w-[22rem] text-sub text-soft lg:mt-(--gap) lg:max-w-(--w) lg:text-(length:--fs)"
          style={{ "--gap": px(30), "--w": px(560), "--fs": fs(24, 17) } as CSSProperties}
        >
          The link may be old, or it has a typo. Everything I’ve made is one page back.
        </p>

        <div
          className="mt-6 flex flex-col items-center gap-4 lg:mt-(--gap) lg:gap-(--g)"
          style={{ "--gap": px(34), "--g": px(18) } as CSSProperties}
        >
          <a
            href="/"
            className="group inline-flex press items-center gap-2.5 bg-ink px-4 py-3 font-mono text-[12px] leading-[1.3] font-bold tracking-[0.08em] text-white lg:gap-(--g2) lg:px-(--px-x) lg:py-(--px-y) lg:text-(length:--fs)"
            style={
              {
                "--g2": px(12),
                "--px-x": px(20),
                "--px-y": px(14),
                "--fs": fs(14, 12),
              } as CSSProperties
            }
          >
            <span
              aria-hidden
              className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-0.5"
            >
              ←
            </span>
            BACK HOME
          </a>
          <a
            href="/#work"
            className="font-hand text-lg text-soft underline decoration-1 underline-offset-4 hover:text-ink lg:text-(length:--fs)"
            style={{ "--fs": fs(20, 18) } as CSSProperties}
          >
            or go straight to the work
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
