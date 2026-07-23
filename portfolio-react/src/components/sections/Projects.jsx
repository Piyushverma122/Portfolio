import { memo } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";
import "./Projects.css";

const GH = "https://github.com/Piyushverma122";

const PROJECTS = [
  {
    name: "Harihar Paathshaala",
    year: "2024 — 2025",
    tags: ["Flutter", "Flask", "MySQL"],
    desc: "Plantation & student-participation portal for the Govt. of Chhattisgarh.",
    bullets: [
      "Each government-school student is given a plant to grow and track.",
      "Students and teachers upload tree photos for transparency and participation.",
    ],
    img: "/assets/Hariharpathsala.png",
    featured: true,
  },
  {
    name: "Green Paalna",
    year: "2025",
    tags: ["Flutter", "Geo-tag", "MySQL"],
    desc: "Plantation monitoring linked to childbirth, for the Govt. of Chhattisgarh.",
    bullets: [
      "New mothers receive 5 saplings with geo-tagged verification and certificates.",
      "3-month monitoring via alerts and photo uploads by mothers & health workers.",
    ],
    img: "/assets/Greenpalna.jpeg",
    featured: true,
  },
  {
    name: "Har Ghar Munga",
    year: "2025",
    tags: ["Flutter", "Flask", "MySQL"],
    desc: "Nutritional & environmental drive distributing Moringa saplings.",
    bullets: [
      "Reached 10,000+ families and Anganwadi centers across the state.",
      "Aimed at reducing anemia & malnutrition while supporting sustainability.",
    ],
    img: "/assets/Hargahrmunga.png",
  },
  {
    name: "Radar Detector",
    year: "2024",
    tags: ["Arduino", "C++", "Sensors"],
    desc: "An Arduino radar system that detects objects and measures distance.",
    bullets: ["Integrated radar sensors for real-time object detection.", "Applied to automation and safety use cases."],
    img: "/assets/Rader.png",
  },
  {
    name: "SkyTM",
    year: "2025",
    tags: ["React", "Node.js", "SQL"],
    desc: "A digital-wallet system for fast, secure money transactions.",
    bullets: ["Handles transfers with a clean, responsive interface."],
    img: "/assets/SKytm.png",
  },
];

function Projects() {
  const ref = useScrollReveal();
  return (
    <section className="panel proj-theme" id="projects" aria-label="Projects" data-reveal ref={ref}>
      <div className="proj2-head">
        <p className="sec-label">MY PROJECTS</p>
        <a className="proj2-more" href={GH} target="_blank" rel="noopener noreferrer">
          view more projects →
        </a>
      </div>

      <div className="proj2-grid">
        {PROJECTS.map((p) => (
          <a
            className={`proj2${p.featured ? " proj2--featured" : ""}`}
            href={GH}
            key={p.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="proj2__media">
              <img src={p.img} alt={p.name} loading="lazy" decoding="async" />
              <span className="proj2__year">{p.year}</span>
            </div>
            <div className="proj2__body">
              <h3 className="proj2__name">
                {p.name} <span className="proj2__arrow">↗</span>
              </h3>
              <div className="proj2__tags">
                {p.tags.map((t) => (
                  <span className="chip2" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <p className="proj2__desc">{p.desc}</p>
              <ul className="proj2__bullets">
                {p.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default memo(Projects);
