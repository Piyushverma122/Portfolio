import { memo } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";
import SectionHead from "./SectionHead.jsx";
import "./Experience.css";

const EXPERIENCE = [
  {
    title: "Platform Operations & Content Moderation Intern",
    period: "Jun 2026 — Present · 1 mo",
    company: "Emilo Ventures Private Limited · Full-time · Raipur, India · On-site",
    description:
      "Supporting platform operations and software development — building and monitoring features while keeping content quality, compliance, and a smooth user experience.",
    bullets: [
      "Develop and maintain web-application features.",
      "Moderate platform content against community guidelines and company policy.",
      "Review and report inappropriate or policy-violating content.",
      "Support bug fixing, testing, and performance optimization.",
      "Collaborate with developers and operations teams on functionality and UX.",
      "Maintain operational reports and follow SOPs for content review.",
    ],
    tags: ["Software Development", "Web Apps", "Content Moderation"],
    logo: "/assets/emilo.png",
    mono: "EV",
  },
  {
    title: "Project Developer — Center of Excellence (COE)",
    period: "Jul 2025 — Present · 1 yr",
    company: "COE, SSIPMT Raipur · Part-time · Raipur, India · On-site",
    description:
      "Project developer and student mentor building SaaS apps and software projects assigned by the college.",
    bullets: [
      "Build and maintain full-stack applications.",
      "Mentor juniors on web and mobile development.",
      "Coordinate project timelines and deliverables.",
    ],
    tags: ["Full-Stack", "Mentoring", "SaaS"],
    logo: null,
    mono: "CO",
  },
  {
    title: "Development Specialist",
    period: "Jul 2025 — Aug 2025 · 2 mos",
    company: "Skyvo Technologies · Internship · India · Hybrid",
    description:
      "Completed full-stack web-development training with version control in VS Code and Git.",
    bullets: [
      "Built and deployed web apps with Bootstrap, Angular, Node.js & MySQL.",
      "Focused on responsive UI, backend integration, and database management.",
    ],
    tags: ["Angular", "Node.js", "MySQL"],
    logo: null,
    mono: "SK",
  },
];

// "Jun 2026 — Present · 1 mo" → { range: "Jun 2026 — Present", length: "1 mo" }
function splitPeriod(period) {
  const [range, length] = period.split(" · ");
  return { range, length };
}

function Experience() {
  const ref = useScrollReveal();
  return (
    <section className="panel ed" id="experience" aria-label="Experience" data-reveal ref={ref}>
      <SectionHead
        num="01"
        label="Experience"
        title={
          <>
            Where I&rsquo;ve <em>worked</em>
          </>
        }
      />

      <ol className="xp">
        {EXPERIENCE.map((job) => {
          const { range, length } = splitPeriod(job.period);
          return (
            <li className="xp__row" key={job.title}>
              <div className="xp__when">
                <span className="xp__range">{range}</span>
                {length && <span className="meta">{length}</span>}
              </div>

              <div className="xp__body">
                <div className="xp__head">
                  <span className="xp__logo" aria-hidden="true">
                    {job.logo ? <img src={job.logo} alt="" loading="lazy" /> : job.mono}
                  </span>
                  <div>
                    <h3 className="xp__title">{job.title}</h3>
                    <p className="meta xp__company">{job.company}</p>
                  </div>
                </div>

                <p className="xp__desc">{job.description}</p>

                <ul className="dash-list xp__bullets">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <ul className="stack" aria-label="Focus areas">
                  {job.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default memo(Experience);
