"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { problem, problemHighlights } from "@/lib/content";

export default function ProblemLine() {
  const root = useRef<HTMLElement>(null);
  const words = problem.split(" ");

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} data-pin className="relative h-[220svh] bg-ivory-50">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <AmbientBackground />
        <p className="relative mx-auto max-w-[1180px] px-5 font-display text-[clamp(34px,5.6vw,84px)] font-semibold leading-[1.06] tracking-[-0.03em] text-navy-800 sm:px-10">
          {words.map((w, i) => (
            <span key={i} data-word className={problemHighlights.includes(w) ? "text-gold italic" : undefined}>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
