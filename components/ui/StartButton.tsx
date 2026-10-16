"use client";

import { cta, site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { openContact } from "@/components/ui/ContactPill";
import { scrollToTarget } from "@/components/SmoothScroll";

/**
 * The page's one action: buy RoamX. Opens the payment page once `site.payUrl` is set;
 * until then it opens the "Talk to us" form (or, if the form is switched off, the offer section).
 */
export default function StartButton({
  label = cta.start,
  className,
  onBefore,
}: {
  label?: string;
  className?: string;
  onBefore?: () => void;
}) {
  const pay = site.payUrl;
  return (
    <a
      href={pay || "#join"}
      {...(pay ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => {
        onBefore?.();
        if (pay) return;
        e.preventDefault();
        if (site.contactForm) openContact();
        else scrollToTarget("#join");
      }}
      className={cn(
        "bg-gold flex h-13 items-center justify-center rounded-full px-8 text-base font-semibold text-navy-900 transition hover:brightness-105",
        className,
      )}
    >
      {label}
    </a>
  );
}
