// =========================================================
// ChromaGrid — vanilla + GSAP port of the React Bits component.
// The grid stays grayscale; a cursor-following radial mask reveals
// full color around the pointer. Cards are clickable (data-url).
// Falls back to full-color (no spotlight) if GSAP is missing or
// the user prefers reduced motion.
// =========================================================
(function () {
  "use strict";

  var grids = Array.prototype.slice.call(document.querySelectorAll(".chroma-grid"));
  if (!grids.length) return;

  var hasGsap = typeof window.gsap !== "undefined";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Wire click-through on cards regardless of animation support.
  grids.forEach(function (root) {
    root.querySelectorAll(".chroma-card").forEach(function (card) {
      var url = card.getAttribute("data-url");
      if (url) {
        card.addEventListener("click", function () {
          window.open(url, "_blank", "noopener,noreferrer");
        });
      }
    });
  });

  if (!hasGsap || reduced) {
    // CSS already reveals full color via the reduced-motion rules.
    return;
  }

  grids.forEach(function (root) {
    var fade = root.querySelector(".chroma-fade");
    var damping = parseFloat(root.getAttribute("data-damping")) || 0.45;
    var fadeOut = parseFloat(root.getAttribute("data-fadeout")) || 0.6;
    var ease = root.getAttribute("data-ease") || "power3.out";

    var setX = gsap.quickSetter(root, "--x", "px");
    var setY = gsap.quickSetter(root, "--y", "px");
    var pos = { x: 0, y: 0 };

    var rect = root.getBoundingClientRect();
    pos.x = rect.width / 2;
    pos.y = rect.height / 2;
    setX(pos.x);
    setY(pos.y);

    function moveTo(x, y) {
      gsap.to(pos, {
        x: x,
        y: y,
        duration: damping,
        ease: ease,
        overwrite: true,
        onUpdate: function () { setX(pos.x); setY(pos.y); }
      });
    }

    root.addEventListener("pointermove", function (e) {
      var r = root.getBoundingClientRect();
      moveTo(e.clientX - r.left, e.clientY - r.top);
      if (fade) gsap.to(fade, { opacity: 0, duration: 0.25, overwrite: true });
    });

    root.addEventListener("pointerleave", function () {
      if (fade) gsap.to(fade, { opacity: 1, duration: fadeOut, overwrite: true });
    });

    // Per-card spotlight position for the colored glow.
    root.querySelectorAll(".chroma-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var cr = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", (e.clientX - cr.left) + "px");
        card.style.setProperty("--mouse-y", (e.clientY - cr.top) + "px");
      });
    });
  });
})();
