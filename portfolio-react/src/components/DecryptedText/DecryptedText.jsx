import { memo, useEffect, useRef } from "react";
import { useInView } from "../../hooks/useInView.js";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

function esc(ch) {
  if (ch === "&") return "&amp;";
  if (ch === "<") return "&lt;";
  if (ch === ">") return "&gt;";
  if (ch === " ") return "&nbsp;";
  return ch;
}

// Next index to reveal, following the chosen direction.
function nextIndex(revealed, len, dir) {
  const size = revealed.size;
  let i;
  if (dir === "end") {
    for (i = len - 1; i >= 0; i--) if (!revealed.has(i)) return i;
  } else if (dir === "center") {
    const middle = Math.floor(len / 2);
    const offset = Math.floor(size / 2);
    const idx = size % 2 === 0 ? middle + offset : middle - offset - 1;
    if (idx >= 0 && idx < len && !revealed.has(idx)) return idx;
    for (i = 0; i < len; i++) if (!revealed.has(i)) return i;
  } else {
    for (i = 0; i < len; i++) if (!revealed.has(i)) return i;
  }
  return 0;
}

/**
 * DecryptedText — scramble→reveal effect.
 *
 * PERF: the animation writes directly to the DOM via a ref (liveRef.innerHTML)
 * and is driven by ONE requestAnimationFrame loop. There is ZERO setState
 * during the animation, so React never re-renders while it runs (the #1 cause
 * of scramble-text jank). The loop is gated by useInView so it only starts when
 * the text is on-screen, and is fully cancelled on unmount.
 */
function DecryptedText({
  text,
  delay = 0,
  speed = 40,
  maxIterations = 20,
  sequential = true,
  revealDirection = "center",
  className = "",
  as: Tag = "span",
}) {
  const [rootRef, isVisible] = useInView(0.2);
  const liveRef = useRef(null);

  useEffect(() => {
    const live = liveRef.current;
    if (!live) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len = text.length;
    const revealed = new Set();

    const paint = () => {
      let html = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        if (ch === " ") {
          html += "&nbsp;";
          continue;
        }
        if (revealed.has(i)) html += "<span>" + esc(ch) + "</span>";
        else html += '<span class="encrypted">' + esc(CHARS[(Math.random() * CHARS.length) | 0]) + "</span>";
      }
      live.innerHTML = html;
    };

    const finish = () => {
      for (let i = 0; i < len; i++) revealed.add(i);
      paint();
      const root = rootRef.current;
      if (root) root.classList.add("is-done");
    };

    // Reduced motion or not yet visible → show final text, run nothing.
    if (reduced) {
      finish();
      return undefined;
    }
    if (!isVisible) {
      // Pre-paint a fully scrambled frame so there's no flash of real text.
      paint();
      return undefined;
    }

    let rafId = 0;
    let startTime = 0;
    let acc = 0;
    let last = 0;
    let iteration = 0;
    let started = false;

    paint(); // initial scrambled frame

    const tick = (ts) => {
      rafId = requestAnimationFrame(tick);
      if (!startTime) startTime = ts;
      if (ts - startTime < delay) return; // honor the stagger delay
      if (!started) {
        started = true;
        last = ts;
        return;
      }
      acc += ts - last;
      last = ts;
      // Advance only when `speed` ms have elapsed (frame-rate independent).
      if (acc < speed) {
        if (!sequential) paint(); // non-sequential keeps shimmering each frame
        return;
      }
      acc = 0;

      if (sequential) {
        if (revealed.size < len) {
          revealed.add(nextIndex(revealed, len, revealDirection));
          paint();
        } else {
          cancelAnimationFrame(rafId);
          finish();
        }
      } else {
        iteration += 1;
        paint();
        if (iteration >= maxIterations) {
          cancelAnimationFrame(rafId);
          finish();
        }
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId); // cleanup → no leaked loops
  }, [isVisible, text, delay, speed, maxIterations, sequential, revealDirection, rootRef]);

  return (
    <Tag ref={rootRef} className={`decrypt ${className}`.trim()} aria-label={text}>
      <span className="decrypt__ghost" aria-hidden="true">
        {text}
      </span>
      {/* live layer is mutated directly via ref — never by React state */}
      <span className="decrypt__live" aria-hidden="true" ref={liveRef} />
    </Tag>
  );
}

// PERF: memo prevents re-render unless props actually change.
export default memo(DecryptedText);
