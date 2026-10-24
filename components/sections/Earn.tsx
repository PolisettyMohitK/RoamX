"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { earn, paybackLine } from "@/lib/content";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const NUM = "font-display font-bold leading-none tracking-[-0.04em] tabular-nums";

/*
 * Scroll-driven, in three beats: the price builds up (fare + your markup), the split shows where the money
 * goes, and the markup adds up over a run of bookings.
 */
export default function Earn() {
  const root = useRef<HTMLElement>(null);
  const total = useRef<HTMLSpanElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tally = { n: 1 };
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
      tl.from(q("[data-term]"), { y: 40, opacity: 0, stagger: 0.07, duration: 0.12 }, 0.02)
        .from(q("[data-bar-fare]"), { scaleX: 0, transformOrigin: "left center", duration: 0.16 }, 0.4)
        .from(q("[data-bar-mark]"), { scaleX: 0, transformOrigin: "left center", duration: 0.1 }, 0.52)
        .from(q("[data-split]"), { opacity: 0, y: 14, stagger: 0.05, duration: 0.08 }, 0.56)
        .from(q("[data-run]"), { opacity: 0, y: 30, duration: 0.1 }, 0.74)
        .to(
          tally,
          {
            n: earn.bookings,
            duration: 0.2,
            ease: "none",
            onUpdate: () => {
              total.current!.textContent = inr(Math.round(tally.n) * earn.markup);
              count.current!.textContent = String(Math.round(tally.n));
            },
          },
          0.78,
        )
        .to({}, { duration: 0.04 });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="earn" data-pin data-stops="0,0.36,0.72,1" className="relative h-[300svh] bg-navy-950 text-ivory-50">
      <div className="metal-dark sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-5 text-center">
        <h2 className="font-display text-[clamp(32px,4.6vw,68px)] font-semibold leading-[1.02] tracking-[-0.035em]">
          {earn.headline.map((l, k) => (
            <span key={l} className={k === 1 ? "text-gold block" : "block"}>
              {l}
            </span>
          ))}
        </h2>

        {/* fare + markup = price */}
        <div className="mt-[clamp(28px,6svh,64px)] flex flex-wrap items-end justify-center gap-x-[clamp(14px,2.4vw,36px)] gap-y-4">
          <div data-term>
            <p className={`${NUM} text-[clamp(40px,6.4vw,96px)]`}>{inr(earn.fare)}</p>
            <p className="mt-2 text-[13px] text-ivory-50/55">Portal price</p>
          </div>
          <p data-term className={`${NUM} pb-7 text-[clamp(28px,3.6vw,52px)] text-ivory-50/40`}>
            +
          </p>
          <div data-term>
            <p className={`${NUM} text-gold text-[clamp(40px,6.4vw,96px)]`}>{inr(earn.markup)}</p>
            <p className="mt-2 text-[13px] text-ivory-50/55">Your markup</p>
          </div>
          <p data-term className={`${NUM} pb-7 text-[clamp(28px,3.6vw,52px)] text-ivory-50/40`}>
            =
          </p>
          <div data-term>
            <p className={`${NUM} text-[clamp(40px,6.4vw,96px)]`}>{inr(earn.fare + earn.markup)}</p>
            <p className="mt-2 text-[13px] text-ivory-50/55">Your customer pays</p>
          </div>
        </div>

        {/* where it goes */}
        <div className="mt-[clamp(28px,6svh,60px)] w-full max-w-[720px]">
          <div className="flex h-3 w-full gap-1">
            <span data-bar-fare className="h-full rounded-full bg-ivory-50/80" style={{ flex: earn.fare }} />
            <span data-bar-mark className="bg-gold h-full rounded-full" style={{ flex: earn.markup }} />
          </div>
          <div className="mt-3 flex justify-between text-[14px]">
            <span data-split className="text-ivory-50/60">
              {inr(earn.fare)} to the portal
            </span>
            <span data-split className="font-semibold text-gold-200">
              {inr(earn.markup)} to you
            </span>
          </div>
        </div>

        {/* over a run of bookings */}
        <div data-run className="mt-[clamp(28px,6svh,60px)]">
          <p className="text-[clamp(16px,1.5vw,20px)] text-ivory-50/70">
            <span ref={count}>1</span> bookings like this
          </p>
          <p className={`${NUM} text-gold mt-2 text-[clamp(48px,7vw,110px)]`}>
            <span ref={total}>{inr(earn.markup)}</span>
          </p>
          <p className="mt-2 text-[15px] text-ivory-50/70">yours to keep</p>
          <p className="mx-auto mt-5 max-w-[34ch] text-[clamp(15px,1.3vw,18px)] text-ivory-50/85">{paybackLine}</p>
          <p className="mt-6 text-[12px] text-ivory-50/40">{earn.note}</p>
        </div>
      </div>
    </section>
  );
}
