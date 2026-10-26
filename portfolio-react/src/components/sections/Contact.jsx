import { memo, useEffect, useRef, useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";
import SectionHead from "./SectionHead.jsx";
import "./Contact.css";

const EMAIL = "rajruchi2013@gmail.com";

const LINKS = [
  { label: "GitHub", href: "https://github.com/Piyushverma122" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/piyush-verma-855400311/" },
  { label: "Resume", href: "https://drive.google.com/file/d/1hNzTaz5Vd_vHeZI0MRxZd1ruhw2KL4iG/view?usp=sharing" },
];

function Contact() {
  const ref = useScrollReveal();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(0);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${EMAIL}`; // clipboard blocked → just open mail
    }
  };

  return (
    <section className="panel ed" id="contact" aria-label="Contact" data-reveal ref={ref}>
      <SectionHead num="04" label="Contact" />

      <h2 className="cta__title">
        Let&rsquo;s build something <em>worth shipping.</em>
      </h2>

      <p className="cta__status">
        <span className="cta__dot" aria-hidden="true" />
        Available for internships, freelance projects &amp; collaborations
      </p>

      <div className="cta__mail">
        <a className="cta__email" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        <button className="cta__copy" type="button" onClick={copyEmail} aria-live="polite">
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <footer className="cta__foot">
        <ul className="cta__links">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a className="link-arrow" href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <p className="meta cta__copyright">
          © 2026 Piyush Verma · Raipur, India
          <a className="link-arrow" href="#top">
            Back to top ↑
          </a>
        </p>
      </footer>
    </section>
  );
}

export default memo(Contact);
