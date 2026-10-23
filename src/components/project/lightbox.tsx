"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon } from "../icons";

export type LightboxSlide = {
  alt: string;
  caption: string;
  width: number;
  height: number;
  avif: string;
  webp: string;
  src: string;
};

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
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback((step: number) => setIndex((i) => (i + step + count) % count), [count]);

  useEffect(() => {
    const grid = document.getElementById("slides");
    const onClick = (e: MouseEvent) => {
      const button = (e.target as Element).closest<HTMLElement>("[data-slide]");
      if (!button) return;
      opener.current = button;
      setIndex(Number(button.dataset.slide));
      dialog.current?.showModal();
      close.current?.focus();
    };
    grid?.addEventListener("click", onClick);
    return () => grid?.removeEventListener("click", onClick);
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
          <div className="absolute inset-0 flex items-center justify-center">
            <picture key={index} className="contents">
              <source type="image/avif" srcSet={slide.avif} sizes="100vw" />
              <img
                src={slide.src}
                srcSet={slide.webp}
                sizes="100vw"
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                draggable={false}
                loading="lazy"
                className="slide-frame h-auto max-h-full w-auto max-w-full object-contain motion-safe:animate-[fade-up_350ms_var(--ease-out-expo)_both]"
              />
            </picture>
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
    </dialog>
  );
}
