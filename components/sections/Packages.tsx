"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { scrollToTarget } from "@/components/SmoothScroll";
import { packages } from "@/lib/content";

export const DESTINATION_EVENT = "roamx:destination";

export default function Packages() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-head] > *"), {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(q("[data-card]"), {
        y: 70,
        opacity: 0,
        stagger: 0.09,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-grid]")[0], start: "top 85%" },
      });
    },
    { scope: root },
  );

  const plan = (name: string) => {
    window.dispatchEvent(new CustomEvent(DESTINATION_EVENT, { detail: name }));
    scrollToTarget("#join");
  };

  return (
    <section ref={root} id="packages" className="relative overflow-hidden bg-ivory-50 py-28 sm:py-40">
      <AmbientBackground />
      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-10">
        <div data-head className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-[clamp(40px,6vw,88px)] font-semibold leading-[0.98] tracking-[-0.04em] text-navy-800">
            {packages.headline}
          </h2>
          <p className="max-w-[40ch] text-[clamp(16px,1.4vw,19px)] leading-relaxed text-navy-800/65">{packages.sub}</p>
        </div>

        <div data-grid className="mt-14 grid gap-x-6 gap-y-12 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {packages.items.map((p) => (
            <button key={p.name} data-card onClick={() => plan(p.name)} className="group text-left">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-navy-800">
                <Image
                  src={p.image}
                  alt={`${p.name}: ${p.kind}`}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-[clamp(26px,2.4vw,32px)] font-semibold tracking-[-0.03em] text-navy-800">{p.name}</h3>
                  <p className="mt-1 text-[15px] text-navy-800/60">{p.kind}</p>
                </div>
                <span className="mb-1 flex size-11 shrink-0 items-center justify-center rounded-full border border-navy-800/15 text-navy-800 transition-all duration-500 group-hover:border-transparent group-hover:bg-navy-800 group-hover:text-gold-200">
                  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
