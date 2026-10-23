import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { fs, px } from "./paper";

/** "© 2026 Howard Otuya · design.howardotuya.com", plus the developer-site link on home. */
export function SiteFooter({ developerLink }: { developerLink?: boolean }) {
  return (
    <footer
      className="container-page flex flex-col gap-2 pt-[60px] pb-12 font-mono text-foot font-bold text-soft uppercase lg:flex-row lg:items-center lg:justify-between lg:pt-(--top) lg:pb-(--bottom) lg:text-(length:--fs)"
      style={{ "--top": px(90), "--bottom": px(64), "--fs": fs(12, 10) } as CSSProperties}
    >
      <p>
        © {site.year} {site.name}
        <span aria-hidden>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
        <span className="sr-only">, </span>
        {site.host}
      </p>
      {developerLink && (
        <p>
          Developer site{" "}
          <a
            href={site.developerSite.url}
            className="underline-offset-4 hover:text-ink hover:underline"
          >
            ↗ {site.developerSite.label}
          </a>
        </p>
      )}
    </footer>
  );
}
