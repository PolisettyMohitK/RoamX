"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { Wordmark } from "@/components/brand/Logo";
import WaitlistForm from "@/components/ui/WaitlistForm";
import { hero } from "@/lib/content";

// One brushed-metal face, sized to the whole stage. Each door shows its half of it,
// so the closed doors read as a single seamless surface with the logo dead centre.
function DoorFace({ side }: { side: "left" | "right" }) {
  return (
    <div className={`metal-dark absolute inset-y-0 w-[200%] ${side === "left" ? "left-0" : "-left-full"}`}>
      <div className="absolute left-1/2 top-1/2 w-[min(80vw,1100px)] -translate-x-1/2 -translate-y-1/2">
        <Wordmark data-hero-logo={side === "left" ? "" : undefined} title={side === "left" ? "RoamX" : ""} className="w-full" />
      </div>
    </div>
  );
}

export default function DoorsHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
        })
        .to(q("[data-door-l]"), { xPercent: -100, duration: 0.55, ease: "power2.inOut" }, 0)
        .to(q("[data-door-r]"), { xPercent: 100, duration: 0.55, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-photo]"), { scale: 1.2 }, { scale: 1, duration: 0.8 }, 0)
        .from(q("[data-line]"), { yPercent: 110, duration: 0.18, stagger: 0.05, ease: "power3.out" }, 0.5)
        .from(q("[data-sub]"), { opacity: 0, y: 20, duration: 0.12 }, 0.64)
        .from(q("[data-form]"), { opacity: 0, y: 20, duration: 0.12 }, 0.7)
        .to({}, { duration: 0.18 });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" data-pin className="relative h-[250svh] bg-navy-950">
      <div className="sticky top-0 isolate h-svh overflow-hidden">
        <div data-photo className="absolute inset-0">
          <Image src={hero.image} alt="Aerial view of a city highway interchange at golden hour" fill preload sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-navy-950/65" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <h1 className="font-display text-[clamp(40px,6.6vw,104px)] font-bold leading-[0.98] tracking-[-0.035em] text-ivory-50">
            {hero.headline.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.08em]">
                <span data-line className={i === 1 ? "text-gold block italic" : "block"}>
                  {l}
                </span>
              </span>
            ))}
          </h1>
          <p data-sub className="mt-6 max-w-[34ch] text-[clamp(16px,1.5vw,20px)] leading-relaxed text-ivory-50/80">
            {hero.sub}
          </p>
          <div data-form className="mt-8 flex w-full justify-center">
            <WaitlistForm tone="dark" />
          </div>
        </div>

        <div data-door-l className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
          <DoorFace side="left" />
        </div>
        <div data-door-r className="absolute inset-y-0 left-1/2 w-1/2 overflow-hidden">
          <DoorFace side="right" />
        </div>
      </div>
    </section>
  );
}
