import { useEffect } from "react";

// Pauses the aurora animation when the browser tab is hidden — saves CPU/GPU
// and battery while the page isn't visible. WHY a class instead of inline
// animationPlayState: the animation lives on a ::after pseudo-element, which
// can't be reached via element.style, so we toggle a class the CSS targets.
export function useAuroraPause() {
  useEffect(() => {
    const handleVisibility = () => {
      const layers = document.querySelectorAll(".animate-aurora");
      layers.forEach((el) => el.classList.toggle("aurora-paused", document.hidden));
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
}

export default useAuroraPause;
