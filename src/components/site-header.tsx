import { nav, type NavId } from "@/content/site";
import { cn } from "@/lib/cn";
import { Heart, LogoMark, Star } from "./icons";
import { MobileMenu } from "./mobile-menu";
import { navHref, SocialDots } from "./social-dots";

/**
 * The white bar from the Figma "Nav". Plain <a> links on purpose: full page
 * loads are what cross-document View Transitions animate.
 */
export function SiteHeader({ active, onHome }: { active: NavId; onHome: boolean }) {
  return (
    <header className="sticky top-0 z-30 h-(--header-h) border-b border-line bg-white">
      <div className="flex h-full items-center px-5 lg:pr-[29px] lg:pl-[39px]">
        <a href={navHref("", onHome)} className="shrink-0 press rounded-full" aria-label="Home">
          <LogoMark className="size-7 lg:size-8" />
        </a>

        <nav aria-label="Main" className="ml-5 h-full max-lg:hidden">
          <ul className="flex h-full">
            {nav.map((item) => {
              const current = item.id === active;
              return (
                <li key={item.id} className="h-full">
                  <a
                    href={navHref(item.hash, onHome)}
                    aria-current={current ? (item.id === "home" ? "page" : "true") : undefined}
                    className={cn(
                      "flex h-full items-center gap-[0.5em] px-5 font-mono text-[13px] font-bold tracking-[0.08em] uppercase transition-colors duration-300",
                      current ? "bg-yellow surface-yellow" : "hover:bg-paper",
                    )}
                  >
                    {current && <Star className="-mt-px size-[0.95em]" />}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-4 max-lg:hidden">
          <SocialDots size="nav" />
          <a
            href={navHref("#contact", onHome)}
            className="flex press items-center gap-[0.6em] border-2 border-ink bg-white px-4 py-2 font-mono text-[13px] leading-[1.3] font-bold tracking-[0.08em] hover:bg-yellow"
          >
            <Heart className="size-[0.95em]" />
            CONTACT
          </a>
        </div>

        <MobileMenu active={active} onHome={onHome} />
      </div>
    </header>
  );
}
