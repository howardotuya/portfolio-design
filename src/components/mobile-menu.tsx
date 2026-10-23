"use client";

import { useRef, useState } from "react";
import { nav, site, type NavId } from "@/content/site";
import { CloseIcon, LogoMark, MenuIcon, Sparkle } from "./icons";
import { navHref, SocialDots } from "./social-dots";

const button =
  "press flex items-center gap-[0.55em] border-2 border-ink bg-yellow px-3 py-[7px] font-mono text-xs leading-[1.3] font-bold tracking-[0.08em] text-ink";

/**
 * Full-screen menu for small screens (Figma 9:119). A native modal <dialog>
 * gives the focus trap, inert page and Esc-to-close; CSS locks the scroll.
 */
export function MobileMenu({ active, onHome }: { active?: NavId; onHome: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    dialog.current?.showModal();
    close.current?.focus();
    setOpen(true);
  };

  // Links close the menu first, then navigate as normal.
  const hide = () => dialog.current?.close();

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={`${button} ml-auto surface-yellow lg:hidden`}
      >
        <MenuIcon className="size-[1.05em]" />
        MENU
      </button>

      <dialog
        ref={dialog}
        id="mobile-menu"
        aria-label="Menu"
        onClose={() => {
          setOpen(false);
          // `close` fires after a link's hash scroll; don't yank the page back up.
          trigger.current?.focus({ preventScroll: true });
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-ink p-0 text-white transition-[clip-path,display,overlay] transition-discrete duration-500 ease-out-expo [clip-path:inset(0_0_100%_0)] backdrop:bg-transparent open:[clip-path:inset(0)] motion-reduce:transition-none lg:hidden starting:open:[clip-path:inset(0_0_100%_0)]"
      >
        <div className="flex min-h-full flex-col px-5 pb-10">
          <div className="flex h-14 shrink-0 items-center">
            <a href={navHref("", onHome)} onClick={hide} aria-label="Home" className="press">
              <LogoMark className="size-7" />
            </a>
            <button
              ref={close}
              type="button"
              onClick={hide}
              className={`${button} ml-auto surface-yellow`}
            >
              <CloseIcon className="size-[1.05em]" />
              CLOSE
            </button>
          </div>

          <nav aria-label="Main" className="mt-[54px]">
            <ul className="grid gap-[21px]">
              {nav.map((item, i) => {
                const current = item.id === active;
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-5 motion-safe:animate-[fade-up_500ms_var(--ease-out-expo)_both]"
                    style={{ animationDelay: `${100 + i * 50}ms` }}
                  >
                    <a
                      href={navHref(item.hash, onHome)}
                      onClick={hide}
                      aria-current={current ? "true" : undefined}
                      className={`font-pixel text-[72px] leading-[0.9] uppercase transition-colors hover:text-yellow ${current ? "text-yellow" : ""}`}
                    >
                      {item.label}
                    </a>
                    {current && (
                      <span aria-hidden className="font-hand text-xl text-yellow">
                        ← you are here
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className="mt-[60px] border-t-[1.5px] border-white pt-[30px] motion-safe:animate-[fade-up_500ms_var(--ease-out-expo)_both]"
            style={{ animationDelay: "380ms" }}
          >
            <a
              href={`mailto:${site.email}`}
              className="font-mono text-[13px] font-bold tracking-[0.06em] uppercase underline-offset-4 hover:underline"
            >
              {site.email} ↗
            </a>
            <div className="mt-[31px]">
              <SocialDots size="menu" />
            </div>
            <p className="mt-11 flex items-center gap-[0.3em] font-hand text-xl text-mint">
              {site.status} <Sparkle />
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
