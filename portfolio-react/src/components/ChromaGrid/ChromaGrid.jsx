import { memo, useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * ChromaGrid — cursor spotlight reveal.
 *
 * PERF:
 *  - Pointer listeners are registered `{ passive: true }` so they never block
 *    scrolling on the compositor thread.
 *  - An IntersectionObserver flips an `enabledRef` flag; while the grid is
 *    off-screen the pointer handlers early-return and no GSAP tweens run.
 *  - All listeners/observers are cleaned up on unmount (no leaks).
 *  - The component is memoized so it doesn't re-render with the parent.
 *
 * items: [{ image, title, subtitle, handle, borderColor, gradient, url }]
 */
function ChromaGrid({
  items = [],
  className = "",
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const enabledRef = useRef(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const setX = gsap.quickSetter(root, "--x", "px");
    const setY = gsap.quickSetter(root, "--y", "px");
    const pos = { x: 0, y: 0 };
    const rect = root.getBoundingClientRect();
    pos.x = rect.width / 2;
    pos.y = rect.height / 2;
    setX(pos.x);
    setY(pos.y);

    const moveTo = (x, y) => {
      gsap.to(pos, {
        x,
        y,
        duration: damping,
        ease,
        overwrite: true,
        onUpdate: () => {
          setX(pos.x);
          setY(pos.y);
        },
      });
    };

    const handleMove = (e) => {
      if (!enabledRef.current) return; // off-screen → do nothing
      const r = root.getBoundingClientRect();
      moveTo(e.clientX - r.left, e.clientY - r.top);
      if (fadeRef.current) gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    };
    const handleLeave = () => {
      if (fadeRef.current) gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true });
    };

    // CRITICAL: passive listeners keep scrolling smooth.
    root.addEventListener("pointermove", handleMove, { passive: true });
    root.addEventListener("pointerleave", handleLeave, { passive: true });

    // Pause work while the grid is scrolled out of view.
    let io;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(([entry]) => {
        enabledRef.current = entry.isIntersecting;
      });
      io.observe(root);
    }

    return () => {
      root.removeEventListener("pointermove", handleMove);
      root.removeEventListener("pointerleave", handleLeave);
      if (io) io.disconnect();
      gsap.killTweensOf(pos);
    };
  }, [damping, ease, fadeOut, items.length]);

  // Per-card glow position — passive, ref-based, no React state.
  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const handleCardClick = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={rootRef} className={`chroma-grid ${className}`.trim()} style={{ "--r": `${radius}px` }}>
      {items.map((c, i) => (
        <article
          key={`${c.title}-${i}`}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={{
            "--card-border": c.borderColor || "transparent",
            "--card-gradient": c.gradient,
            cursor: c.url ? "pointer" : "default",
          }}
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
}

// PERF: memo so the grid never re-renders unless its props change.
export default memo(ChromaGrid);
