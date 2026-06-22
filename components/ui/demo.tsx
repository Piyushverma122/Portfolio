"use client";

import { VerifiedBadge } from "@/components/ui/verified-badge";

export function VerifiedBadgePreview() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-semibold text-foreground text-xl tracking-tight">
        Iconiq UI
      </span>
      <VerifiedBadge variant="shimmer" size={22} />
    </span>
  );
}

export default VerifiedBadgePreview;
