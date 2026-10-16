"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { brand } from "@/lib/content";

type Sample = (typeof brand.samples)[number];

// The agency's mark and name, swapping between sample brands: whoever buys RoamX, it's their name here.
function BrandMark({ b, size = "md" }: { b: Sample; size?: "md" | "sm" }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={b.name}
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3"
      >
        <span
          className={`grid shrink-0 place-items-center rounded-xl font-display font-bold text-ivory-50 ${size === "md" ? "size-11 text-[15px]" : "size-8 text-[11px]"}`}
          style={{ background: b.tint }}
        >
          {b.mark}
        </span>
        <span className={`font-display font-semibold tracking-[-0.02em] ${size === "md" ? "text-[19px]" : "text-[14px]"}`}>{b.name}</span>
      </motion.span>
    </AnimatePresence>
  );
}

function Ticket({ b }: { b: Sample }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[26px] bg-white text-navy-800 shadow-[0_40px_80px_-30px_rgba(10,20,48,0.45)]">
      <div className="flex h-[76px] items-center justify-between border-b border-navy-800/10 px-6">
        <BrandMark b={b} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-800/45">E-ticket</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 pt-6">
        <div>
          <p className="font-display text-[40px] font-bold leading-none tracking-[-0.03em]">BLR</p>
          <p className="mt-1 text-[12px] text-navy-800/55">Bengaluru · 08:40</p>
        </div>
        <svg viewBox="0 0 64 16" className="w-16 text-[#c9973f]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 8h50" strokeDasharray="3 4" />
          <path d="M50 3l8 5-8 5" />
        </svg>
        <div className="text-right">
          <p className="font-display text-[40px] font-bold leading-none tracking-[-0.03em]">GOI</p>
          <p className="mt-1 text-[12px] text-navy-800/55">Goa · 09:55</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 px-6 pb-6 pt-6 text-[12px]">
        {[
          ["Passenger", "Ananya R."],
          ["Date", "14 Nov"],
          ["Seat", "12A"],
          ["PNR", "K7Q2MZ"],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-navy-800/45">{k}</p>
            <p className="mt-0.5 font-semibold">{v}</p>
          </div>
        ))}
      </div>
      {/* perforation */}
      <div className="relative h-0 border-t border-dashed border-navy-800/15">
        <span className="absolute -left-3 -top-3 size-6 rounded-full bg-ivory-100" />
        <span className="absolute -right-3 -top-3 size-6 rounded-full bg-ivory-100" />
      </div>
      <div className="flex items-center justify-between px-6 py-4 text-[12px] text-navy-800/55">
        <span>Fare ₹1,200 · incl. taxes</span>
        <span className="flex gap-[3px]" aria-hidden>
          {Array.from({ length: 26 }, (_, i) => (
            <span key={i} className="h-6 bg-navy-800" style={{ width: i % 3 === 0 ? 3 : 1.5 }} />
          ))}
        </span>
      </div>
    </div>
  );
}

function Voucher({ b }: { b: Sample }) {
  return (
    <div className="w-full rounded-[22px] bg-ivory-50 p-5 text-navy-800 shadow-[0_30px_60px_-30px_rgba(10,20,48,0.4)] ring-1 ring-navy-800/5">
      <div className="flex items-center justify-between">
        <BrandMark b={b} size="sm" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-800/45">Hotel voucher</span>
      </div>
      <p className="mt-4 font-display text-[18px] font-semibold tracking-[-0.02em]">Seaside resort, Candolim</p>
      <p className="mt-1 text-[12px] text-navy-800/55">3 nights · Check-in 14 Nov · 2 guests</p>
    </div>
  );
}

export default function BrandTicket() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % brand.samples.length), 2800);
    return () => clearInterval(t);
  }, []);

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
      gsap.fromTo(
        q("[data-ticket]"),
        { y: 120, rotate: -6, opacity: 0 },
        { y: 0, rotate: -2, opacity: 1, ease: "power3.out", scrollTrigger: { trigger: q("[data-stack]")[0], start: "top 90%", end: "top 40%", scrub: 0.8 } },
      );
      gsap.fromTo(
        q("[data-voucher]"),
        { y: 160, rotate: 8, opacity: 0 },
        { y: 0, rotate: 4, opacity: 1, ease: "power3.out", scrollTrigger: { trigger: q("[data-stack]")[0], start: "top 80%", end: "top 30%", scrub: 0.8 } },
      );
    },
    { scope: root },
  );

  const b = brand.samples[i];

  return (
    <section ref={root} id="brand" className="relative overflow-hidden bg-ivory-100 py-28 sm:py-40">
      <AmbientBackground />
      <div className="relative mx-auto grid max-w-[1180px] items-center gap-16 px-5 sm:px-10 lg:grid-cols-[1fr_1.1fr]">
        <div data-head>
          <h2 className="font-display text-[clamp(40px,5vw,76px)] font-semibold leading-[0.98] tracking-[-0.04em] text-navy-800">
            {brand.headline.map((l, k) => (
              <span key={l} className={k === 1 ? "text-gold block" : "block"}>
                {l}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-[40ch] text-[clamp(16px,1.4vw,19px)] leading-relaxed text-navy-800/65">{brand.sub}</p>
        </div>

        <div data-stack className="relative mx-auto w-full max-w-[520px] pb-16">
          <div data-ticket className="relative z-10">
            <Ticket b={b} />
          </div>
          <div data-voucher className="absolute -bottom-2 right-[-4%] z-20 w-[62%] sm:right-[-8%]">
            <Voucher b={b} />
          </div>
        </div>
      </div>
    </section>
  );
}
