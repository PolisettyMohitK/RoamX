"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { Wordmark } from "@/components/brand/Logo";
import { scrollToTarget } from "@/components/SmoothScroll";
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
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);

      // Slideshow: each photo drifts in slowly, then the next one crossfades over it.
      const slides = q("[data-slide]");
      const HOLD = 5.5;
      const FADE = 1.8;
      let current = 0;
      const drift = (el: Element) => gsap.fromTo(el, { scale: 1.12 }, { scale: 1, duration: HOLD + FADE * 2, ease: "none" });
      const advance = contextSafe!(() => {
        const prev = slides[current];
        current = (current + 1) % slides.length;
        const next = slides[current];
        gsap.set(next, { zIndex: 2, opacity: 0 });
        gsap.set(prev, { zIndex: 1 });
        drift(next);
        gsap.to(next, { opacity: 1, duration: FADE, ease: "sine.inOut", onComplete: () => gsap.set(prev, { opacity: 0 }) });
        gsap.delayedCall(HOLD, advance);
      });
      drift(slides[0]);
      gsap.delayedCall(HOLD, advance);

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
        {/* holiday slideshow, softly blurred so the copy stays readable */}
        <div data-photo className="absolute inset-0">
          <div className="absolute -inset-4 blur-[3px]">
            {hero.slides.map((s, i) => (
              <div key={s.src} data-slide className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                <Image src={s.src} alt={s.alt} fill preload={i === 0} quality={88} sizes="(min-width: 1280px) 3840px, (orientation: portrait) 150vh, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-navy-950/45" />

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
          <div data-form className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#join"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#join");
              }}
              className="bg-gold flex h-13 items-center rounded-full px-8 text-base font-semibold text-navy-900 transition hover:brightness-105"
            >
              {hero.cta}
            </a>
            <a
              href="#packages"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#packages");
              }}
              className="flex h-13 items-center rounded-full border border-ivory-50/40 px-8 text-base font-semibold text-ivory-50 transition hover:border-ivory-50"
            >
              Explore packages
            </a>
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
