import { memo } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";
import SectionHead from "./SectionHead.jsx";
import "./Skills.css";

const DV = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
const SI = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons";

const LANGUAGES = [
  { name: "C / C++", logo: `${DV}/cplusplus/cplusplus-original.svg` },
  { name: "Python", logo: `${DV}/python/python-original.svg` },
  { name: "Java", logo: `${DV}/java/java-original.svg` },
  { name: "SQL", logo: `${DV}/postgresql/postgresql-original.svg` },
  { name: "React", logo: `${DV}/react/react-original.svg` },
  { name: "Flutter", logo: `${DV}/flutter/flutter-original.svg` },
  { name: "Angular", logo: `${DV}/angularjs/angularjs-original.svg` },
];

const TOOLS = [
  { name: "Git / GitHub", logo: `${DV}/github/github-original.svg`, invert: true },
  { name: "Node.js", logo: `${DV}/nodejs/nodejs-original.svg` },
  { name: "Flask", logo: `${DV}/flask/flask-original.svg`, invert: true },
  { name: "Android Studio", logo: `${DV}/android/android-original.svg` },
  { name: "Expo Go", logo: `${SI}/expo.svg`, invert: true },
  { name: "VS Code", logo: `${DV}/vscode/vscode-original.svg` },
  { name: "Canva", logo: `${SI}/canva.svg`, invert: true },
];

const CORE = [
  { name: "DSA", path: "M12 2v8M12 10l-4 4M12 10l4 4M8 14H4v4h4v-4zM20 14h-4v4h4v-4zM14 2h-4v4h4V2z" },
  {
    name: "Operating Systems",
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
    raw: (
      <>
        <rect x="16" y="16" width="6" height="6" rx="1" />
        <rect x="2" y="16" width="6" height="6" rx="1" />
        <rect x="9" y="2" width="6" height="6" rx="1" />
        <path d="M12 8v8M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      </>
    ),
  },
  { name: "System Architecture", path: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
];

const GROUPS = [
  { label: "Languages", items: LANGUAGES },
  { label: "Tools & Tech", items: TOOLS },
  { label: "Core CS", items: CORE },
];

const EDUCATION = [
  { title: "B.Tech, Computer Science", place: "SSIET, Raipur", when: "Sep 2023 — Aug 2027" },
  { title: "Class XII — Science · 67%", place: "Gurukul Higher Secondary", when: "2023" },
];

function SkillIcon({ s }) {
  if (s.logo) {
    return (
      <img
        className={`kit__icon${s.invert ? " logo-invert" : ""}`}
        src={s.logo}
        alt=""
        width="16"
        height="16"
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <svg
      className="kit__icon kit__icon--svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {s.raw ? s.raw : <path d={s.path} />}
    </svg>
  );
}

function Skills() {
  const ref = useScrollReveal();
  return (
    <section className="panel ed" id="skills" aria-label="Skills" data-reveal ref={ref}>
      <SectionHead
        num="02"
        label="Toolkit"
        title={
          <>
            Tools I <em>reach for</em>
          </>
        }
      />

      <dl className="kit">
        {GROUPS.map((g) => (
          <div className="kit__row" key={g.label}>
            <dt className="kit__label">{g.label}</dt>
            <dd className="kit__items">
              <ul>
                {g.items.map((s) => (
                  <li className="kit__item" key={s.name}>
                    <SkillIcon s={s} />
                    {s.name}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}

        <div className="kit__row">
          <dt className="kit__label">Education</dt>
          <dd className="kit__edu">
            {EDUCATION.map((e) => (
              <div key={e.title}>
                <p className="kit__edu-title">{e.title}</p>
                <p className="meta kit__edu-meta">
                  {e.place} · {e.when}
                </p>
              </div>
            ))}
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default memo(Skills);
