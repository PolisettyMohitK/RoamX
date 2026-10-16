"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { Wordmark } from "@/components/brand/Logo";
import { scrollToTarget } from "@/components/SmoothScroll";
import StartButton from "@/components/ui/StartButton";
import { hero } from "@/lib/content";

const SIZES = "(min-width: 1280px) 3840px, (orientation: portrait) 150vh, 100vw";

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

      // Depth: the destination word drifts against the photo with the pointer (the photo and its cutout
      // stay locked together, so the landmark never ghosts).
      const words = q("[data-word]");
      gsap.set(words, { yPercent: -50 }); // centred on its line (GSAP owns the transform)
      const wx = gsap.quickTo(words, "x", { duration: 1.4, ease: "power3.out" });
      const wy = gsap.quickTo(words, "y", { duration: 1.4, ease: "power3.out" });
      const px = gsap.quickTo(q("[data-photo]"), "x", { duration: 1.6, ease: "power3.out" });
      const py = gsap.quickTo(q("[data-photo]"), "y", { duration: 1.6, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        wx(nx * -36);
        wy(ny * -22);
        px(nx * 12);
        py(ny * 8);
      };
      window.addEventListener("pointermove", move);

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
        })
        .to(q("[data-door-l]"), { xPercent: -100, duration: 0.55, ease: "power2.inOut" }, 0)
        .to(q("[data-door-r]"), { xPercent: 100, duration: 0.55, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-photo]"), { scale: 1.2 }, { scale: 1, duration: 0.8 }, 0)
        .fromTo(q("[data-word-wrap]"), { yPercent: 18, scale: 1.08 }, { yPercent: 0, scale: 1, duration: 0.8 }, 0)
        .from(q("[data-line]"), { yPercent: 110, duration: 0.18, stagger: 0.05, ease: "power3.out" }, 0.5)
        .from(q("[data-sub]"), { opacity: 0, y: 20, duration: 0.12 }, 0.64)
        .from(q("[data-form]"), { opacity: 0, y: 20, duration: 0.12 }, 0.7)
        .to({}, { duration: 0.18 });

      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" data-pin className="relative h-[250svh] bg-navy-950">
      <div className="sticky top-0 isolate h-svh overflow-hidden">
        {/* destination slideshow: photo, then the giant place name, then the landmark cut out in front of it */}
        <div data-photo className="absolute inset-0">
          {hero.slides.map((s, i) => (
            <div key={s.src} data-slide className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
              <Image src={s.src} alt={s.alt} fill preload={i === 0} quality={88} sizes={SIZES} className="object-cover" />
              <div data-word-wrap className="absolute inset-0">
                <p
                  data-word
                  aria-hidden
                  className="absolute inset-x-0 top-[var(--y)] text-center font-display font-extrabold uppercase leading-none tracking-[-0.045em] text-ivory-50/85 portrait:top-[var(--my)]"
                  style={
                    {
                      "--y": `${s.y * 100}%`,
                      "--my": `${s.my * 100}%`,
                      fontSize: `min(${(92 / (s.place.length * 0.74)).toFixed(2)}vw, 26svh)`,
                    } as React.CSSProperties
                  }
                >
                  {s.place}
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element -- local cutouts: a plain srcset keeps them pixel-aligned with the photo */}
              <img
                src={`/hero/${s.cutout}-2880.webp`}
                srcSet={`/hero/${s.cutout}-1600.webp 1600w, /hero/${s.cutout}-2880.webp 2880w`}
                sizes={SIZES}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-navy-950/35" />

        <div className="absolute inset-0 flex flex-col items-start justify-end px-5 [text-shadow:0_2px_24px_rgb(7_15_36/0.55)] pb-[clamp(40px,9svh,96px)] sm:px-10 lg:px-[max(40px,calc((100vw-1180px)/2))]">
          <h1 className="font-display text-[clamp(34px,5vw,76px)] font-bold leading-[1] tracking-[-0.035em] text-ivory-50">
            {hero.headline.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.08em]">
                <span data-line className={i === 1 ? "text-gold block" : "block"}>
                  {l}
                </span>
              </span>
            ))}
          </h1>
          <p data-sub className="mt-5 max-w-[44ch] text-[clamp(15px,1.3vw,19px)] leading-relaxed text-ivory-50/85">
            {hero.sub}
          </p>
          <div data-form className="mt-8 flex flex-wrap items-center gap-3">
            <StartButton />
            <a
              href="#how"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#how");
              }}
              className="flex h-13 items-center rounded-full border border-ivory-50/40 px-8 text-base font-semibold text-ivory-50 transition hover:border-ivory-50"
            >
              {hero.secondary}
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
