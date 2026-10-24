"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Wordmark } from "@/components/brand/Logo";
import { scrollToTarget } from "@/components/SmoothScroll";
import FlapBoard from "@/components/ui/FlapBoard";
import StartButton from "@/components/ui/StartButton";
import { cta, hero, PRICE } from "@/lib/content";

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

/*
 * The doors open onto a split-flap bookings board: flights and hotels coming in under the seller's own
 * brand, with the markup they keep. The board starts flipping as the doors part.
 */
export default function DoorsHero() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const start = contextSafe!(() => setActive(true));

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            onUpdate: (st) => st.progress > 0.2 && start(),
          },
        })
        .to(q("[data-door-l]"), { xPercent: -100, duration: 0.55, ease: "power2.inOut" }, 0)
        .to(q("[data-door-r]"), { xPercent: 100, duration: 0.55, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-board]"), { scale: 1.1, yPercent: 8 }, { scale: 1, yPercent: 0, duration: 0.8 }, 0)
        .from(q("[data-line]"), { yPercent: 110, duration: 0.18, stagger: 0.05, ease: "power3.out" }, 0.5)
        .from(q("[data-sub]"), { opacity: 0, y: 20, duration: 0.12 }, 0.64)
        .from(q("[data-form]"), { opacity: 0, y: 20, duration: 0.12 }, 0.7)
        .to({}, { duration: 0.18 });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" data-pin className="relative h-[250svh] bg-navy-950">
      <div className="metal-dark sticky top-0 isolate h-svh overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[clamp(24px,5svh,56px)] px-5 pt-14 sm:px-10">
          <div data-board>
            <FlapBoard active={active} />
          </div>

          <div className="flex w-full max-w-[1100px] flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
            <h1 className="font-display text-[clamp(30px,4.6vw,68px)] font-bold leading-[1] tracking-[-0.035em] text-ivory-50">
              {hero.headline.map((l, i) => (
                <span key={l} className="-mb-[0.08em] block overflow-hidden pb-[0.16em]">
                  <span data-line className={i === 1 ? "text-gold block" : "block"}>
                    {l}
                  </span>
                </span>
              ))}
            </h1>
            <div className="md:max-w-[400px] md:pb-2">
              <p data-sub className="text-[clamp(15px,1.2vw,18px)] leading-relaxed text-ivory-50/75">
                {hero.sub}
              </p>
              <div data-form className="mt-6 flex flex-wrap items-center gap-3">
                <StartButton label={`${cta.start} · ${PRICE}`} />
                <a
                  href="#how"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget("#how");
                  }}
                  className="flex h-13 items-center rounded-full border border-ivory-50/30 px-7 text-base font-semibold text-ivory-50 transition hover:border-ivory-50"
                >
                  {hero.secondary}
                </a>
              </div>
            </div>
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
