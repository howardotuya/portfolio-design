import type { CSSProperties } from "react";
import { host, webProjects, type WebProject } from "@/content/web";
import { cn } from "@/lib/cn";
import { Scribble, Sparkle } from "../icons";
import { BrowserWindow, fs, Note, Pill, px, Tape } from "../paper";

// Figma 4:180–4:182 + 60:23–60:102 (1440) / 8:130–8:132 + 60:107–60:173 (390).
// Rows alternate window-left / window-right. Positions below are Figma pixels
// relative to the (unrotated) browser window's top-left. Each note's x was set
// for its own text in Figma (Kòbò 711, Èkó Fest 731), so it moves with the
// project when the order changes.

const rows = [
  {
    tilt: 1.5,
    mobileTilt: 1,
    tapeTop: -20,
    textTop: 31,
    note: [731, 478, -2],
    arrow: [490, 415],
    flip: false,
  },
  {
    tilt: -1.5,
    mobileTilt: -1,
    tapeTop: -8,
    textTop: 49,
    note: [222, 508, 2],
    arrow: [398, 433],
    flip: true,
  },
  {
    tilt: 1.5,
    mobileTilt: 1,
    tapeTop: -20,
    textTop: 31,
    note: [711, 479, -2],
    arrow: [490, 415],
    flip: false,
  },
] as const;

const noteColour = { yellow: "yellow", mint: "mint", pink: "pink" } as const;

function WebRow({ project, index }: { project: WebProject; index: number }) {
  const row = rows[index]!;
  const flipped = index % 2 === 1;
  const [noteX, noteY, noteTilt] = row.note;
  const [arrowX, arrowY] = row.arrow;

  return (
    <article
      className={cn(
        "grid gap-[22px] lg:items-start lg:gap-0",
        flipped
          ? "lg:grid-cols-[calc(400*var(--px))_1fr_calc(700*var(--px))]"
          : "lg:grid-cols-[calc(700*var(--px))_1fr_calc(420*var(--px))]",
      )}
    >
      {/* The window, its tape, and (desktop) the note and arrow pinned to it. */}
      <div className={cn("relative lg:row-start-1", flipped ? "lg:col-start-3" : "lg:col-start-1")}>
        <a
          href={project.url}
          target="_blank"
          rel="noopener"
          tabIndex={-1}
          aria-hidden
          className="block lift tilt [--tilt:var(--tilt-sm)] lg:[--tilt:var(--tilt-lg)]"
          style={
            {
              "--tilt-sm": `${row.mobileTilt}deg`,
              "--tilt-lg": `${row.tilt}deg`,
            } as CSSProperties
          }
        >
          <BrowserWindow host={host(project)} image={project.thumbnail} />
        </a>
        <Tape
          colour="blue"
          w={100}
          h={22}
          angle={flipped ? -4 : 4}
          className="left-1/2 -translate-x-1/2"
          style={{ top: px(row.tapeTop) }}
        />
        <div
          className="absolute top-(--y) left-(--x) -translate-1/2 max-lg:hidden"
          style={{ "--x": px(noteX), "--y": px(noteY) } as CSSProperties}
        >
          <Note colour={noteColour[project.colour]} angle={noteTilt} lifted className="wiggle-in">
            {project.note} {index === 0 && <Sparkle />}
          </Note>
        </div>
        <Scribble
          flip={row.flip}
          className="absolute top-(--y) left-(--x) w-[calc(70*var(--px))] draw-in text-ink max-lg:hidden"
          style={{ "--x": px(arrowX), "--y": px(arrowY) } as CSSProperties}
        />
      </div>

      <div
        className={cn(
          "lg:row-start-1 lg:pt-(--top)",
          flipped ? "lg:col-start-1" : "lg:col-start-3",
        )}
        style={{ "--top": px(row.textTop) } as CSSProperties}
      >
        <Pill colour={project.colour} size="web" angle={0}>
          <Sparkle className="size-[0.85em]" />
          {project.number}
          <span aria-hidden>&nbsp;·&nbsp;</span>
          <span className="sr-only">, </span>
          {project.category}
        </Pill>
        <h3
          className="mt-3 -ml-[0.03em] text-web-title font-semibold lg:mt-(--gap) lg:text-(length:--fs)"
          style={{ "--gap": px(18), "--fs": px(60) } as CSSProperties}
        >
          {project.name}
        </h3>
        <p
          className="mt-2 max-w-[25rem] text-web-body text-soft lg:mt-(--gap) lg:max-w-(--w) lg:text-(length:--fs)"
          style={{ "--gap": px(14), "--w": px(400), "--fs": fs(19, 15) } as CSSProperties}
        >
          {project.line}
        </p>
        <ul
          aria-label="Built with"
          className="mt-4 flex flex-wrap items-center gap-1.5 lg:mt-(--gap) lg:gap-(--g)"
          style={{ "--gap": px(22), "--g": px(8) } as CSSProperties}
        >
          {project.stack.map((s) => (
            <li key={s}>
              <Pill colour="white" size="stack" outline>
                {s}
              </Pill>
            </li>
          ))}
          {project.status === "building" && (
            <li className="lg:hidden">
              <Status />
            </li>
          )}
        </ul>
        <div
          className="mt-3 flex items-center gap-3 lg:mt-(--gap)"
          style={{ "--gap": px(17) } as CSSProperties}
        >
          <a
            href={project.url}
            target="_blank"
            rel="noopener"
            className="group flex h-[50px] w-full press items-center justify-center gap-[0.75em] bg-ink font-mono text-xs leading-[1.3] font-bold tracking-[0.06em] text-white lg:h-auto lg:w-auto lg:px-(--px-x) lg:py-(--px-y) lg:text-(length:--fs)"
            style={{ "--px-x": px(18), "--px-y": px(13), "--fs": fs(13, 12) } as CSSProperties}
          >
            {host(project)}
            <span
              aria-hidden
              className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          {project.status === "building" && (
            <span className="max-lg:hidden">
              <Status />
            </span>
          )}
        </div>
        <Note
          colour={noteColour[project.colour]}
          angle={1.5}
          lifted
          className="mt-4 ml-px wiggle-in lg:hidden"
        >
          {project.note} {index === 0 && <Sparkle />}
        </Note>
      </div>
    </article>
  );
}

function Status() {
  return (
    <Pill colour="beige" size="status">
      <span aria-hidden className="size-[0.7em] rounded-full bg-ink" />
      building in code
    </Pill>
  );
}

export function WebWork() {
  return (
    <section
      id="web"
      aria-labelledby="web-title"
      className="container-page pt-[60px] defer-render [--defer-h:2000px] lg:pt-[calc(90*var(--px))]"
    >
      <p
        className="font-hand text-label-hand lg:text-(length:--fs)"
        style={{ "--fs": fs(24, 18) } as CSSProperties}
      >
        designed, directed and built by me
      </p>
      <h2
        id="web-title"
        className="-ml-[0.05em] font-pixel text-pixel leading-[0.9] uppercase lg:text-(length:--fs)"
        style={{ "--fs": px(150) } as CSSProperties}
      >
        Web
      </h2>
      <p
        className="mt-3.5 max-w-[22rem] text-sub text-soft md:max-w-[36rem] lg:mt-(--gap) lg:max-w-(--w) lg:text-(length:--fs) lg:leading-[1.3]"
        style={{ "--gap": px(5), "--w": px(700), "--fs": fs(24, 17) } as CSSProperties}
      >
        Three new web projects. I design and direct them, then build them in code.
      </p>
      <div
        className="mt-[50px] grid gap-14 lg:mt-(--gap) lg:gap-(--row)"
        style={{ "--gap": px(97), "--row": px(204) } as CSSProperties}
      >
        {webProjects.map((p, i) => (
          <WebRow key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
