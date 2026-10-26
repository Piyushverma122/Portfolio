import { useEffect } from "react";
import Lenis from "lenis";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { useAuroraPause } from "./hooks/useAuroraPause.js";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  useAuroraPause(); // pause aurora animation while the tab is hidden

  // Lenis inertia smooth-scroll & scroll to top on page reload.
  useEffect(() => {
    // Force browser to start at top (Hero section) on page load/refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    // WHY no `prevent`: excluding the activity graph handed vertical wheel
    // events back to native scrolling mid-page, so the scroll feel jumped
    // there. Lenis already ignores horizontal deltas, so the graph's own
    // horizontal overflow still scrolls natively.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      prevent: (node) => node.id === "activity" || node.classList.contains("activity"),
    });

    lenis.scrollTo(0, { immediate: true });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      {/* One global aurora behind every section (fixed, non-interactive) */}
      <div className="global-aurora animate-aurora" aria-hidden="true" />
      <Navbar />
      <Home />
    </ThemeProvider>
  );
}
