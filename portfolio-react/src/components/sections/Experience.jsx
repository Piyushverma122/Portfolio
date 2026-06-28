import { memo } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";
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

function Experience() {
  const ref = useScrollReveal();
  return (
    <section className="panel exp-theme" id="experience" aria-label="Experience" data-reveal ref={ref}>
      <p className="sec-label">EXPERIENCE</p>

      <div className="exp2-list">
        {EXPERIENCE.map((job) => (
          <article className="exp2" key={job.title}>
            <div className="exp2__media" aria-hidden="true">
              {job.logo ? (
                <img src={job.logo} alt="" loading="lazy" />
              ) : (
                <span className="exp2__mono">{job.mono}</span>
              )}
            </div>

            <div className="exp2__body">
              <div className="exp2__top">
                <h3 className="exp2__title">{job.title}</h3>
                <span className="exp2__period">{job.period}</span>
              </div>
              <p className="exp2__company">{job.company}</p>
              <p className="exp2__desc">{job.description}</p>

              <ul className="exp2__bullets">
                {job.bullets.map((b, i) => (
                  <li key={i}>
                    <span className="exp2__arrow">›</span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="exp2__tags">
                {job.tags.map((t) => (
                  <span className="chip2" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default memo(Experience);
