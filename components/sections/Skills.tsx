"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { skills } from "@/lib/content";

const WORD = "font-display text-[clamp(40px,6vw,88px)] font-bold leading-[1] tracking-[-0.04em]";

/*
 * The skills that stay with them after the portal. Each word fills with ink as its row scrolls up,
 * like it's being written in; the close lands the "first business, not your last" idea.
 */
export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      q("[data-skill]").forEach((row) => {
        const st = { trigger: row, start: "top 88%", end: "top 48%", scrub: 0.8 };
        gsap.fromTo(row.querySelector("[data-ink]"), { clipPath: "inset(-0.1em 100% -0.3em 0)" }, { clipPath: "inset(-0.1em 0% -0.3em 0)", ease: "none", scrollTrigger: st });
        gsap.from(row.querySelector("[data-skill-line]"), { opacity: 0, y: 18, ease: "power2.out", scrollTrigger: st });
      });
      gsap.from(q("[data-close-line]"), {
        yPercent: 110,
        stagger: 0.1,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-close]")[0], start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="skills" className="relative bg-ivory-50 py-28 text-navy-800 sm:py-40">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="font-display text-[clamp(36px,5vw,72px)] font-semibold leading-[1.02] tracking-[-0.035em]">{skills.headline}</h2>
          <p className="mt-5 max-w-[36ch] text-[clamp(16px,1.4vw,19px)] leading-relaxed text-navy-800/65">{skills.sub}</p>
        </div>

        <ul className="border-t border-navy-800/10">
          {skills.items.map((s) => (
            <li key={s.word} data-skill className="border-b border-navy-800/10 py-8 sm:py-10">
              <p className={`${WORD} relative`}>
                <span className="text-navy-800/15">{s.word}</span>
                <span data-ink aria-hidden className="absolute inset-0">
                  {s.word}
                </span>
              </p>
              <p data-skill-line className="mt-4 max-w-[44ch] text-[clamp(16px,1.4vw,19px)] leading-relaxed text-navy-800/70">
                {s.line}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <p data-close className="mx-auto mt-24 max-w-[1180px] px-5 font-display text-[clamp(30px,4.2vw,62px)] font-bold leading-[1.04] tracking-[-0.035em] sm:mt-36 sm:px-10">
        {skills.close.map((l, i) => (
          <span key={l} className="-mb-[0.08em] block overflow-hidden pb-[0.16em]">
            <span data-close-line className={i === 1 ? "text-gold inline-block" : "block"}>
              {l}
            </span>
          </span>
        ))}
      </p>
    </section>
  );
}
