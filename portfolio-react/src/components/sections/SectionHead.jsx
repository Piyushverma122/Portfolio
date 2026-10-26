// Editorial section header shared by Experience / Toolkit / Projects / Contact:
// a numbered mono kicker ("01 — EXPERIENCE") over a Cormorant title, matching
// the hero's typography. `aside` renders on the right (e.g. a "view more" link).
export default function SectionHead({ num, label, title, aside }) {
  return (
    <header className="sec-head">
      <div>
        <p className="sec-head__kicker">
          <span className="sec-head__num">{num}</span>
          <span className="sec-head__dash" aria-hidden="true" />
          {label}
        </p>
        {title && <h2 className="sec-head__title">{title}</h2>}
      </div>
      {aside && <div className="sec-head__aside">{aside}</div>}
    </header>
  );
}
