import { useEffect, useRef, useState } from "react";

// Triggers `isVisible` once the element enters the viewport, then stops
// observing — so off-screen elements never run animations (saves FPS).
// WHY: animating elements that aren't visible wastes main-thread time and
// causes scroll jank. This gates animation start on visibility.
export function useInView(threshold = 0.1, rootMargin = "0px 0px -8% 0px") {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Reduced motion or no IO support → show immediately, no observers.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // stop observing after first trigger
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect(); // cleanup → no leaks
  }, [threshold, rootMargin]);

  return [ref, isVisible];
}

export default useInView;
