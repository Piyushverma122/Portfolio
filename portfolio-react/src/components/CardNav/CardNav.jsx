import { memo, useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const ArrowIcon = () => (
  <svg
    className="nav-card-link-icon"
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M7 17L17 7M17 7H8M17 7V16" />
  </svg>
);

const NAV_CARDS = [
  {
    label: "Navigate",
    bg: "#1B1722",
    links: [
      { label: "Projects", href: "#projects", ariaLabel: "Go to Projects" },
      { label: "Experience", href: "#experience", ariaLabel: "Go to Experience" },
      { label: "Skills", href: "#skills", ariaLabel: "Go to Skills" },
    ],
  },
  {
    label: "Featured Work",
    bg: "#221b2a",
    links: [
      { label: "Harihar Paathshaala", href: "#projects", ariaLabel: "Harihar Paathshaala" },
      { label: "Green Paalna", href: "#projects", ariaLabel: "Green Paalna" },
      { label: "Har Ghar Munga", href: "#projects", ariaLabel: "Har Ghar Munga" },
    ],
  },
  {
    label: "Connect",
    bg: "#2F293A",
    links: [
      { label: "Email", href: "mailto:rajruchi2013@gmail.com", ariaLabel: "Email Piyush" },
      { label: "GitHub", href: "https://github.com/Piyushverma122", external: true, ariaLabel: "GitHub" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/piyush-verma-855400311/", external: true, ariaLabel: "LinkedIn" },
    ],
  },
];

const EASE = "power3.out";

function CardNav() {
  const navRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateHeight = useCallback(() => {
    const navEl = navRef.current;
    const content = contentRef.current;
    if (!navEl || !content) return 260;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const prev = {
        v: content.style.visibility,
        p: content.style.pointerEvents,
        pos: content.style.position,
        h: content.style.height,
      };
      content.style.visibility = "visible";
      content.style.pointerEvents = "auto";
      content.style.position = "static";
      content.style.height = "auto";
      void content.offsetHeight;
      const total = 48 + content.scrollHeight + 16;
      content.style.visibility = prev.v;
      content.style.pointerEvents = prev.p;
      content.style.position = prev.pos;
      content.style.height = prev.h;
      return total;
    }
    return 260;
  }, []);

  const createTimeline = useCallback(() => {
    const navEl = navRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!navEl || reduced) return null;
    gsap.set(navEl, { height: 48, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.4, ease: EASE });
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease: EASE, stagger: 0.08 }, "-=0.1");
    return tl;
  }, [calculateHeight]);

  // Build / rebuild the timeline.
  useEffect(() => {
    tlRef.current = createTimeline();
    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, [createTimeline]);

  // Rebuild on resize.
  useEffect(() => {
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!tlRef.current) {
          if (isExpanded && navRef.current) navRef.current.style.height = `${calculateHeight()}px`;
          return;
        }
        tlRef.current.kill();
        tlRef.current = createTimeline();
        if (isExpanded && tlRef.current) tlRef.current.progress(1);
      }, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [isExpanded, calculateHeight, createTimeline]);

  const open = useCallback(() => {
    setIsExpanded(true);
    const tl = tlRef.current;
    if (tl) {
      tl.play(0);
    } else if (navRef.current) {
      navRef.current.style.overflow = "hidden";
      navRef.current.style.height = `${calculateHeight()}px`;
    }
  }, [calculateHeight]);

  const close = useCallback(() => {
    const tl = tlRef.current;
    if (tl) {
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    } else {
      if (navRef.current) navRef.current.style.height = "48px";
      setIsExpanded(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (!isExpanded) open();
    else close();
  }, [isExpanded, open, close]);

  const onHamburgerKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  let cardIndex = 0;

  return (
    <div className="card-nav-container">
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""}`}
        style={{ backgroundColor: "#14141a" }}
      >
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isExpanded ? "open" : ""}`}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: "#f4f4f2" }}
            onClick={toggle}
            onKeyDown={onHamburgerKey}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>
          <div className="logo-container">
            <a href="#top" className="logo-word" aria-label="Home">
              PIYUSH&nbsp;VERMA
            </a>
          </div>
          <a
            className="card-nav-cta-button"
            href="https://drive.google.com/file/d/1hNzTaz5Vd_vHeZI0MRxZd1ruhw2KL4iG/view?usp=sharing"
            target="_blank"
            rel="noopener"
            style={{ backgroundColor: "#e3b341", color: "#1a1305" }}
          >
            Resume
          </a>
        </div>

        <div className="card-nav-content" ref={contentRef} aria-hidden={!isExpanded}>
          {NAV_CARDS.map((card) => {
            const idx = cardIndex;
            cardIndex += 1;
            return (
              <div
                key={card.label}
                className="nav-card"
                ref={(el) => {
                  if (el) cardsRef.current[idx] = el;
                }}
                style={{ backgroundColor: card.bg, color: "#fff" }}
              >
                <div className="nav-card-label">{card.label}</div>
                <div className="nav-card-links">
                  {card.links.map((lnk) => (
                    <a
                      key={lnk.label}
                      className="nav-card-link"
                      href={lnk.href}
                      aria-label={lnk.ariaLabel}
                      target={lnk.external ? "_blank" : undefined}
                      rel={lnk.external ? "noopener" : undefined}
                      onClick={() => {
                        if (isExpanded) close();
                      }}
                    >
                      <ArrowIcon />
                      {lnk.label}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// PERF: memoized so the nav never re-renders with the rest of the page.
export default memo(CardNav);
