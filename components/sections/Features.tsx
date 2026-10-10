"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { features } from "@/lib/content";

export default function Features() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-head]"), {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      q("[data-item]").forEach((item) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 88%" } });
        tl.from(item.querySelector("[data-rule]"), { scaleX: 0, transformOrigin: "left center", duration: 1.2, ease: "expo.out" })
          .from(item.querySelector("[data-title]"), { y: 30, opacity: 0, duration: 1, ease: "expo.out" }, 0.1)
          .from(item.querySelector("[data-copy]"), { y: 20, opacity: 0, duration: 1, ease: "expo.out" }, 0.2);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="features" className="relative overflow-hidden bg-ivory-50 py-28 sm:py-40">
      <AmbientBackground />
      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-10">
        <h2
          data-head
          className="max-w-[16ch] font-display text-[clamp(36px,5vw,72px)] font-semibold leading-[1.02] tracking-[-0.035em] text-navy-800"
        >
          {features.headline}
        </h2>

        <div className="mt-16 grid gap-x-12 gap-y-14 sm:mt-24 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-20">
          {features.items.map((f) => (
            <article key={f.key} data-item>
              <span data-rule className="block h-px w-full bg-[#c9973f]" />
              <h3 data-title className="mt-7 font-display text-[clamp(24px,2.2vw,30px)] font-semibold tracking-[-0.025em] text-navy-800">
                {f.title}
              </h3>
              <p data-copy className="mt-3 max-w-[32ch] text-[17px] leading-relaxed text-navy-800/65">
                {f.line}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
