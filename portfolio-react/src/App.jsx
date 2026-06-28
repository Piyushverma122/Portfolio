import { useEffect } from "react";
import Lenis from "lenis";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { useAuroraPause } from "./hooks/useAuroraPause.js";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  useAuroraPause(); // pause aurora animation while the tab is hidden

  // Lenis inertia smooth-scroll (ported from the inline script in index.html).
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      prevent: (node) => node.id === "activity" || node.classList.contains("activity"),
    });

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
