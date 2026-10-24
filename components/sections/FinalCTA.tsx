"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Plane from "@/components/intro/Plane";
import StartButton from "@/components/ui/StartButton";
import { PRICE, finalCta } from "@/lib/content";

export default function FinalCTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const plane = q("[data-cta-plane]")[0] as HTMLElement;

      gsap.from(q("[data-cta-line]"), {
        yPercent: 110,
        stagger: 0.08,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      // The plane from the intro takes off over the horizon as you reach the end.
      const sky = q("[data-sky]")[0] as HTMLElement;
      gsap.fromTo(
        plane,
        { x: () => -plane.offsetWidth * 1.1, y: 0, rotation: 0 },
        {
          x: () => sky.offsetWidth + plane.offsetWidth * 0.1,
          y: () => -sky.offsetHeight * 0.55,
          rotation: -9,
          ease: "power1.in",
          scrollTrigger: { trigger: sky, start: "top bottom", end: "bottom 35%", scrub: 0.6, invalidateOnRefresh: true },
        },
      );
      gsap.fromTo(q("[data-horizon]"), { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: sky, start: "top bottom", end: "bottom 40%", scrub: 0.6 },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="join" className="metal-dark relative overflow-hidden pt-28 text-ivory-50 sm:pt-40">

      <div className="relative mx-auto grid max-w-[1180px] items-start gap-14 px-5 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
        <div className="min-w-0">
          <h2 className="font-display text-[clamp(44px,6.2vw,96px)] font-bold leading-[0.98] tracking-[-0.04em]">
            {finalCta.headline.map((l, i) => (
              <span key={l} className="-mb-[0.08em] block overflow-hidden pb-[0.16em]">
                <span data-cta-line className={i === 1 ? "text-gold block" : "block"}>
                  {l}
                </span>
              </span>
            ))}
          </h2>
          <p className="mt-6 text-[clamp(16px,1.4vw,19px)] text-ivory-50/65">{finalCta.sub}</p>
        </div>

        {/* the offer */}
        <div className="min-w-0">
          <div data-offer className="rounded-[28px] border border-[#c9973f]/35 bg-navy-950/55 p-7 sm:p-9">
            <p className="text-gold font-display text-[clamp(52px,6vw,80px)] font-bold leading-none tracking-[-0.04em]">{PRICE}</p>
            <p className="mt-3 text-[15px] text-ivory-50/70">{finalCta.terms.join(" · ")}</p>
            <p className="mt-1.5 text-[15px] text-gold-200">{finalCta.perDay}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {finalCta.includes.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[15px] text-ivory-50/85">
                  <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-gold-200" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8.5l3.2 3L13 4.5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <StartButton className="mt-8 w-full sm:w-auto" />
          </div>
        </div>

      </div>

      {/* sky + horizon: the plane takes off */}
      <div data-sky className="relative mt-20 h-[clamp(180px,24vw,300px)] sm:mt-28">
        <div data-horizon className="absolute inset-x-0 bottom-[14%] h-px origin-left bg-[#c9973f]" />
        <div className="absolute inset-x-0 bottom-0 h-[14%] bg-navy-950" />
        <div data-cta-plane className="absolute bottom-[10%] left-0 w-[clamp(200px,30vw,420px)] origin-[70%_60%] will-change-transform">
          <Plane className="w-full overflow-visible" />
        </div>
      </div>

    </section>
  );
}
