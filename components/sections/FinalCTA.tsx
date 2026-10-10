"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Bus from "@/components/intro/Bus";
import WaitlistForm from "@/components/ui/WaitlistForm";
import InstagramCard from "@/components/ui/InstagramCard";
import { Lockup } from "@/components/brand/Logo";
import { finalCta, nav, site } from "@/lib/content";
import { scrollToTarget } from "@/components/SmoothScroll";

export default function FinalCTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const bus = q("[data-cta-bus]")[0] as HTMLElement;
      const wheels = q("[data-cta-bus] [data-wheel]");
      gsap.set(wheels, { transformOrigin: "50% 50%" });

      gsap.from(q("[data-cta-line]"), {
        yPercent: 110,
        stagger: 0.08,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      // The bus from the intro drives off toward the horizon as you reach the end.
      const road = q("[data-road]")[0] as HTMLElement;
      gsap.fromTo(
        bus,
        { x: () => -bus.offsetWidth * 1.1 },
        {
          x: () => road.offsetWidth + bus.offsetWidth * 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: road,
            start: "top bottom",
            end: "bottom 35%",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: () => {
              const circ = 2 * Math.PI * 34 * (bus.offsetWidth / 620);
              gsap.set(wheels, { rotation: ((gsap.getProperty(bus, "x") as number) / circ) * 360 });
            },
          },
        },
      );
      gsap.fromTo(q("[data-horizon]"), { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: road, start: "top bottom", end: "bottom 40%", scrub: 0.6 },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="join" className="metal-dark relative overflow-hidden pt-28 text-ivory-50 sm:pt-40">

      <div className="relative mx-auto grid max-w-[1180px] items-center gap-14 px-5 sm:px-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <h2 className="font-display text-[clamp(44px,6.2vw,96px)] font-bold leading-[0.98] tracking-[-0.04em]">
            {finalCta.headline.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.08em]">
                <span data-cta-line className={i === 1 ? "text-gold block italic" : "block"}>
                  {l}
                </span>
              </span>
            ))}
          </h2>
          <p className="mt-6 text-[clamp(16px,1.4vw,19px)] text-ivory-50/65">{finalCta.sub}</p>
          <WaitlistForm tone="dark" size="lg" className="mt-8" />
        </div>
        <div className="flex justify-center lg:justify-end">
          <InstagramCard />
        </div>
      </div>

      {/* road + horizon */}
      <div data-road className="relative mt-24 h-[clamp(120px,16vw,200px)] sm:mt-32">
        <div data-horizon className="absolute inset-x-0 bottom-[22%] h-px origin-left bg-[#c9973f]" />
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-navy-950" />
        <div data-cta-bus className="absolute bottom-[calc(22%-min(2.2vw,14px))] left-0 w-[clamp(220px,34vw,460px)] will-change-transform">
          <Bus className="w-full overflow-visible" />
        </div>
      </div>

      {/* footer */}
      <footer className="relative border-t border-[#c9973f]/30 bg-navy-950">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-10 px-5 py-14 sm:px-10 md:flex-row md:items-end md:justify-between">
          <Lockup className="w-[min(70vw,300px)]" />
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ivory-50/60">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(n.href);
                }}
                className="transition-colors hover:text-gold-200"
              >
                {n.label}
              </a>
            ))}
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-gold-200">
              {site.email}
            </a>
          </nav>
        </div>
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 border-t border-ivory-50/5 px-5 py-6 text-xs text-ivory-50/40 sm:flex-row sm:justify-between sm:px-10">
          <span>© 2026 RoamX. All rights reserved.</span>
          <span className="flex gap-6">
            {Object.entries(site.socials).map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="capitalize transition-colors hover:text-gold-200">
                {k === "x" ? "X" : k}
              </a>
            ))}
          </span>
        </div>
      </footer>
    </section>
  );
}
