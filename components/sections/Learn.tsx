"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { learn } from "@/lib/content";

// Scene geometry (viewBox 700 × 700, the agency mark in the middle).
const C = 350;
const RINGS = [
  { r: 150, n: 6, size: 9 },
  { r: 225, n: 11, size: 7 },
  { r: 300, n: 18, size: 5.5 },
];
const DOTS = RINGS.flatMap(({ r, n, size }, k) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + k * 0.4;
    // rounded so the server and browser render identical attributes
    return { x: Math.round((C + Math.cos(a) * r) * 10) / 10, y: Math.round((C + Math.sin(a) * r) * 10) / 10, size, ring: k };
  }),
);
const GOLD = "#d4a54e";

/*
 * "Learn the business by running one", shown rather than told: a student's agency mark sits in the middle;
 * the first enquiry arrives, a ticket goes out under their brand, the markup comes back as profit, customers
 * multiply around them, and "Student" becomes "Entrepreneur".
 */
export default function Learn() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const caps = q("[data-cap]");
      gsap.set(caps, { autoAlpha: 0, y: 16 });
      gsap.set(q("[data-to]"), { autoAlpha: 0, y: 18, filter: "blur(6px)" });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 },
      });
      const caption = (i: number, at: number) => {
        if (i > 0) tl.to(caps[i - 1], { autoAlpha: 0, y: -16, duration: 0.03 }, at - 0.03);
        tl.to(caps[i], { autoAlpha: 1, y: 0, duration: 0.04 }, at);
      };

      tl.from(q("[data-mark]"), { scale: 0.6, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.08 }, 0);
      // 1: the first enquiry
      caption(0, 0.06);
      tl.from(q("[data-bubble]"), { scale: 0.4, autoAlpha: 0, transformOrigin: "100% 100%", duration: 0.07, ease: "back.out(1.6)" }, 0.07)
        .fromTo(q("[data-link-in]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.08 }, 0.12);
      // 2: a ticket goes out under your brand
      caption(1, 0.26);
      tl.fromTo(q("[data-link-out]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.08 }, 0.26)
        .from(q("[data-ticket]"), { x: -170, y: 170, rotate: 18, scale: 0.4, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.12 }, 0.28);
      // 3: the markup comes back as profit
      caption(2, 0.45);
      tl.from(q("[data-coin]"), { x: 150, y: -140, autoAlpha: 0, duration: 0.09, ease: "power2.in" }, 0.45)
        .to(q("[data-coin]"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.03 }, 0.54)
        .from(q("[data-earned]"), { autoAlpha: 0, y: 14, duration: 0.05 }, 0.54)
        .to(q("[data-mark-ring]"), { attr: { r: 74 }, duration: 0.04, yoyo: true, repeat: 1 }, 0.53);
      // 4: customers multiply around you
      caption(3, 0.64);
      tl.to(q("[data-bubble], [data-ticket], [data-link-in], [data-link-out], [data-earned]"), { autoAlpha: 0, duration: 0.05 }, 0.64)
        .from(q("[data-dot]"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", stagger: 0.004, duration: 0.03, ease: "back.out(2)" }, 0.66)
        .fromTo(q("[data-spoke]"), { drawSVG: "0%" }, { drawSVG: "100%", stagger: 0.004, duration: 0.03 }, 0.67)
        .to(q("[data-orbit]"), { rotation: 25, svgOrigin: `${C} ${C}`, duration: 0.3, ease: "none" }, 0.66);
      // the student becomes an entrepreneur
      tl.to(caps[3], { autoAlpha: 0, y: -16, duration: 0.03 }, 0.86)
        .to(q("[data-from]"), { autoAlpha: 0, y: -18, filter: "blur(6px)", duration: 0.05 }, 0.86)
        .to(q("[data-to]"), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.06 }, 0.88)
        .to({}, { duration: 0.06 }, 0.94);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="learn" data-pin data-stops="0,0.2,0.4,0.6,0.84,1" className="relative h-[460svh] bg-navy-950 text-ivory-50">
      <div className="metal-dark sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-5 pt-16">
        <h2 className="text-center font-display text-[clamp(28px,3.6vw,52px)] font-semibold leading-tight tracking-[-0.03em]">{learn.headline}</h2>

        <div className="relative mt-[clamp(8px,2svh,24px)] aspect-square w-[min(92vw,68svh)]">
          <svg viewBox="0 0 700 700" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            {/* customers, in rings around the agency */}
            <g data-orbit>
              {DOTS.map((d, i) => (
                <line key={`s${i}`} data-spoke x1={C} y1={C} x2={d.x} y2={d.y} stroke={GOLD} strokeOpacity={0.22 - d.ring * 0.05} strokeWidth="1" />
              ))}
              {DOTS.map((d, i) => (
                <circle key={`d${i}`} data-dot cx={d.x} cy={d.y} r={d.size} fill={d.ring === 0 ? "#f6de9a" : "#fbf8f2"} fillOpacity={1 - d.ring * 0.25} />
              ))}
            </g>

            {/* 1: the enquiry, and its path in */}
            <path data-link-in d={`M188 214 Q 250 300 ${C - 62} ${C - 22}`} fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
            <g data-bubble>
              <rect x="70" y="140" width="210" height="66" rx="22" fill="#fbf8f2" />
              <path d="M200 204 L 214 226 L 226 204 Z" fill="#fbf8f2" />
              <text x="175" y="181" textAnchor="middle" fontSize="21" fontWeight="600" fill="#13254a" fontFamily="var(--font-sora)">
                {learn.enquiry}
              </text>
            </g>

            {/* 2: the ticket out, under your brand */}
            <path data-link-out d={`M${C + 64} ${C - 30} Q 470 270 520 205`} fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
            <g data-ticket transform="rotate(-8 560 150)">
              <rect x="460" y="98" width="200" height="104" rx="16" fill="#ffffff" />
              <rect x="476" y="114" width="26" height="26" rx="7" fill="#1f3a6e" />
              <text x="489" y="132" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbf8f2" fontFamily="var(--font-sora)">
                NJ
              </text>
              <text x="510" y="132" fontSize="13" fontWeight="600" fill="#13254a" fontFamily="var(--font-sora)">
                Nova Journeys
              </text>
              <text x="476" y="176" fontSize="26" fontWeight="700" fill="#13254a" fontFamily="var(--font-sora)">
                BLR
              </text>
              <path d="M548 168 H 584" stroke={GOLD} strokeWidth="2" strokeDasharray="3 4" />
              <text x="644" y="176" textAnchor="end" fontSize="26" fontWeight="700" fill="#13254a" fontFamily="var(--font-sora)">
                GOI
              </text>
            </g>

            {/* 3: the markup coming back */}
            <g data-coin>
              <circle cx={C} cy={C - 2} r="26" fill={GOLD} />
              <text x={C} y={C + 8} textAnchor="middle" fontSize="28" fontWeight="700" fill="#0a1430" fontFamily="var(--font-sora)">
                ₹
              </text>
            </g>
            <text data-earned x={C} y={C - 92} textAnchor="middle" fontSize="34" fontWeight="700" fill="#f6de9a" fontFamily="var(--font-sora)">
              + ₹350
            </text>

            {/* the agency */}
            <g data-mark>
              <circle data-mark-ring cx={C} cy={C} r="66" fill="none" stroke={GOLD} strokeWidth="2.5" />
              <rect x={C - 46} y={C - 46} width="92" height="92" rx="24" fill="#1f3a6e" />
              <text x={C} y={C + 12} textAnchor="middle" fontSize="34" fontWeight="700" fill="#fbf8f2" fontFamily="var(--font-sora)">
                NJ
              </text>
            </g>

            {/* who you are: Student, and finally Entrepreneur */}
            <text data-from x={C} y={C + 112} textAnchor="middle" fontSize="26" fontWeight="600" fill="#fbf8f2" fillOpacity="0.75" fontFamily="var(--font-sora)">
              {learn.from}
            </text>
            <text data-to x={C} y={C + 118} textAnchor="middle" fontSize="40" fontWeight="700" fill="#f6de9a" fontFamily="var(--font-sora)">
              {learn.to}
            </text>
          </svg>
        </div>

        {/* one caption per beat */}
        <div className="relative h-[clamp(44px,7svh,64px)] w-full max-w-[720px] text-center">
          {learn.captions.map((c) => (
            <p key={c} data-cap className="absolute inset-x-0 top-0 font-display text-[clamp(22px,2.6vw,34px)] font-semibold tracking-[-0.02em] text-ivory-50/85">
              {c}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
