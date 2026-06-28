import { useEffect, useRef } from "react";

// Replaces the original [data-reveal] IntersectionObserver in script.js.
// Returns a ref to attach to the element you want revealed; it adds the
// "is-visible" class once the element scrolls into view (works with the
// existing CSS rule `[data-reveal].is-visible`).
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const { threshold = 0.08, rootMargin = "0px 0px -6% 0px" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
