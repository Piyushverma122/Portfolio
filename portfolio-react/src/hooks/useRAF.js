import { useEffect, useRef } from "react";

/**
 * Runs `callback(deltaMs, timestamp)` inside a single requestAnimationFrame
 * loop, optionally capped to `fps`. The loop only runs while `active` is true,
 * and is always cancelled on unmount.
 *
 * WHY: a centralized, cancellable RAF loop avoids the two classic perf bugs —
 *   (1) never-cancelled loops (memory/CPU leaks), and
 *   (2) drawing faster than needed (uncapped 60fps on cheap effects).
 * Driving work through RAF (instead of setInterval) also stays in sync with the
 * compositor and pauses automatically in background tabs.
 */
export function useRAF(callback, { fps = 0, active = true } = {}) {
  const cbRef = useRef(callback);
  const frameRef = useRef(0);
  const lastRef = useRef(0);

  // Keep the latest callback without restarting the loop.
  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return undefined;

    const frameDuration = fps > 0 ? 1000 / fps : 0;
    lastRef.current = 0;

    const tick = (timestamp) => {
      frameRef.current = requestAnimationFrame(tick);
      if (!lastRef.current) lastRef.current = timestamp;
      const delta = timestamp - lastRef.current;
      // Skip frames that arrive sooner than the target cap.
      if (frameDuration && delta < frameDuration) return;
      lastRef.current = frameDuration ? timestamp - (delta % frameDuration) : timestamp;
      cbRef.current(delta, timestamp);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current); // cleanup → no leaks
  }, [fps, active]);
}

export default useRAF;
