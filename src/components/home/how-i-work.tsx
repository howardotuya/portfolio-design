import type { CSSProperties } from "react";
import { howIWork } from "@/content/site";
import { Sparkle } from "../icons";
import { fs, Note, px } from "../paper";

// Figma 4:204–4:208 (1440) / 8:154–8:158 (390).
export function HowIWork() {
  return (
    <section
      aria-labelledby="how-title"
      className="relative container-page pt-[76px] lg:pt-[calc(184*var(--px))]"
    >
      <p
        className="font-hand text-label-hand lg:text-(length:--fs)"
        style={{ "--fs": fs(24, 18) } as CSSProperties}
      >
        how I work
      </p>
      <h2
        id="how-title"
        className="mt-[5px] text-how font-semibold lg:mt-(--gap) lg:max-w-(--w) lg:text-(length:--fs)"
        style={{ "--gap": px(4), "--w": px(900), "--fs": px(44) } as CSSProperties}
      >
        {howIWork.title}
      </h2>
      <p
        className="mt-3 max-w-[38rem] text-how-body text-soft lg:mt-(--gap) lg:max-w-(--w) lg:text-(length:--fs)"
        style={{ "--gap": px(19), "--w": px(760), "--fs": fs(22, 17) } as CSSProperties}
      >
        {howIWork.body}
      </p>
      <div
        className="mt-5 lg:absolute lg:top-(--y) lg:left-(--x) lg:mt-0 lg:-translate-1/2"
        style={{ "--x": px(1038), "--y": px(184 + 70) } as CSSProperties}
      >
        <Note colour="beige" angle={2} angleLg={-4} className="wiggle-in">
          {howIWork.note} <Sparkle />
        </Note>
      </div>
    </section>
  );
}
