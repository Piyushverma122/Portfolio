// =========================================================
// CardNav — vanilla + GSAP port of the React Bits component.
// Mirrors the original: collapsed 48px bar, hamburger toggle,
// GSAP height-expand, and cards staggering up. Falls back to a
// CSS-only toggle if GSAP is unavailable or motion is reduced.
// =========================================================
(function () {
  "use strict";

  var nav = document.getElementById("cardNav");
  var hamburger = document.getElementById("cardNavHamburger");
  if (!nav || !hamburger) return;

  var content = nav.querySelector(".card-nav-content");
  var cards = Array.prototype.slice.call(nav.querySelectorAll(".nav-card"));
  var links = Array.prototype.slice.call(nav.querySelectorAll(".nav-card-link"));

  var EASE = "power3.out";
  var hasGsap = typeof window.gsap !== "undefined";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animate = hasGsap && !reduced;

  var isExpanded = false;
  var tl = null;

  // Measure the natural expanded height (mobile = stacked content, desktop = 260).
  function calculateHeight() {
    var isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile && content) {
      var prev = {
        v: content.style.visibility,
        p: content.style.pointerEvents,
        pos: content.style.position,
        h: content.style.height
      };
      content.style.visibility = "visible";
      content.style.pointerEvents = "auto";
      content.style.position = "static";
      content.style.height = "auto";
      void content.offsetHeight; // force reflow
      var total = 48 + content.scrollHeight + 16;
      content.style.visibility = prev.v;
      content.style.pointerEvents = prev.p;
      content.style.position = prev.pos;
      content.style.height = prev.h;
      return total;
    }
    return 260;
  }

  function createTimeline() {
    if (!animate) return null;
    gsap.set(nav, { height: 48, overflow: "hidden" });
    gsap.set(cards, { y: 50, opacity: 0 });
    var t = gsap.timeline({ paused: true });
    t.to(nav, { height: calculateHeight, duration: 0.4, ease: EASE });
    t.to(cards, { y: 0, opacity: 1, duration: 0.4, ease: EASE, stagger: 0.08 }, "-=0.1");
    return t;
  }

  tl = createTimeline();

  function setOpenA11y(open) {
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    hamburger.setAttribute("aria-expanded", String(open));
    if (content) content.setAttribute("aria-hidden", String(!open));
  }

  function open() {
    isExpanded = true;
    nav.classList.add("open");
    setOpenA11y(true);
    if (tl) {
      tl.play(0);
    } else {
      // CSS / reduced-motion fallback
      nav.style.overflow = "hidden";
      nav.style.height = calculateHeight() + "px";
    }
  }

  function close() {
    setOpenA11y(false);
    if (tl) {
      tl.eventCallback("onReverseComplete", function () {
        nav.classList.remove("open");
        isExpanded = false;
      });
      tl.reverse();
    } else {
      nav.style.height = "48px";
      nav.classList.remove("open");
      isExpanded = false;
    }
  }

  function toggle() {
    if (!isExpanded) open();
    else close();
  }

  hamburger.addEventListener("click", toggle);
  hamburger.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });

  // Collapse after navigating to an in-page anchor.
  links.forEach(function (a) {
    a.addEventListener("click", function () {
      if (isExpanded) close();
    });
  });

  // Rebuild the timeline on resize (height depends on viewport).
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!tl) {
        if (isExpanded) nav.style.height = calculateHeight() + "px";
        return;
      }
      if (isExpanded) {
        gsap.set(nav, { height: calculateHeight() });
        tl.kill();
        tl = createTimeline();
        if (tl) tl.progress(1);
      } else {
        tl.kill();
        tl = createTimeline();
      }
    }, 150);
  });
})();
