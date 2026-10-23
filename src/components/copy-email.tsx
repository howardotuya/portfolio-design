"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Sparkle } from "./icons";

/**
 * A mailto: link that also copies the address, then shows a small handwritten
 * "Copied ✦". The mail client still opens as normal.
 */
export function CopyEmail({
  email,
  className,
  style,
  children,
}: {
  email: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  return (
    <span className="relative inline-block">
      <a
        href={`mailto:${email}`}
        className={className}
        style={style}
        onClick={() => {
          navigator.clipboard?.writeText(email).then(
            () => {
              setCopied(true);
              clearTimeout(timer.current);
              timer.current = setTimeout(() => setCopied(false), 2200);
            },
            () => {},
          );
        }}
      >
        {children}
      </a>
      <span
        role="status"
        className="pointer-events-none absolute top-full left-1/2 mt-3 -translate-x-1/2 whitespace-nowrap"
      >
        {copied && (
          <span className="inline-flex tilt items-center gap-[0.3em] bg-yellow px-3 py-1 font-hand text-lg text-ink shadow-paper [--tilt:-3deg] motion-safe:animate-[drop-in_420ms_var(--ease-out-expo)_backwards]">
            Copied <Sparkle />
          </span>
        )}
      </span>
    </span>
  );
}
