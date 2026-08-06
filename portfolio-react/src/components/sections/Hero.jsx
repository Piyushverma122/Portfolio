import { useScrollReveal } from "../../hooks/useScrollReveal.js";
import DecryptedText from "../DecryptedText/DecryptedText.jsx";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import OpenToWorkButton from "./OpenToWorkButton.jsx";

const PARTICLES = [
  { top: "16%", right: "7%", delay: "0s" },
  { top: "72%", right: "13%", delay: ".8s" },
  { top: "34%", right: "32%", delay: "1.4s" },
  { top: "82%", right: "42%", delay: "2s" },
  { top: "10%", right: "46%", delay: "2.6s" },
  { top: "54%", right: "3%", delay: "3.2s" },
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/Piyushverma122",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/piyush-verma-855400311/",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:rajruchi2013@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Resume",
    href: "https://drive.google.com/file/d/1hNzTaz5Vd_vHeZI0MRxZd1ruhw2KL4iG/view?usp=sharing",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
  },
];

export default function Hero() {
  const ref = useScrollReveal();

  const onPfpError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "https://picsum.photos/seed/piyush-verma-developer-portrait/500/500";
  };

  return (
    <section className="panel hero" aria-label="Introduction" data-reveal ref={ref}>
      <div className="hero__banner">
        <div
          className="hero__banner-bg"
          style={{ backgroundImage: "url('/assets/Banner.jpeg')" }}
          aria-hidden="true"
        />
        <div className="hero__banner-glow" aria-hidden="true" />
        <div className="hero__quote">
          <span className="hero__quote-text">
            There&rsquo;s <em className="q-em">always</em> more to learn.
          </span>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="q-particle"
              style={{ top: p.top, right: p.right, animationDelay: p.delay }}
            />
          ))}
        </div>
      </div>

      <div className="hero__body">
        <div className="hero__head">
          <div className="hero__pfp">
            <img src="/assets/piyush.png" alt="Portrait of Piyush Verma" loading="eager" decoding="async" onError={onPfpError} />
          </div>

          <div className="hero__namewrap">
            <p className="kicker">
              <DecryptedText text="PORTFOLIO / 2026" delay={0} />
            </p>
            <h1 className="hero__name">
              <DecryptedText text="Piyush Verma" delay={120} />
              <span className="verified-badge" role="img" aria-label="Verified">
                <svg className="verified-badge__shape" viewBox="0 0 22 22">
                  <path
                    d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816z"
                    fill="currentColor"
                  />
                </svg>
                <span className="verified-badge__shimmer" />
                <svg
                  className="verified-badge__check"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.5"
                >
                  <polyline points="5 12.5 10 17.5 19 7.5" />
                </svg>
              </span>
            </h1>
            <p className="hero__role">
              <DecryptedText text="Full-stack developer • React • Flutter • Flask" delay={420} />
            </p>
            <p className="hero__mono">
              <DecryptedText text="Building digital experiences that matter." delay={700} />
            </p>
          </div>

          <div className="hero__actions-col">
            <div className="otw-row">
              <OpenToWorkButton />
              <ThemeToggle />
            </div>
            <div className="social-icons">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  className="icon-btn"
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noopener" : undefined}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      </section>
  );
}
