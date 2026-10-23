import { socials } from "@/content/site";
import { cn } from "@/lib/cn";

const fill = { yellow: "bg-yellow", pink: "bg-pink", green: "bg-green" };

/** Where a nav item points: in-page on the home page, back to home elsewhere. */
export function navHref(hash: string, onHome: boolean) {
  if (!hash) return onHome ? "#top" : "/";
  return onHome ? hash : `/${hash}`;
}

/**
 * The three coloured dots. Decorative until they have accounts behind them
 * (content/site.ts); a dot with a url renders as a labelled link.
 */
export function SocialDots({ size }: { size: "nav" | "menu" }) {
  const dot = cn(
    "block rounded-full border-[1.5px] border-ink",
    size === "nav" ? "size-7" : "size-9",
  );
  return (
    <ul className={cn("flex", size === "nav" ? "gap-[10px]" : "gap-3")}>
      {socials.map((s) => (
        <li key={s.colour} aria-hidden={s.url ? undefined : true}>
          {s.url ? (
            <a
              href={s.url}
              aria-label={s.label}
              className={cn(dot, fill[s.colour], "press")}
              target="_blank"
              rel="noopener"
            />
          ) : (
            <span className={cn(dot, fill[s.colour])} />
          )}
        </li>
      ))}
    </ul>
  );
}
