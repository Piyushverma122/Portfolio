// =========================================================
// Piyush Verma — Portfolio scripts
//   1) Scroll-reveal panels
//   2) Build a GitHub-style activity graph (last 12 months)
// Respects prefers-reduced-motion.
// =========================================================
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Scroll reveal ---------- */
  var targets = document.querySelectorAll("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2. Activity graph ---------- */
  var mount = document.getElementById("activity");
  if (!mount) return;

  var WEEKS = 53;
  var DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

  // Month labels across the top, aligned to the first week of each month.
  var now = new Date();
  var start = new Date(now);
  start.setDate(start.getDate() - (WEEKS - 1) * 7 - now.getDay());

  var monthsRow = document.createElement("div");
  monthsRow.className = "activity__months";
  monthsRow.style.gridTemplateColumns = "repeat(" + WEEKS + ", 13px)";
  var lastMonth = -1;
  for (var w = 0; w < WEEKS; w++) {
    var d = new Date(start);
    d.setDate(d.getDate() + w * 7);
    var span = document.createElement("span");
    span.style.gridColumn = (w + 1) + " / span 4";
    if (d.getMonth() !== lastMonth && d.getDate() <= 7) {
      span.textContent = d.toLocaleString("en", { month: "short" });
      lastMonth = d.getMonth();
    }
    monthsRow.appendChild(span);
  }

  var body = document.createElement("div");
  body.className = "activity__body";

  var days = document.createElement("div");
  days.className = "activity__days";
  DAY_LABELS.forEach(function (lbl) {
    var s = document.createElement("span");
    s.textContent = lbl;
    days.appendChild(s);
  });

  var grid = document.createElement("div");
  grid.className = "activity__grid";

  var cells = [];
  // Deterministic-ish pseudo-random pattern with denser recent activity.
  for (var i = 0; i < WEEKS * 7; i++) {
    var cell = document.createElement("div");
    cell.className = "cell";
    var week = Math.floor(i / 7);
    var recency = week / WEEKS;                 // 0 (old) .. 1 (recent)
    var roll = Math.random();
    var active = roll < 0.30 + recency * 0.42;  // recent weeks fill more
    if (active) {
      var lvl = Math.min(4, 1 + Math.floor(Math.random() * (1 + recency * 3.5)));
      cell.classList.add("l" + lvl);
    }
    grid.appendChild(cell);
    cells.push(cell);
  }

  body.appendChild(days);
  body.appendChild(grid);
  mount.appendChild(monthsRow);
  mount.appendChild(body);

  // Fetch real GitHub contribution details and populate the graph
  fetch("https://github-contributions-api.jogruber.de/v4/Piyushverma122")
    .then(function (res) {
      if (!res.ok) throw new Error("GitHub contributions fetch failed");
      return res.json();
    })
    .then(function (data) {
      if (!data || !data.contributions || !data.contributions.length) return;

      // Determine default year to show (2026 if available, otherwise fallback)
      var defaultYear = "2026";
      var totalObj = data.total || {};
      var hasDefaultYear = totalObj[defaultYear] !== undefined;

      // 1. Initial Populate
      if (hasDefaultYear) {
        var defaultFiltered = data.contributions.filter(function (day) {
          return day.date.startsWith(defaultYear);
        });
        renderYearGraph(defaultFiltered, defaultYear);
      } else {
        renderTrailingGraph(data.contributions);
      }

      // 2. Add Year Selectors
      var yearsDiv = document.getElementById("activityYears");
      var years = Object.keys(totalObj).sort(function (a, b) {
        return b - a;
      });

      if (yearsDiv && years.length) {
        yearsDiv.innerHTML = "";

        // Add "Last Year" selector
        var lastYearBtn = document.createElement("button");
        lastYearBtn.className = "activity__year-btn" + (!hasDefaultYear ? " active" : "");
        lastYearBtn.type = "button";
        lastYearBtn.textContent = "Last Year";
        lastYearBtn.addEventListener("click", function () {
          setActiveBtn(this);
          renderTrailingGraph(data.contributions);
        });
        yearsDiv.appendChild(lastYearBtn);

        // Add specific year selectors (only show year text like GitHub profile)
        years.forEach(function (yr) {
          var btn = document.createElement("button");
          btn.className = "activity__year-btn" + (hasDefaultYear && yr === defaultYear ? " active" : "");
          btn.type = "button";
          btn.textContent = yr;
          btn.addEventListener("click", function () {
            setActiveBtn(this);
            var filtered = data.contributions.filter(function (day) {
              return day.date.startsWith(yr);
            });
            renderYearGraph(filtered, yr);
          });
          yearsDiv.appendChild(btn);
        });

        function setActiveBtn(activeBtn) {
          var buttons = yearsDiv.querySelectorAll(".activity__year-btn");
          buttons.forEach(function (b) { b.classList.remove("active"); });
          activeBtn.classList.add("active");
        }
      }

      function renderTrailingGraph(allContributions) {
        grid.innerHTML = "";
        cells = [];
        
        // Redraw months row for last 53 weeks
        monthsRow.innerHTML = "";
        monthsRow.style.gridTemplateColumns = "repeat(" + WEEKS + ", 13px)";
        var lastMonth = -1;
        for (var w = 0; w < WEEKS; w++) {
          var d = new Date(start);
          d.setDate(d.getDate() + w * 7);
          var span = document.createElement("span");
          span.style.gridColumn = (w + 1) + " / span 4";
          if (d.getMonth() !== lastMonth && d.getDate() <= 7) {
            span.textContent = d.toLocaleString("en", { month: "short" });
            lastMonth = d.getMonth();
          }
          monthsRow.appendChild(span);
        }

        var trailingData = allContributions.slice(-WEEKS * 7);
        
        // Calculate and display total contributions
        var totalCount = trailingData.reduce(function (sum, item) {
          return sum + item.count;
        }, 0);
        var countEl = document.getElementById("githubCount");
        if (countEl) {
          countEl.textContent = totalCount.toLocaleString() + " contributions in the last year";
        }

        trailingData.forEach(function (item) {
          var cell = document.createElement("div");
          cell.className = "cell";
          if (item.level > 0) {
            cell.classList.add("l" + item.level);
          }
          cell.title = item.count + " contributions on " + new Date(item.date).toLocaleDateString("en-US", {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          grid.appendChild(cell);
          cells.push(cell);
        });
      }

      function renderYearGraph(yearDays, yrStr) {
        if (!yearDays || !yearDays.length) return;
        grid.innerHTML = "";
        cells = [];

        // Display contributions count for selected year
        var countEl = document.getElementById("githubCount");
        if (countEl && totalObj[yrStr] !== undefined) {
          countEl.textContent = totalObj[yrStr].toLocaleString() + " contributions in " + yrStr;
        }

        // 1. Padding start based on first day of year's weekday (Sunday=0, Monday=1, etc.)
        var firstDay = new Date(yearDays[0].date);
        var paddingStart = firstDay.getDay();

        for (var p = 0; p < paddingStart; p++) {
          var emptyCell = document.createElement("div");
          emptyCell.className = "cell";
          grid.appendChild(emptyCell);
        }

        // 2. Add actual year contribution cells
        yearDays.forEach(function (day) {
          var cell = document.createElement("div");
          cell.className = "cell";
          if (day.level > 0) {
            cell.classList.add("l" + day.level);
          }
          cell.title = day.count + " contributions on " + new Date(day.date).toLocaleDateString("en-US", {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          grid.appendChild(cell);
          cells.push(cell);
        });

        // 3. Padding end to complete the final week row column grid
        var totalRendered = paddingStart + yearDays.length;
        var paddingEnd = (7 - (totalRendered % 7)) % 7;
        for (var p = 0; p < paddingEnd; p++) {
          var emptyCell = document.createElement("div");
          emptyCell.className = "cell";
          grid.appendChild(emptyCell);
        }

        // 4. Regenerate month labels to match this year's calendar alignment
        monthsRow.innerHTML = "";
        var totalWeeks = Math.ceil(totalRendered / 7);
        monthsRow.style.gridTemplateColumns = "repeat(" + totalWeeks + ", 13px)";

        var lastMonth = -1;
        for (var w = 0; w < totalWeeks; w++) {
          var weekStartDate = new Date(firstDay);
          weekStartDate.setDate(firstDay.getDate() - paddingStart + w * 7);

          var span = document.createElement("span");
          span.style.gridColumn = (w + 1) + " / span 4";
          if (weekStartDate.getMonth() !== lastMonth && weekStartDate.getDate() <= 7) {
            span.textContent = weekStartDate.toLocaleString("en", { month: "short" });
            lastMonth = weekStartDate.getMonth();
          }
          monthsRow.appendChild(span);
        }
      }
    })
    .catch(function (err) {
      console.warn("Using placeholder graph since real contributions could not be fetched:", err);
    });

  /* ---------- 3. Liquid Chrome Button Background (WebGL) ---------- */
  (function initLiquidChrome() {
    var canvas = document.querySelector(".otw__canvas");
    if (!canvas || reduced) return;

    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    // Vertex Shader Source
    var vsSource = [
      "attribute vec2 position;",
      "void main() {",
      "  gl_Position = vec4(position, 0.0, 1.0);",
      "}"
    ].join("\n");

    // Fragment Shader Source
    var fsSource = [
      "precision highp float;",
      "uniform float uTime;",
      "uniform vec2 uResolution;",
      "uniform vec3 uBaseColor;",
      "uniform float uAmplitude;",
      "uniform float uFrequency;",
      "void main() {",
      "  vec2 uv = gl_FragCoord.xy / uResolution.xy;",
      "  vec2 p = -1.0 + 2.0 * uv;",
      "  p.x *= uResolution.x / uResolution.y;",
      "  for (float i = 1.0; i < 6.0; i++) {",
      "    p.x += uAmplitude / i * sin(i * uFrequency * p.y + uTime * 0.8);",
      "    p.y += uAmplitude / i * cos(i * uFrequency * p.x + uTime * 0.8);",
      "  }",
      "  float dist = length(p);",
      "  float shine = sin(p.x * 2.0 - p.y * 2.0 + uTime) * 0.5 + 0.5;",
      "  vec3 col = uBaseColor + vec3(0.06 * sin(p.x * 3.0 + uTime));",
      "  col += vec3(0.1) / (1.0 + 40.0 * abs(p.y - p.x * 0.2));",
      "  col += vec3(shine * 0.14);",
      "  col *= 1.0 - 0.22 * dist;",
      "  gl_FragColor = vec4(col, 1.0);",
      "}"
    ].join("\n");

    // Compile helper
    function compileShader(source, type) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    var vs = compileShader(vsSource, gl.VERTEX_SHADER);
    var fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Uniform locations
    var uTimeLoc = gl.getUniformLocation(program, "uTime");
    var uResolutionLoc = gl.getUniformLocation(program, "uResolution");
    var uBaseColorLoc = gl.getUniformLocation(program, "uBaseColor");
    var uAmplitudeLoc = gl.getUniformLocation(program, "uAmplitude");
    var uFrequencyLoc = gl.getUniformLocation(program, "uFrequency");

    // Full screen triangle geometry
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    var positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Initial properties (baseColor matches the chrome-button exact parameters: [0.039, 0.039, 0.039])
    var baseColor = [0.0392, 0.0392, 0.0392];
    var speed = 2.0;
    var amplitude = 0.1;
    var frequency = 3.0;

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var width = Math.floor(canvas.clientWidth * dpr);
      var height = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    window.addEventListener("resize", resize);
    resize();

    function render(time) {
      resize();
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform1f(uTimeLoc, time * 0.001 * speed);
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      gl.uniform3fv(uBaseColorLoc, baseColor);
      gl.uniform1f(uAmplitudeLoc, amplitude);
      gl.uniform1f(uFrequencyLoc, frequency);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  })();
})();
