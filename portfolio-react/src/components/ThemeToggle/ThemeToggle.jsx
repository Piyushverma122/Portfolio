import { useTheme } from "../../hooks/useTheme.js";

// Sun / moon icon toggle. Visibility of each icon is driven by
// html[data-theme] in globals.css (.theme-toggle .icon-sun / .icon-moon).
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      className="icon-btn theme-toggle"
      type="button"
      aria-label="Toggle theme"
      aria-pressed={theme === "light"}
      title="Toggle theme"
      onClick={toggle}
    >
      <svg className="icon-sun" viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3.25" fill="currentColor" />
        <g stroke="currentColor" strokeLinecap="round" strokeWidth="2">
          <path d="M12 2.5v2.5" />
          <path d="M12 19v2.5" />
          <path d="M4.22 4.22l1.77 1.77" />
          <path d="M18.01 18.01l1.77 1.77" />
          <path d="M2.5 12h2.5" />
          <path d="M19 12h2.5" />
          <path d="M4.22 19.78l1.77-1.77" />
          <path d="M18.01 5.99l1.77-1.77" />
        </g>
      </svg>
      <svg
        className="icon-moon"
        viewBox="0 0 24 24"
        width="19"
        height="19"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  );
}
