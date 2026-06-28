import { memo } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";
import "./Skills.css";

const DV = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
const SI = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons";

const LANGUAGES = [
  { name: "C / C++", logo: `${DV}/cplusplus/cplusplus-original.svg`, border: "#00599c", bg: "rgba(0, 89, 156, 0.1)", text: "#5da5da" },
  { name: "Python", logo: `${DV}/python/python-original.svg`, border: "#3776ab", bg: "rgba(55, 118, 171, 0.1)", text: "#4b8bbe" },
  { name: "Java", logo: `${DV}/java/java-original.svg`, border: "#f89820", bg: "rgba(248, 152, 32, 0.1)", text: "#f89820" },
  { name: "SQL", logo: `${DV}/postgresql/postgresql-original.svg`, border: "#336791", bg: "rgba(51, 103, 145, 0.1)", text: "#336791" },
  { name: "React", logo: `${DV}/react/react-original.svg`, border: "#61dafb", bg: "rgba(97, 218, 251, 0.1)", text: "#61dafb" },
  { name: "Flutter", logo: `${DV}/flutter/flutter-original.svg`, border: "#02569b", bg: "rgba(2, 86, 155, 0.1)", text: "#45d1fd" },
  { name: "Angular", logo: `${DV}/angularjs/angularjs-original.svg`, border: "#dd0031", bg: "rgba(221, 0, 49, 0.1)", text: "#dd0031" },
];

const TOOLS = [
  { name: "Git / GitHub", logo: `${DV}/github/github-original.svg`, invert: true, white: true },
  { name: "Node.js", logo: `${DV}/nodejs/nodejs-original.svg`, border: "#68a063", bg: "rgba(104, 160, 99, 0.1)", text: "#68a063" },
  { name: "Flask", logo: `${DV}/flask/flask-original.svg`, invert: true, white: true },
  { name: "Android Studio", logo: `${DV}/android/android-original.svg`, border: "#3ddc84", bg: "rgba(61, 220, 132, 0.1)", text: "#3ddc84" },
  { name: "Expo Go", logo: `${SI}/expo.svg`, invert: true, white: true },
  { name: "VS Code", logo: `${DV}/vscode/vscode-original.svg`, border: "#007acc", bg: "rgba(0, 122, 204, 0.1)", text: "#007acc" },
  { name: "Canva", logo: `${SI}/canva.svg`, border: "#00c4cc", bg: "rgba(0, 196, 204, 0.1)", text: "#00c4cc" },
];

const CORE = [
  { name: "DSA", border: "#a855f7", bg: "rgba(168, 85, 247, 0.1)", text: "#a855f7", path: "M12 2v8M12 10l-4 4M12 10l4 4M8 14H4v4h4v-4zM20 14h-4v4h4v-4zM14 2h-4v4h4V2z" },
  {
    name: "Operating Systems",
    border: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.1)",
    text: "#3b82f6",
    raw: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <path d="m6 8 3 3-3 3M12 13h4" />
      </>
    ),
  },
  {
    name: "Computer Networks",
    border: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    text: "#10b981",
    raw: (
      <>
        <rect x="16" y="16" width="6" height="6" rx="1" />
        <rect x="2" y="16" width="6" height="6" rx="1" />
        <rect x="9" y="2" width="6" height="6" rx="1" />
        <path d="M12 8v8M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      </>
    ),
  },
  { name: "System Architecture", border: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", text: "#f59e0b", path: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
];

function skillStyle(s) {
  if (s.white) {
    return {
      "--hover-border": "var(--skill-white-hover)",
      "--hover-bg": "var(--skill-white-hover-bg)",
      "--hover-text": "var(--skill-white-hover)",
    };
  }
  return { "--hover-border": s.border, "--hover-bg": s.bg, "--hover-text": s.text };
}

function Skills() {
  const ref = useScrollReveal();
  return (
    <section className="panel skills-theme" id="skills" aria-label="Skills" data-reveal ref={ref}>
      <p className="sec-label">SKILLS</p>

      <div className="skill2-grid">
        <div className="skill2-cell">
          <h3 className="skill2-title">Languages</h3>
          <div className="tags">
            {LANGUAGES.map((s) => (
              <span className="skill-tag" key={s.name} style={skillStyle(s)}>
                <img className="skill-logo" src={s.logo} alt="" />
                {s.name}
              </span>
            ))}
          </div>
        </div>

        <div className="skill2-cell">
          <h3 className="skill2-title">Tools &amp; Tech</h3>
          <div className="tags">
            {TOOLS.map((s) => (
              <span className="skill-tag" key={s.name} style={skillStyle(s)}>
                <img className={`skill-logo${s.invert ? " logo-invert" : ""}`} src={s.logo} alt="" />
                {s.name}
              </span>
            ))}
          </div>
        </div>

        <div className="skill2-cell">
          <h3 className="skill2-title">Core CS</h3>
          <div className="tags">
            {CORE.map((s) => (
              <span className="skill-tag" key={s.name} style={skillStyle(s)}>
                <svg className="skill-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  {s.raw ? s.raw : <path d={s.path} />}
                </svg>
                {s.name}
              </span>
            ))}
          </div>
        </div>

        <div className="skill2-cell skill2-cell--edu">
          <h3 className="skill2-title">Education</h3>
          <p className="edu2-line">
            <strong>B.Tech, Computer Science</strong>
          </p>
          <p className="edu2-sub">SSIET, Raipur · Sep 2023 — Aug 2027</p>
          <p className="edu2-line">
            <strong>Class XII — Science · 67%</strong>
          </p>
          <p className="edu2-sub">Gurukul Higher Secondary · 2023</p>
        </div>
      </div>
    </section>
  );
}

export default memo(Skills);
