import { memo } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";
import "./Contact.css";

const LINKS = [
  { label: "Email", href: "mailto:rajruchi2013@gmail.com" },
  { label: "GitHub", href: "https://github.com/Piyushverma122", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/piyush-verma-855400311/", external: true },
  { label: "Resume", href: "https://drive.google.com/file/d/1hNzTaz5Vd_vHeZI0MRxZd1ruhw2KL4iG/view?usp=sharing", external: true },
];

function Contact() {
  const ref = useScrollReveal();
  return (
    <section className="panel contact-theme" id="contact" aria-label="Contact" data-reveal ref={ref}>
      <div
        className="contact2__bg"
        aria-hidden="true"
        style={{ backgroundImage: "url('/assets/Banner.webp')" }}
      />
      <div className="contact2__content">
        <p className="sec-label">CONTACT</p>
        <h2 className="contact2__title">Let&rsquo;s build something worth shipping.</h2>
        <p className="contact2__sub">Available for internships, freelance projects, and collaborations.</p>

        <div className="contact2__links">
          {LINKS.map((l) => (
            <a
              key={l.label}
              className="contact2__pill"
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
            >
              {l.label} <span>↗</span>
            </a>
          ))}
        </div>

        <p className="contact2__copy">© 2026 Piyush Verma</p>
      </div>
    </section>
  );
}

export default memo(Contact);
