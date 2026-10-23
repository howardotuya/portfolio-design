"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { CloseIcon } from "../icons";

export type LightboxSlide = {
  alt: string;
  caption: string;
  width: number;
  height: number;
  avif: string;
  webp: string;
  src: string;
  sizes: string;
};

/**
 * What to show while slide `index`'s full-size image loads: the grid tile's
 * copy, which the browser already has, unless the full size has arrived too.
 */
function placeholder(index: number) {
  const loaded = (img: HTMLImageElement | null) => Boolean(img?.complete && img.naturalWidth);
  if (loaded(document.querySelector(`[data-ahead="${index}"]`))) return undefined;
  const tile = document.querySelector<HTMLImageElement>(`#slides [data-slide="${index}"] img`);
  return loaded(tile) ? tile!.currentSrc : undefined;
}

/**
 * Full-screen slide viewer. The slide grid is server-rendered; any element with
 * data-slide="<index>" inside #slides opens this at that slide. A native modal
 * <dialog> traps focus and closes on Esc; arrows and swipes move between slides.
 */
export function Lightbox({ slides, title }: { slides: LightboxSlide[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const swipe = useRef<number | null>(null);
  const [opened, setOpened] = useState(false);
  const [index, setIndex] = useState(0);
  // Full-size slides fetched ahead: a hovered or focused tile's, then, once the
  // open slide is sharp, the rest of the deck one at a time, nearest first, so
  // the next slide is already there when → is pressed.
  const [ahead, setAhead] = useState<ReadonlySet<number>>(new Set());
  const count = slides.length;

  const fetchAhead = (i: number) => setAhead((a) => (a.has(i) ? a : new Set(a).add(i)));
  const fetchNearest = () => {
    if (!opened) return;
    for (let d = 1; d < count; d++) {
      for (const i of [(index + d) % count, (index - d + count) % count]) {
        if (!ahead.has(i)) return fetchAhead(i);
      }
    }
  };
  const go = (step: number) => setIndex((index + step + count) % count);

  useEffect(() => {
    const grid = document.getElementById("slides");
    const tile = (e: Event) => (e.target as Element).closest<HTMLElement>("[data-slide]");
    const onIntent = (e: Event) => {
      const button = tile(e);
      if (button) fetchAhead(Number(button.dataset.slide));
    };
    const onClick = (e: MouseEvent) => {
      const button = tile(e);
      if (!button) return;
      opener.current = button;
      setIndex(Number(button.dataset.slide));
      setOpened(true);
      dialog.current?.showModal();
      close.current?.focus();
    };
    grid?.addEventListener("pointerover", onIntent);
    grid?.addEventListener("focusin", onIntent);
    grid?.addEventListener("click", onClick);
    return () => {
      grid?.removeEventListener("pointerover", onIntent);
      grid?.removeEventListener("focusin", onIntent);
      grid?.removeEventListener("click", onClick);
    };
  }, []);

  const slide = slides[index]!;
  const number = (n: number) => String(n).padStart(2, "0");

  return (
    <dialog
      ref={dialog}
      aria-label={`${title} slides`}
      onClose={() => opener.current?.focus({ preventScroll: true })}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
        else return;
        e.preventDefault();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 text-white opacity-0 transition-[opacity,display,overlay] transition-discrete duration-300 ease-out-expo backdrop:bg-transparent open:opacity-100 motion-reduce:transition-none starting:open:opacity-0"
    >
      <div className="grid h-full grid-rows-[auto_1fr_auto] gap-3 p-4 lg:gap-5 lg:p-8">
        <div className="flex items-center justify-between font-mono text-xs font-bold tracking-[0.08em] uppercase lg:text-[13px]">
          <p aria-live="polite">
            {number(index + 1)} / {number(count)}
            <span className="sr-only">: {slide.caption}</span>
          </p>
          <form method="dialog">
            <button
              ref={close}
              type="submit"
              className="flex press items-center gap-[0.55em] border-2 border-white px-3 py-[7px] hover:bg-white hover:text-ink"
            >
              <CloseIcon className="size-[1.05em]" />
              CLOSE
            </button>
          </form>
        </div>

        <div
          className="relative min-h-0 touch-pan-y select-none"
          onPointerDown={(e) => {
            swipe.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (swipe.current === null) return;
            const dx = e.clientX - swipe.current;
            swipe.current = null;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          }}
          onPointerCancel={() => {
            swipe.current = null;
          }}
        >
          <div className="[container-type:size] absolute inset-0 grid place-items-center">
            {opened && <Slide key={index} slide={slide} index={index} onSharp={fetchNearest} />}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            className="grid size-11 press place-items-center border-2 border-white text-lg hover:bg-white hover:text-ink"
            aria-label="Previous slide"
          >
            <span aria-hidden className="font-mono">
              ←
            </span>
          </button>
          <p className="truncate text-center font-mono text-xs font-bold tracking-[0.08em] uppercase lg:text-[13px]">
            {number(index + 1)}&nbsp;&nbsp;{slide.caption}
          </p>
          <button
            type="button"
            onClick={() => go(1)}
            className="grid size-11 press place-items-center border-2 border-white text-lg hover:bg-white hover:text-ink"
            aria-label="Next slide"
          >
            <span aria-hidden className="font-mono">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Hidden images still load: this is the fetch-ahead queue. */}
      <div hidden>
        {[...ahead].map((i) => (
          <picture key={i}>
            <source type="image/avif" srcSet={slides[i]!.avif} sizes={slides[i]!.sizes} />
            <img
              src={slides[i]!.src}
              srcSet={slides[i]!.webp}
              sizes={slides[i]!.sizes}
              alt=""
              data-ahead={i}
              onLoad={fetchNearest}
              onError={fetchNearest}
            />
          </picture>
        ))}
      </div>
    </dialog>
  );
}

/**
 * One slide, fitted to the stage. If the full size isn't loaded yet, the grid
 * tile's copy shows straight away and the full size replaces it once decoded.
 */
function Slide({
  slide,
  index,
  onSharp,
}: {
  slide: LightboxSlide;
  index: number;
  onSharp: () => void;
}) {
  const [standIn] = useState(() => placeholder(index));
  const [sharp, setSharp] = useState(!standIn);

  return (
    <div
      className="relative"
      style={{
        width: `min(100cqw, 100cqh * ${slide.width / slide.height})`,
        aspectRatio: `${slide.width} / ${slide.height}`,
      }}
    >
      {standIn && !sharp && (
        // eslint-disable-next-line @next/next/no-img-element -- the tile's own file, already loaded
        <img src={standIn} alt="" draggable={false} className="absolute inset-0 size-full" />
      )}
      <picture>
        <source type="image/avif" srcSet={slide.avif} sizes={slide.sizes} />
        <img
          src={slide.src}
          srcSet={slide.webp}
          sizes={slide.sizes}
          alt={slide.alt}
          width={slide.width}
          height={slide.height}
          fetchPriority="high"
          draggable={false}
          onLoad={(e) => {
            e.currentTarget
              .decode()
              .catch(() => {})
              .finally(() => {
                setSharp(true);
                onSharp();
              });
          }}
          className={cn("absolute inset-0 size-full", !sharp && "opacity-0")}
        />
      </picture>
    </div>
  );
}
