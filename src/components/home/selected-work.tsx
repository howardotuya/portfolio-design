import type { CSSProperties } from "react";
import { cover, projects, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";
import { keepHyphens } from "@/lib/text";
import { Sparkle } from "../icons";
import { FolderTab, fs, Pill, px, Tape } from "../paper";
import { Picture } from "../picture";

// Figma 4:102–4:179 (1440) / 8:67–8:129 (390). On desktop the folder cards
// stack as you scroll: each is sticky, a tab's height lower than the last,
// so a new card slides over the previous one and every tab stays in view.

const onDark = new Set<Project["colour"]>(["dark", "blue", "pink"]);
const cardBg = {
  dark: "bg-dark",
  yellow: "bg-yellow",
  blue: "bg-blue",
  pink: "bg-pink",
  mint: "bg-mint",
} as const;

// Tabs step right 190px per card on desktop; on the 390 frame they go 0, 90, 180, 0, 90.
const MOBILE_TAB = [0, 90, 180, 0, 90];

function FolderCard({ project, index }: { project: Project; index: number }) {
  const light = onDark.has(project.colour);
  const href = `/work/${project.slug}`;
  return (
    <article
      className={cn(
        "group relative lg:sticky lg:top-(--stick)",
        index > 0 && "mt-5 lg:mt-[calc(-102*var(--px))]",
        light ? "text-white" : "text-ink surface-yellow",
      )}
      style={
        {
          "--stick": `calc(var(--header-h) + ${px(24)} + ${px(46 * index)})`,
          "--tab-x": `${MOBILE_TAB[index]}px`,
          "--tab-x-lg": px(190 * index),
        } as CSSProperties
      }
    >
      <FolderTab
        colour={project.colour}
        className="ml-(--tab-x) h-[34px] w-[150px] pl-3.5 font-mono text-[11px] leading-[1.3] font-bold tracking-[0.08em] uppercase lg:ml-(--tab-x-lg) lg:h-[calc(46*var(--px))] lg:w-[calc(220*var(--px))] lg:pl-[calc(22*var(--px))] lg:text-(length:--fs) lg:tracking-[0.1em]"
        style={{ "--fs": fs(13, 11) } as CSSProperties}
      >
        <span className="flex items-center gap-[0.5em]">
          <Sparkle />
          {project.number}
        </span>
      </FolderTab>

      <div
        className={cn(
          "flex flex-col p-4 pb-7 lg:grid lg:h-[calc(520*var(--px))] lg:grid-cols-[1fr_calc(560*var(--px))] lg:items-start lg:gap-[calc(70*var(--px))] lg:pt-[calc(59*var(--px))] lg:pr-[calc(60*var(--px))] lg:pl-[calc(50*var(--px))]",
          cardBg[project.colour],
        )}
      >
        <div className="order-2 mt-[22px] flex flex-col lg:order-none lg:mt-0 lg:min-h-[calc(297*var(--px))]">
          <p
            className="flex items-center gap-[calc(10*var(--px))] font-mono text-[11px] leading-[1.3] font-bold tracking-[0.08em] uppercase lg:text-(length:--fs) lg:tracking-[0.1em]"
            style={{ "--fs": fs(13, 11) } as CSSProperties}
          >
            <span
              aria-hidden
              className={cn(
                "size-[calc(10*var(--px))] rounded-full max-lg:hidden",
                light ? "bg-white" : "bg-ink",
              )}
            />
            {project.cardMeta}
          </p>
          <h3
            className="mt-3 text-[30px] leading-[1.1] font-semibold tracking-[-0.015em] [text-wrap:wrap] lg:mt-[calc(22*var(--px))] lg:w-[calc(480*var(--px))] lg:text-(length:--fs) lg:leading-[1.08] lg:tracking-[-0.02em]"
            style={{ "--fs": px(56) } as CSSProperties}
          >
            {keepHyphens(project.cardTitle)}
          </h3>
          <p
            className="mt-3 text-base leading-[1.5] lg:mt-[calc(24*var(--px))] lg:max-w-[calc(440*var(--px))] lg:text-(length:--fs)"
            style={{ "--fs": fs(20, 15) } as CSSProperties}
          >
            {keepHyphens(project.cardLine)}
          </p>
          <a
            href={href}
            className="mt-[18px] w-fit font-mono text-xs leading-[1.3] font-bold tracking-[0.08em] uppercase after:absolute after:inset-0 after:z-10 lg:mt-auto lg:text-(length:--fs) lg:tracking-[0.1em]"
            style={{ "--fs": fs(14, 12) } as CSSProperties}
          >
            <span className="flex items-center gap-[0.5em]">
              View project
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </span>
            <span
              aria-hidden
              className={cn(
                "mt-1.5 block h-[1.5px] w-full origin-left transition-transform duration-500 ease-out-expo group-hover:scale-x-110 lg:mt-[calc(6*var(--px))] lg:h-[2px]",
                light ? "bg-white" : "bg-ink",
              )}
            />
          </a>
        </div>

        <div className="relative order-1 lg:order-none lg:mt-px">
          <div
            className="transition-[translate,box-shadow] duration-500 ease-out-expo group-hover:-translate-y-1.5 group-hover:shadow-lifted motion-reduce:transition-none"
            style={{ viewTransitionName: `cover-${project.slug}` }}
          >
            <Picture
              name={cover(project)}
              alt={`${project.cardTitle}: cover`}
              width={560}
              height={315}
              sizes="(width >= 64rem) min(39vw, 560px), calc(100vw - 72px)"
              loading="lazy"
              className="aspect-video w-full object-cover"
            />
          </div>
          <Tape
            colour="line"
            w={90}
            h={26}
            angle={12}
            className="max-lg:hidden"
            style={{ left: px(-14), top: px(-7) }}
          />
          <Tape
            colour="line"
            w={90}
            h={26}
            angle={-12}
            className="max-lg:hidden"
            style={{ left: px(492), top: px(-26) }}
          />
        </div>
      </div>
    </article>
  );
}

export function SelectedWork() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="container-page pt-16 defer-render [--defer-h:2600px] lg:pt-[calc(84*var(--px))]"
    >
      <p
        className="font-hand text-label-hand lg:text-(length:--fs)"
        style={{ "--fs": fs(24, 18) } as CSSProperties}
      >
        explore my work!
      </p>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:pr-[calc(50*var(--px))]">
        <h2
          id="work-title"
          className="-ml-[0.05em] max-w-[5em] font-pixel text-pixel leading-[0.9] uppercase lg:max-w-none lg:text-(length:--fs)"
          style={{ "--fs": px(150) } as CSSProperties}
        >
          Selected work
        </h2>
        <nav aria-label="Filter work" className="lg:pt-[calc(8*var(--px))]">
          <ul className="flex gap-2 lg:gap-[calc(12*var(--px))]">
            {(
              [
                ["Decks", "#decks", "yellow"],
                ["Documents", "#documents", "mint"],
                ["Web", "#web", "pink"],
              ] as const
            ).map(([label, hash, colour]) => (
              <li key={hash}>
                <a href={hash} className="block press rounded-full">
                  <Pill colour={colour} className="lg:shadow-paper">
                    {label}
                  </Pill>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-[42px] lg:mt-[calc(59*var(--px))]">
        {projects.map((project, i) => (
          <div key={project.slug} className="contents">
            {i === 0 && <span id="decks" className="block" />}
            {project.kind === "document" && projects[i - 1]?.kind === "deck" && (
              <span id="documents" className="relative block lg:-top-[calc(102*var(--px))]" />
            )}
            <FolderCard project={project} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
