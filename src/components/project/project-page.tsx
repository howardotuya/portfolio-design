import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { cover, nextProject, slideImage, type Project } from "@/content/projects";
import { imageUrl } from "@/lib/image-loader";
import { images } from "@/lib/images.gen";
import { cn } from "@/lib/cn";
import { keepHyphens } from "@/lib/text";
import { Sparkle } from "../icons";
import { fs, Note, px, Tape } from "../paper";
import { Picture } from "../picture";
import { Lightbox, type LightboxSlide } from "./lightbox";
import { TypeSample } from "./type-sample";

// One template for all five project pages: Figma 6:15 / 9:31 (Yolura) and
// 44:40, 44:238, 44:436, 44:634 with their 390 frames. Desktop numbers are
// Figma 1440 pixels (px()), the 390 frame's in plain px.

const pad = (n: number) => String(n).padStart(2, "0");

const meta = [
  { key: "role", label: "Role", colour: "blue", angle: 3, x: 970, y: 242 },
  { key: "format", label: "Format", colour: "beige", angle: -2, x: 1211, y: 232 },
  { key: "tools", label: "Tools", colour: "mint", angle: 2, x: 970, y: 360 },
  { key: "year", label: "Year", colour: "pink", angle: -3, x: 1212, y: 350 },
] as const;

// Ink on the Portfolio blue is 2.9:1, so the Role note takes white text.
const metaBg = {
  blue: "bg-blue text-white",
  beige: "bg-beige text-ink",
  mint: "bg-mint text-ink",
  pink: "bg-pink text-ink",
};

function Label({ children, className }: { children: string; className?: string }) {
  return (
    <p
      className={cn(
        "font-hand text-xl leading-[1.3] lg:text-(length:--fs) lg:leading-[1.5]",
        className,
      )}
      style={{ "--fs": fs(26, 20) } as CSSProperties}
    >
      {children}
    </p>
  );
}

function ProjectHero({ project }: { project: Project }) {
  return (
    <header className="relative">
      <a
        href="/#work"
        className="group inline-flex items-center gap-[0.5em] font-mono text-[11px] leading-[1.3] font-bold tracking-[0.08em] text-soft uppercase hover:text-ink lg:text-(length:--fs) lg:tracking-[0.1em]"
        style={{ "--fs": fs(13, 11) } as CSSProperties}
      >
        <span
          aria-hidden
          className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-0.5"
        >
          ←
        </span>
        All work
      </a>

      <p
        className="mt-[26px] flex items-center gap-2 font-mono text-[11px] leading-[1.3] font-bold tracking-[0.08em] uppercase lg:mt-(--gap) lg:gap-(--g) lg:text-(length:--fs) lg:tracking-[0.1em]"
        style={{ "--gap": px(46), "--g": px(10), "--fs": fs(13, 11) } as CSSProperties}
      >
        <span
          aria-hidden
          className="size-2 rounded-full bg-ink lg:size-(--d)"
          style={{ "--d": px(10) } as CSSProperties}
        />
        {project.number}
        <span aria-hidden>&nbsp;·&nbsp;</span>
        <span className="sr-only">, </span>
        {project.year}
      </p>

      <h1
        className="mt-2.5 -ml-[0.033em] font-pixel text-(length:--fs-sm) leading-[0.9] whitespace-nowrap uppercase lg:mt-(--gap) lg:text-(length:--fs-lg)"
        style={
          {
            // The 390 frame's size, growing to the 1440 one; below 390 it shrinks
            // with the viewport so the title always stays on one line.
            "--fs-sm": `min(${(project.titleSize.sm / 390) * 100}vw, clamp(${project.titleSize.sm}px, ${project.titleSize.sm}px + ${((project.titleSize.lg - project.titleSize.sm) / 1050) * 100}vw - ${((project.titleSize.lg - project.titleSize.sm) / 1050) * 390}px, ${project.titleSize.lg}px))`,
            "--fs-lg": px(project.titleSize.lg),
            "--gap": px(10),
          } as CSSProperties
        }
      >
        {project.title}
      </h1>

      <p
        className="mt-2 max-w-[24rem] text-lg leading-[1.55] text-soft md:max-w-[34rem] lg:mt-(--gap) lg:max-w-(--w) lg:text-(length:--fs)"
        style={{ "--gap": px(9), "--w": px(620), "--fs": fs(24, 18) } as CSSProperties}
      >
        {project.subtitle}
      </p>

      <ul
        aria-label="Tags"
        className="mt-4 flex flex-wrap gap-2 lg:mt-(--gap) lg:gap-(--g)"
        style={{ "--gap": px(16), "--g": px(10) } as CSSProperties}
      >
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-[4px] bg-beige px-3 py-1.5 font-mono text-[11px] leading-[1.3] font-bold tracking-[0.08em] uppercase lg:px-(--px-x) lg:py-(--px-y) lg:text-(length:--fs)"
            style={{ "--px-x": px(14), "--px-y": px(6), "--fs": fs(12, 11) } as CSSProperties}
          >
            {tag}
          </li>
        ))}
      </ul>

      {/* Role / Format / Tools / Year: a 2×2 grid of notes, tilted on desktop. */}
      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-[18px] lg:mt-0">
        {meta.map((m) => (
          <div
            key={m.key}
            className={cn(
              "flex tilt flex-col gap-1 px-3.5 py-2.5 lg:absolute lg:top-(--y) lg:left-(--x) lg:w-(--w) lg:-translate-1/2 lg:gap-(--g) lg:px-(--px-x) lg:py-(--px-y) lg:[--tilt:var(--angle)]",
              metaBg[m.colour],
            )}
            style={
              {
                "--x": px(m.x - 120),
                "--y": px(m.y - 110),
                "--w": px(220),
                "--g": px(6),
                "--px-x": px(18),
                "--px-y": px(14),
                "--angle": `${m.angle}deg`,
              } as CSSProperties
            }
          >
            <dt
              className="font-mono text-[10px] leading-[1.2] font-bold tracking-[0.1em] uppercase lg:text-(length:--fs)"
              style={{ "--fs": fs(11, 10) } as CSSProperties}
            >
              {m.label}
            </dt>
            <dd
              className="text-base leading-[1.25] font-medium lg:text-(length:--fs)"
              style={{ "--fs": fs(18, 16) } as CSSProperties}
            >
              {project.meta[m.key]}
            </dd>
          </div>
        ))}
      </dl>

      {/* The cover, taped down; it morphs from the home card's cover. */}
      <div className="relative mt-9 lg:mt-(--gap)" style={{ "--gap": px(80) } as CSSProperties}>
        <div className="slide-frame" style={{ viewTransitionName: `cover-${project.slug}` }}>
          <Picture
            name={cover(project)}
            alt={`${project.title}: cover slide`}
            width={1200}
            height={675}
            sizes="(width >= 75rem) 1200px, calc(100vw - 2 * var(--gutter))"
            priority
            className="aspect-video w-full object-cover"
          />
        </div>
        <Tape
          colour="line"
          w={120}
          h={26}
          angle={10}
          className="max-lg:hidden"
          style={{ left: px(-23), top: px(-10) }}
        />
        <Tape
          colour="line"
          w={120}
          h={26}
          angle={-10}
          className="max-lg:hidden"
          style={{ left: px(1101), top: px(-31) }}
        />
      </div>
    </header>
  );
}

function Brief({ project }: { project: Project }) {
  return (
    <section
      aria-label="The brief and my direction"
      className="mt-[50px] grid gap-11 lg:mt-(--gap) lg:grid-cols-[calc(560*var(--px))_calc(540*var(--px))] lg:justify-between lg:gap-0"
      style={{ "--gap": px(85) } as CSSProperties}
    >
      <div>
        <Label>the brief</Label>
        <h2
          className="mt-1 text-2xl leading-[1.25] font-semibold tracking-[-0.01em] lg:mt-(--gap) lg:text-(length:--fs)"
          style={{ "--gap": px(7), "--fs": px(36) } as CSSProperties}
        >
          {project.brief.headline}
        </h2>
        <p
          className="mt-3.5 text-[17px] leading-[1.55] text-soft lg:mt-(--gap) lg:text-(length:--fs)"
          style={{ "--gap": px(19), "--fs": fs(22, 17) } as CSSProperties}
        >
          {project.brief.body}
        </p>
      </div>
      <div>
        <Label>my direction</Label>
        <ol className="mt-3 lg:mt-(--gap)" style={{ "--gap": px(11) } as CSSProperties}>
          {project.direction.map((point, i) => (
            <li
              key={i}
              className={cn(
                "grid grid-cols-[40px_1fr] border-t-[1.5px] border-ink pt-3 pb-4 lg:grid-cols-[calc(60*var(--px))_1fr] lg:pt-(--pt) lg:pb-(--pb)",
                i === project.direction.length - 1 && "pb-0 lg:pb-0",
              )}
              style={{ "--pt": px(16), "--pb": px(18) } as CSSProperties}
            >
              <span
                aria-hidden
                className="pt-[0.45em] font-mono text-[11px] leading-[1.3] font-bold tracking-[0.08em] text-orange-ink lg:text-(length:--fs) lg:tracking-[0.1em]"
                style={{ "--fs": fs(13, 11) } as CSSProperties}
              >
                {pad(i + 1)}
              </span>
              <p
                className="text-base leading-[1.55] lg:text-(length:--fs)"
                style={{ "--fs": fs(20, 16) } as CSSProperties}
              >
                {point}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function System({ project }: { project: Project }) {
  return (
    <section
      aria-label="The system"
      className="mt-14 lg:mt-(--gap)"
      style={{ "--gap": px(84) } as CSSProperties}
    >
      <Label>the system</Label>
      <div
        className="mt-4 grid gap-10 lg:mt-(--gap) lg:grid-cols-[1fr_calc(380*var(--px))] lg:items-start lg:gap-(--g)"
        style={{ "--gap": px(11), "--g": px(60) } as CSSProperties}
      >
        <ul
          aria-label="Colours"
          className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-(--g) lg:gap-y-0"
          style={{ "--g": px(20) } as CSSProperties}
        >
          {project.system.swatches.map((s) => (
            <li key={s.hex}>
              <span
                aria-hidden
                className="block h-[150px] rounded-[8px] border border-ink lg:aspect-square lg:h-auto"
                style={{ backgroundColor: s.hex }}
              />
              <p
                className="mt-3 text-base leading-[1.3] font-semibold lg:mt-(--gap) lg:text-(length:--fs)"
                style={{ "--gap": px(16), "--fs": fs(18, 16) } as CSSProperties}
              >
                {s.name}
              </p>
              <p
                className="mt-[3px] font-mono text-[10px] leading-[1.3] font-bold tracking-[0.08em] text-soft uppercase lg:mt-(--gap) lg:text-(length:--fs) lg:tracking-[0.1em]"
                style={{ "--gap": px(4), "--fs": fs(12, 10) } as CSSProperties}
              >
                {s.hex}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 lg:gap-[calc(18*var(--px))]">
          <TypeSample project={project} />
          <p
            className="font-mono text-[10px] leading-[1.3] font-bold tracking-[0.08em] text-soft uppercase lg:text-(length:--fs) lg:tracking-[0.1em]"
            style={{ "--fs": fs(12, 10) } as CSSProperties}
          >
            {project.system.typeLabel}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Lightbox sources, computed here so the client component only gets URLs. */
function lightboxSlides(project: Project): LightboxSlide[] {
  return project.slides.map((caption, i) => {
    const name = slideImage(project, i);
    const { width, height } = images[name];
    // The box the slide fits in: the viewport less the dialog's padding, bars
    // and gaps. It's usually height-bound, so 100vw would over-fetch.
    const ratio = (width / height).toFixed(4);
    const sizes = `(width >= 64rem) min(100vw - 4rem, (100vh - 11.5rem) * ${ratio}), min(100vw - 2rem, (100vh - 8.4rem) * ${ratio})`;
    const common = { src: name, alt: "", width, height, sizes };
    const webp = getImageProps(common).props;
    const avif = getImageProps({
      ...common,
      loader: ({ src, width: w }) => imageUrl(src, w, "avif"),
    }).props;
    return {
      caption,
      alt: `${project.title}, slide ${i + 1}: ${caption}`,
      width,
      height,
      sizes,
      src: webp.src,
      webp: webp.srcSet ?? "",
      avif: avif.srcSet ?? "",
    };
  });
}

function Slides({ project }: { project: Project }) {
  return (
    <section
      aria-label={project.slidesHeading}
      className="mt-[54px] lg:mt-(--gap)"
      style={{ "--gap": px(90) } as CSSProperties}
    >
      <Label>{project.slidesHeading}</Label>
      <ul
        id="slides"
        className="mt-2.5 grid gap-y-[23px] lg:mt-(--gap) lg:grid-cols-2 lg:gap-x-(--gx) lg:gap-y-(--gy)"
        style={{ "--gap": px(21), "--gx": px(20), "--gy": px(38) } as CSSProperties}
      >
        {project.slides.map((caption, i) => (
          // Deferred while the page loads, so the slides don't compete with the
          // cover; the lightbox lifts it at load (see there).
          <li
            key={caption}
            className="defer-render [--defer-h:240px] lg:[--defer-h:calc(400*var(--px))]"
          >
            <button
              type="button"
              data-slide={i}
              className="slide-frame block w-full cursor-zoom-in text-left"
              aria-label={`Open slide ${i + 1}: ${caption}`}
            >
              <Picture
                name={slideImage(project, i)}
                alt=""
                width={590}
                height={332}
                sizes="(width >= 64rem) min(41vw, 590px), calc(100vw - 2 * var(--gutter))"
                loading="lazy"
                className="aspect-video w-full object-cover"
              />
            </button>
            <p
              className="mt-2.5 font-mono text-[10px] leading-[1.3] font-bold tracking-[0.08em] text-soft uppercase lg:mt-(--gap) lg:text-(length:--fs) lg:tracking-[0.1em]"
              style={{ "--gap": px(14), "--fs": fs(12, 10) } as CSSProperties}
            >
              {pad(i + 1)}&nbsp;&nbsp;{caption}
            </p>
          </li>
        ))}
      </ul>
      <Lightbox slides={lightboxSlides(project)} title={project.title} />
    </section>
  );
}

function NextProject({ project }: { project: Project }) {
  const { project: next, label } = nextProject(project);
  return (
    <a
      href={`/work/${next.slug}`}
      className="group mt-[50px] flex flex-col bg-yellow p-4 pb-6 surface-yellow lg:mt-(--gap) lg:h-(--h) lg:flex-row lg:items-start lg:justify-between lg:py-(--py) lg:pr-(--pr) lg:pl-(--pl)"
      style={
        {
          "--gap": px(74),
          "--h": px(260),
          "--py": px(40),
          "--pr": px(40),
          "--pl": px(50),
        } as CSSProperties
      }
    >
      <div
        className="order-2 mt-[22px] lg:order-none lg:mt-(--top)"
        style={{ "--top": px(16) } as CSSProperties}
      >
        <p
          className="font-mono text-[10px] leading-[1.3] font-bold tracking-[0.08em] uppercase lg:text-(length:--fs) lg:tracking-[0.1em]"
          style={{ "--fs": fs(13, 10) } as CSSProperties}
        >
          Next project<span aria-hidden>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
          <span className="sr-only">: </span>
          {label}
        </p>
        <p
          className="mt-2 text-4xl leading-[1.3] font-semibold tracking-[-0.015em] lg:mt-(--gap) lg:text-(length:--fs) lg:tracking-[-0.025em]"
          style={{ "--gap": px(27), "--fs": px(64) } as CSSProperties}
        >
          {keepHyphens(next.nextTitle)}
          <span
            aria-hidden
            className="ml-[0.35em] inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-2"
          >
            →
          </span>
        </p>
      </div>
      <div
        className="slide-frame order-1 transition-[translate,rotate,box-shadow] duration-500 ease-out-expo group-hover:-translate-y-2 group-hover:-rotate-2 group-hover:shadow-slide-hover motion-reduce:transition-none lg:order-none lg:w-(--w) lg:shrink-0"
        style={{ "--w": px(320), viewTransitionName: `cover-${next.slug}` } as CSSProperties}
      >
        <Picture
          name={cover(next)}
          alt=""
          width={320}
          height={180}
          sizes="(width >= 64rem) 320px, calc(100vw - 72px)"
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      </div>
    </a>
  );
}

export function ProjectPage({ project }: { project: Project }) {
  return (
    <main
      className="container-page pt-[26px] lg:pt-(--top)"
      style={{ "--top": px(46) } as CSSProperties}
    >
      <ProjectHero project={project} />
      <Brief project={project} />
      <System project={project} />
      <Slides project={project} />
      <div className="mt-10 lg:mt-(--gap)" style={{ "--gap": px(78) } as CSSProperties}>
        <Note colour="beige" angle={1.5} size={24}>
          Art directed by me, built with AI <Sparkle />
        </Note>
      </div>
      <NextProject project={project} />
    </main>
  );
}
