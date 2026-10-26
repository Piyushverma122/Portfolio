import { memo } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";
import SectionHead from "./SectionHead.jsx";
import "./Projects.css";

const GH = "https://github.com/Piyushverma122";

const PROJECTS = [
  {
    name: "Harihar Paathshaala",
    client: "Govt. of Chhattisgarh",
    year: "2024 — 2025",
    tags: ["Flutter", "Flask", "MySQL"],
    desc: "Plantation & student-participation portal for the Govt. of Chhattisgarh.",
    bullets: [
      "Each government-school student is given a plant to grow and track.",
      "Students and teachers upload tree photos for transparency and participation.",
    ],
    img: "/assets/Hariharpathsala.webp",
  },
  {
    name: "Green Paalna",
    client: "Govt. of Chhattisgarh",
    year: "2025",
    tags: ["Flutter", "Geo-tag", "MySQL"],
    desc: "Plantation monitoring linked to childbirth, for the Govt. of Chhattisgarh.",
    bullets: [
      "New mothers receive 5 saplings with geo-tagged verification and certificates.",
      "3-month monitoring via alerts and photo uploads by mothers & health workers.",
    ],
    img: "/assets/Greenpalna.webp",
  },
  {
    name: "Har Ghar Munga",
    client: "Govt. of Chhattisgarh",
    year: "2025",
    tags: ["Flutter", "Flask", "MySQL"],
    desc: "Nutritional & environmental drive distributing Moringa saplings.",
    bullets: [
      "Reached 10,000+ families and Anganwadi centers across the state.",
      "Aimed at reducing anemia & malnutrition while supporting sustainability.",
    ],
    img: "/assets/Hargahrmunga.webp",
  },
  {
    name: "Radar Detector",
    client: "Personal project",
    year: "2024",
    tags: ["Arduino", "C++", "Sensors"],
    desc: "An Arduino radar system that detects objects and measures distance.",
    bullets: ["Integrated radar sensors for real-time object detection.", "Applied to automation and safety use cases."],
    img: "/assets/Rader.webp",
  },
  {
    name: "SkyTM",
    client: "Personal project",
    year: "2025",
    tags: ["React", "Node.js", "SQL"],
    desc: "A digital-wallet system for fast, secure money transactions.",
    bullets: ["Handles transfers with a clean, responsive interface."],
    img: "/assets/SKytm.webp",
  },
];

const slug = (name) => `proj-${name.toLowerCase().replace(/\s+/g, "-")}`;

function Projects() {
  const ref = useScrollReveal();
  return (
    <section className="panel ed" id="projects" aria-label="Projects" data-reveal ref={ref}>
      <SectionHead
        num="03"
        label="Projects"
        title={
          <>
            Things I&rsquo;ve <em>shipped</em>
          </>
        }
        aside={
          <a className="link-arrow" href={GH} target="_blank" rel="noopener noreferrer">
            more on GitHub ↗
          </a>
        }
      />

      <div className="cases">
        {PROJECTS.map((p, i) => (
          <article className="case" id={slug(p.name)} key={p.name}>
            <a
              className="case__media"
              href={GH}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
              aria-hidden="true"
            >
              <img src={p.img} alt="" loading="lazy" decoding="async" />
            </a>

            <div className="case__text">
              <span className="case__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="case__name">{p.name}</h3>
              <p className="meta case__meta">
                {p.client} · {p.year}
              </p>
              <p className="case__desc">{p.desc}</p>
              <ul className="dash-list">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <ul className="stack" aria-label="Tech stack">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <a className="link-arrow case__link" href={GH} target="_blank" rel="noopener noreferrer">
                View on GitHub ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default memo(Projects);
