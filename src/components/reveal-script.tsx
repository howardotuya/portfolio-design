// Fallback for the `reveal` utility in browsers without scroll-driven
// animations: hide .reveal elements until they enter the viewport. Inline so it
// runs before first paint and costs no client component.
const script = `(() => {
  if (CSS.supports("animation-timeline: view()")) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.classList.add("reveal-js");
  addEventListener("DOMContentLoaded", () => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -10% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  });
})();`;

export function RevealScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
