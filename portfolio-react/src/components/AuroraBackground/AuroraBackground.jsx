import { memo } from "react";
import "./AuroraBackground.css";

/**
 * AuroraBackground — vanilla-CSS port of Aceternity UI's Aurora.
 * No Tailwind / no "use client" (Vite). The animated gradient sits at z-0
 * inside the wrapper; children render above it at z-1.
 *
 * props:
 *  - colorVariant: "gold" | "dark" | "blue"  (default "gold")
 *  - showRadialGradient: fade the aurora out toward the edges (default true)
 *  - className: extra classes for the wrapper
 */
function AuroraBackground({
  children,
  className = "",
  showRadialGradient = true,
  colorVariant = "gold",
  ...props
}) {
  return (
    <div className={`aurora-bg ${className}`.trim()} {...props}>
      <div className="aurora-bg__fx" aria-hidden="true">
        {/* WHY: keep the literal class "animate-aurora" so useAuroraPause can find it */}
        <div
          className={`aurora-bg__layer animate-aurora aurora-${colorVariant}${
            showRadialGradient ? " aurora-bg__layer--radial" : ""
          }`}
        />
      </div>
      <div className="aurora-bg__content">{children}</div>
    </div>
  );
}

export default memo(AuroraBackground);
