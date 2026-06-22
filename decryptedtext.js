// =========================================================
// DecryptedText — vanilla port of the React Bits component.
// Defaults match the requested config:
//   animateOn="view", sequential=true, revealDirection="center",
//   speed=40, maxIterations=20
// Each .decrypt element scrambles, then reveals its real text once,
// starting automatically when it enters the viewport (on load for
// the hero). Layout never shifts (an invisible ghost reserves width).
// =========================================================
(function () {
  "use strict";

  var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = Array.prototype.slice.call(document.querySelectorAll(".decrypt"));
  if (!nodes.length) return;

  function esc(ch) {
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    if (ch === " ") return "&nbsp;";
    return ch;
  }

  // Build markup: a visible "live" layer over an invisible "ghost" that
  // holds the final text so the box never resizes during scrambling.
  function scaffold(el, text) {
    el.setAttribute("aria-label", text);

    var ghost = document.createElement("span");
    ghost.className = "decrypt__ghost";
    ghost.setAttribute("aria-hidden", "true");
    ghost.textContent = text;

    var live = document.createElement("span");
    live.className = "decrypt__live";
    live.setAttribute("aria-hidden", "true");

    el.textContent = "";
    el.appendChild(ghost);
    el.appendChild(live);
    return live;
  }

  function render(live, text, revealed) {
    var html = "";
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === " ") { html += "&nbsp;"; continue; }
      if (revealed.has(i)) {
        html += "<span>" + esc(ch) + "</span>";
      } else {
        var r = CHARS[Math.floor(Math.random() * CHARS.length)];
        html += '<span class="encrypted">' + esc(r) + "</span>";
      }
    }
    live.innerHTML = html;
  }

  // Next index to reveal, following the chosen direction.
  function nextIndex(revealed, len, dir) {
    var size = revealed.size, i;
    if (dir === "end") {
      for (i = len - 1; i >= 0; i--) if (!revealed.has(i)) return i;
    } else if (dir === "center") {
      var middle = Math.floor(len / 2);
      var offset = Math.floor(size / 2);
      var idx = size % 2 === 0 ? middle + offset : middle - offset - 1;
      if (idx >= 0 && idx < len && !revealed.has(idx)) return idx;
      for (i = 0; i < len; i++) if (!revealed.has(i)) return i;
    } else { // start
      for (i = 0; i < len; i++) if (!revealed.has(i)) return i;
    }
    return 0;
  }

  function run(el) {
    var text = el.getAttribute("data-text") || el.textContent || "";
    var sequential = (el.getAttribute("data-sequential") || "true") !== "false";
    var dir = el.getAttribute("data-reveal-direction") || "center";
    var speed = parseInt(el.getAttribute("data-speed"), 10) || 40;
    var maxIter = parseInt(el.getAttribute("data-max-iterations"), 10) || 20;
    var delay = parseInt(el.getAttribute("data-delay"), 10) || 0;

    if (reduced) { el.textContent = text; return; }

    var live = scaffold(el, text);
    var revealed = new Set();
    render(live, text, revealed); // start fully scrambled (no flash of real text)

    setTimeout(function () {
      var iteration = 0;
      var timer = setInterval(function () {
        if (sequential) {
          if (revealed.size < text.length) {
            revealed.add(nextIndex(revealed, text.length, dir));
            render(live, text, revealed);
          } else {
            clearInterval(timer);
            el.classList.add("is-done");
          }
        } else {
          render(live, text, revealed);
          iteration++;
          if (iteration >= maxIter) {
            clearInterval(timer);
            for (var i = 0; i < text.length; i++) revealed.add(i);
            render(live, text, revealed);
            el.classList.add("is-done");
          }
        }
      }, speed);
    }, delay);
  }

  // animateOn="view": start once when the element scrolls into view
  // (immediately for the hero, which is above the fold on load).
  if (!("IntersectionObserver" in window)) {
    nodes.forEach(run);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        run(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  nodes.forEach(function (n) { io.observe(n); });
})();
