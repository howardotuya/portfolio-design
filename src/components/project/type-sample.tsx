import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";

const dir = path.join(process.cwd(), "src", "type-samples");

/** Read an exported SVG at build time; drop its fixed size so CSS can scale it. */
function load(file: string) {
  const svg = readFileSync(path.join(dir, file), "utf8");
  const [, w = "0", h = "0"] = svg.match(/<svg width="([\d.]+)" height="([\d.]+)"/) ?? [];
  return {
    width: Number(w),
    height: Number(h),
    markup: svg
      .replace(/<svg width="[\d.]+" height="[\d.]+"/, '<svg aria-hidden="true" focusable="false"')
      .trim(),
  };
}

/**
 * The project's own typeface, as outlines exported from Figma: the site never
 * loads Plus Jakarta Sans, Dela Gothic One and the rest. Drawn at its Figma
 * size (× --px) on desktop and ¾ of it on the 390 frame, which also has its
 * own line breaks for Yolura (<slug>-mobile.svg).
 */
export function TypeSample({ project }: { project: Project }) {
  const desktop = load(`${project.slug}.svg`);
  const mobileFile = `${project.slug}-mobile.svg`;
  const mobile = existsSync(path.join(dir, mobileFile)) ? load(mobileFile) : null;

  const art = (svg: ReturnType<typeof load>, className: string, sm: string, lg: string) => (
    <span
      className={cn(
        "block w-(--w-sm) max-w-full lg:w-(--w-lg) [&>svg]:block [&>svg]:h-auto [&>svg]:w-full",
        className,
      )}
      style={
        {
          "--w-sm": `calc(${svg.width} * ${sm})`,
          "--w-lg": `calc(${svg.width} * ${lg})`,
        } as CSSProperties
      }
      dangerouslySetInnerHTML={{ __html: svg.markup }}
    />
  );

  return (
    <div role="img" aria-label={project.system.typeSample}>
      {mobile ? (
        <>
          {art(mobile, "lg:hidden", "1px", "1px")}
          {art(desktop, "max-lg:hidden", "var(--px)", "var(--px)")}
        </>
      ) : (
        art(desktop, "", "0.75px", "var(--px)")
      )}
    </div>
  );
}
