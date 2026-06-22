// =========================================================
// Theme toggle — robot button switches dark / light mode,
// remembers the choice, and plays a short synthesized click
// sound (Web Audio, no asset needed).
// =========================================================
(function () {
  "use strict";

  var root = document.documentElement;
  var btn = document.getElementById("themeToggle");
  var KEY = "pv-theme";

  function apply(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
  }

  // Initial: saved choice, else follow the OS preference, else dark.
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var initial = saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  apply(initial);

  // --- click sound -------------------------------------------------
  var audioCtx = null;
  function blip(rising) {
    try {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();

      var t = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(rising ? 420 : 680, t);
      osc.frequency.exponentialRampToValueAtTime(rising ? 880 : 300, t + 0.13);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    } catch (e) { /* audio not available — ignore */ }
  }

  // --- toggle ------------------------------------------------------
  if (btn) {
    btn.addEventListener("click", function () {
      var toLight = root.getAttribute("data-theme") !== "light";
      apply(toLight ? "light" : "dark");
      try { localStorage.setItem(KEY, toLight ? "light" : "dark"); } catch (e) {}
      btn.setAttribute("aria-pressed", String(toLight));
      blip(toLight); // rising tone for light, falling for dark

      // little spin reaction
      btn.classList.remove("spin");
      void btn.offsetWidth;
      btn.classList.add("spin");
    });
  }
})();
