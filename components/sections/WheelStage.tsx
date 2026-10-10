"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Wheel from "@/components/ui/Wheel";
import { steps, stepsLine } from "@/lib/content";

const TURNS = 1.25; // a slow, heavy roll across the whole section
const TITLE = "text-gold font-display font-extrabold leading-none tracking-[-0.045em] whitespace-nowrap pb-[0.06em]";

export default function WheelStage() {
  const root = useRef<HTMLElement>(null);
  const spin = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(spin.current, { transformOrigin: "50% 50%" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      });
      // The wheel rolls forward (clockwise) while "RoamX ⟨wheel⟩ Evolve" travels the other way:
      // it enters from the right edge once and comes to rest framing the wheel.
      tl.to(spin.current, { rotation: TURNS * 360, duration: 1 }, 0);
      q("[data-travel]").forEach((el) => {
        if (!el.offsetParent) return; // hidden at this breakpoint
        tl.fromTo(
          el,
          { x: () => window.innerWidth - (el.getBoundingClientRect().left - (gsap.getProperty(el, "x") as number)) },
          { x: 0, duration: 0.8, ease: "power1.out" },
          0,
        );
      });
      q("[data-step]").forEach((w, i) => {
        tl.fromTo(w, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.15 + i * 0.2);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="how" data-pin data-stops="0,0.25,0.45,0.65,0.86,1" className="relative h-[300svh] bg-navy-950 text-ivory-50">
      <div className="metal-dark sticky top-0 isolate flex h-svh flex-col items-center justify-center overflow-hidden px-5 [--ww:min(46vw,560px,56svh)] max-sm:[--ww:min(72vw,38svh)]">
        {/* phones: RoamX above the wheel */}
        <p data-travel className={`${TITLE} mb-3 text-[clamp(44px,15vw,72px)] sm:hidden`}>
          RoamX
        </p>

        <div className="relative w-[var(--ww)]">
          {/* tablet and up: RoamX to the left of the wheel, Evolve to the right */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden">
            <div data-travel className={`${TITLE} flex items-center text-[clamp(44px,7.5vw,150px)]`}>
              <span>RoamX</span>
              <span className="w-[calc(var(--ww)+5vw)] shrink-0" />
              <span>Evolve</span>
            </div>
          </div>
          <Wheel ref={spin} className="relative w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.55)]" />
        </div>

        {/* phones: Evolve below the wheel */}
        <p data-travel className={`${TITLE} mt-3 text-[clamp(44px,15vw,72px)] sm:hidden`}>
          Evolve
        </p>

        <div className="relative z-[3] mt-[clamp(24px,5svh,56px)] w-full max-w-[920px] text-center">
          <p className="font-display text-[clamp(28px,4vw,56px)] font-semibold leading-tight tracking-[-0.03em]">
            {steps.map((s) => (
              <Fragment key={s}>
                <span data-step className="inline-block opacity-0">
                  {s}.
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <p className="mx-auto mt-4 max-w-[46ch] text-[clamp(15px,1.3vw,18px)] leading-relaxed text-ivory-50/60">{stepsLine}</p>
        </div>
      </div>
    </section>
  );
}
