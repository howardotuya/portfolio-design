import { getImageProps } from "next/image";
import { imageUrl } from "@/lib/image-loader";
import type { ImageName } from "@/lib/images.gen";

type PictureProps = {
  name: ImageName;
  alt: string;
  /** Rendered size in CSS pixels; also reserves space so nothing shifts. */
  width: number;
  height: number;
  /** For fluid images; without it the srcset is 1x/2x. */
  sizes?: string;
  /**
   * The hero photo: eager with fetchpriority=high. Deliberately not a
   * <link rel=preload>, which would fetch the WebP while <picture> picks AVIF.
   */
  priority?: boolean;
  loading?: "eager" | "lazy";
  className?: string;
};

// Several requested widths can map to the same file once the source runs out
// of pixels; keep each file once, with its real width.
function dedupe(srcSet: string | undefined) {
  if (!srcSet) return srcSet;
  const seen = new Map<string, string>();
  for (const entry of srcSet.split(", ")) {
    const [url = "", descriptor = ""] = entry.split(" ");
    if (!seen.has(url)) seen.set(url, descriptor);
  }
  return [...seen].map(([url, descriptor]) => `${url} ${descriptor}`).join(", ");
}

/** next/image with an AVIF source and a WebP fallback. */
export function Picture({ name, className, priority, loading, ...rest }: PictureProps) {
  const common = { src: name, loading: priority ? ("eager" as const) : loading, ...rest };
  const avif = getImageProps({
    ...common,
    loader: ({ src, width }) => imageUrl(src, width, "avif"),
  }).props;
  const { srcSet, ...img } = getImageProps(common).props;

  return (
    <picture>
      <source type="image/avif" srcSet={dedupe(avif.srcSet)} sizes={avif.sizes} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in props */}
      <img
        {...img}
        srcSet={dedupe(srcSet)}
        fetchPriority={priority ? "high" : undefined}
        className={className}
      />
    </picture>
  );
}
