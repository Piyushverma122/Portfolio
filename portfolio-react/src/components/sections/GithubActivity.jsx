import { useEffect, useMemo, useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";

const WEEKS = 53;
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const USER = "Piyushverma122";
const DEFAULT_YEAR = "2026";

function dayTitle(count, date) {
  return `${count} contributions on ${new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })}`;
}

// Month labels for the trailing 53-week window (ends today).
function trailingMonths() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - (WEEKS - 1) * 7 - now.getDay());
  const months = [];
  let lastMonth = -1;
  for (let w = 0; w < WEEKS; w++) {
    const d = new Date(start);
    d.setDate(d.getDate() + w * 7);
    let label = "";
    if (d.getMonth() !== lastMonth && d.getDate() <= 7) {
      label = d.toLocaleString("en", { month: "short" });
      lastMonth = d.getMonth();
    }
    months.push({ col: w + 1, label });
  }
  return months;
}

function buildTrailing(contributions) {
  const trailing = contributions.slice(-WEEKS * 7);
  const total = trailing.reduce((sum, item) => sum + item.count, 0);
  const cells = trailing.map((item) => ({
    level: item.level,
    title: dayTitle(item.count, item.date),
  }));
  return {
    cells,
    months: trailingMonths(),
    columns: WEEKS,
    countText: `${total.toLocaleString()} contributions in the last year`,
  };
}

function buildYear(yearDays, yr, totalObj) {
  if (!yearDays.length) return null;
  const firstDay = new Date(yearDays[0].date);
  const paddingStart = firstDay.getDay();
  const cells = [];
  for (let p = 0; p < paddingStart; p++) cells.push({ empty: true });
  yearDays.forEach((day) => {
    cells.push({ level: day.level, title: dayTitle(day.count, day.date) });
  });
  const totalRendered = paddingStart + yearDays.length;
  const paddingEnd = (7 - (totalRendered % 7)) % 7;
  for (let p = 0; p < paddingEnd; p++) cells.push({ empty: true });

  const totalWeeks = Math.ceil(totalRendered / 7);
  const months = [];
  let lastMonth = -1;
  for (let w = 0; w < totalWeeks; w++) {
    const weekStart = new Date(firstDay);
    weekStart.setDate(firstDay.getDate() - paddingStart + w * 7);
    let label = "";
    if (weekStart.getMonth() !== lastMonth && weekStart.getDate() <= 7) {
      label = weekStart.toLocaleString("en", { month: "short" });
      lastMonth = weekStart.getMonth();
    }
    months.push({ col: w + 1, label });
  }

  const count = totalObj[yr] !== undefined ? totalObj[yr] : 0;
  return {
    cells,
    months,
    columns: totalWeeks,
    countText: `${count.toLocaleString()} contributions in ${yr}`,
  };
}

export default function GithubActivity() {
  const ref = useScrollReveal();
  const [data, setData] = useState(null); // { contributions, total }
  const [view, setView] = useState({ type: "trailing" });
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    fetch(`https://github-contributions-api.jogruber.de/v4/${USER}`)
      .then((res) => {
        if (!res.ok) throw new Error("GitHub contributions fetch failed");
        return res.json();
      })
      .then((json) => {
        if (cancelled || !json || !json.contributions || !json.contributions.length) {
          if (!cancelled) setStatus("error");
          return;
        }
        const total = json.total || {};
        setData({ contributions: json.contributions, total });
        setView(total[DEFAULT_YEAR] !== undefined ? { type: "year", year: DEFAULT_YEAR } : { type: "trailing" });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const years = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.total).sort((a, b) => b - a);
  }, [data]);

  const graph = useMemo(() => {
    if (!data) return null;
    if (view.type === "year") {
      const yearDays = data.contributions.filter((d) => d.date.startsWith(view.year));
      return buildYear(yearDays, view.year, data.total) || buildTrailing(data.contributions);
    }
    return buildTrailing(data.contributions);
  }, [data, view]);

  const countText =
    status === "loading"
      ? "Fetching contributions..."
      : status === "error"
      ? "Contributions unavailable right now"
      : graph?.countText || "";

  const hasDefaultYear = data ? data.total[DEFAULT_YEAR] !== undefined : false;

  return (
    <section className="panel github-widget" aria-label="Activity graph" data-reveal ref={ref}>
      <div className="github-widget__main">
        <div className="github-widget__header">
          <h3 className="github-widget__count">{countText}</h3>
          <a className="link-gold" href={`https://github.com/${USER}`} target="_blank" rel="noopener">
            view profile ↗
          </a>
        </div>

        <div className="activity" aria-hidden="true">
          {graph && (
            <>
              <div
                className="activity__months"
                style={{ gridTemplateColumns: `repeat(${graph.columns}, 13px)` }}
              >
                {graph.months.map((m, i) => (
                  <span key={i} style={{ gridColumn: `${m.col} / span 4` }}>
                    {m.label}
                  </span>
                ))}
              </div>
              <div className="activity__body">
                <div className="activity__days">
                  {DAY_LABELS.map((lbl, i) => (
                    <span key={i}>{lbl}</span>
                  ))}
                </div>
                <div className="activity__grid">
                  {graph.cells.map((c, i) => (
                    <div
                      key={i}
                      className={`cell${c.empty || !c.level ? "" : ` l${c.level}`}`}
                      title={c.title || undefined}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="github-widget__footer">
          <a
            className="github-widget__learn"
            href="https://docs.github.com/en/github/setting-up-and-managing-your-github-profile/managing-contribution-graphs-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
            target="_blank"
            rel="noopener"
          >
            Learn how we count contributions
          </a>
          <div className="github-widget__legend">
            <span>Less</span>
            <span className="legend-cell l0" />
            <span className="legend-cell l1" />
            <span className="legend-cell l2" />
            <span className="legend-cell l3" />
            <span className="legend-cell l4" />
            <span>More</span>
          </div>
        </div>
      </div>

      <div className="github-widget__sidebar">
        <div className="activity__years">
          {data && (
            <>
              <button
                className={`activity__year-btn${view.type === "trailing" ? " active" : ""}`}
                type="button"
                onClick={() => setView({ type: "trailing" })}
              >
                Last Year
              </button>
              {years.map((yr) => (
                <button
                  key={yr}
                  className={`activity__year-btn${
                    view.type === "year" && view.year === yr ? " active" : ""
                  }`}
                  type="button"
                  onClick={() => setView({ type: "year", year: yr })}
                >
                  {yr}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
