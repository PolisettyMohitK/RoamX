"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { platform } from "@/lib/content";
import { cn } from "@/lib/utils";

/* An agent's own RoamX portal, designed at 1000 × 625 and scaled by ScaledScreen. */

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const toneDot = { ok: "bg-emerald-400", gold: "bg-gold-200" } as const;
const TABS = ["Flights", "Hotels", "Buses", "Packages"];

function EventStream() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const t = setInterval(() => setCount((c) => c + 1), 1900);
    return () => clearInterval(t);
  }, []);
  const n = platform.events.length;
  const visible = Array.from({ length: Math.min(count, 5) }, (_, i) => {
    const idx = count - 1 - i;
    return { key: idx, ...platform.events[idx % n] };
  });

  return (
    <ul className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {visible.map((e) => (
          <motion.li
            key={e.key}
            layout
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="flex items-start gap-2.5 rounded-xl bg-navy-800 px-3 py-2.5"
          >
            <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", toneDot[e.tone as keyof typeof toneDot])} />
            <span className="flex-1 text-[12.5px] leading-snug text-ivory-50/85">{e.text}</span>
            <span className="font-mono text-[10.5px] text-ivory-50/40">{e.t}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

export default function DashboardScreen() {
  const [tab, setTab] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTab((v) => (v + 1) % TABS.length), 2600);
    return () => clearInterval(t);
  }, []);
  const earned = platform.bookings.reduce((s, b) => s + b.markup, 0);

  return (
    <div className="flex h-[625px] w-[1000px] bg-navy-950 font-sans text-ivory-50">
      {/* sidebar: the agent's own brand */}
      <aside className="flex w-[64px] flex-col items-center gap-5 border-r border-navy-800 py-5">
        <span className="grid size-[34px] place-items-center rounded-xl bg-[#1f3a6e] font-display text-[12px] font-bold">NJ</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("size-9 rounded-xl", i === 0 ? "bg-navy-800 ring-1 ring-[#c9973f]" : "bg-navy-900")} />
        ))}
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-[58px] items-center justify-between border-b border-navy-800 px-6">
          <div>
            <p className="text-[15px] font-semibold">{platform.agency}</p>
            <p className="text-[11px] text-ivory-50/45">Your travel company · This month</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-ivory-50/45">Markup earned</p>
            <p className="font-display text-[18px] font-semibold text-gold-200">{inr(earned)}</p>
          </div>
        </header>

        <div className="flex flex-1 gap-4 p-4">
          <div className="flex flex-1 flex-col gap-4">
            {/* search */}
            <div className="rounded-2xl bg-navy-900 p-4">
              <div className="flex gap-1.5">
                {TABS.map((t, i) => (
                  <span
                    key={t}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-[12px] transition-colors duration-500",
                      i === tab ? "bg-gold font-semibold text-navy-900" : "bg-navy-800 text-ivory-50/60",
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-[1fr_1fr_120px_110px] gap-2 text-[12px]">
                {["From  Bengaluru", "To  Goa", "14 Nov", "2 travellers"].map((f) => (
                  <span key={f} className="rounded-xl bg-navy-800 px-3 py-2.5 text-ivory-50/75">
                    {f}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-navy-800/60 px-3 py-2.5 text-[12px]">
                <span className="text-ivory-50/60">Your markup on this booking</span>
                <span className="font-semibold text-gold-200">+ ₹350</span>
              </div>
            </div>

            {/* bookings */}
            <div className="flex-1 rounded-2xl bg-navy-900 p-3">
              <div className="grid grid-cols-[120px_1fr_70px_80px_80px] px-2 pb-2 text-[10.5px] uppercase tracking-wider text-ivory-50/35">
                <span>Booking</span>
                <span>Customer</span>
                <span>Type</span>
                <span className="text-right">Fare</span>
                <span className="text-right">Your markup</span>
              </div>
              {platform.bookings.map((b) => (
                <div key={b.id} className="grid grid-cols-[120px_1fr_70px_80px_80px] items-center px-2 py-2 text-[12px]">
                  <span className="font-mono text-ivory-50">{b.id}</span>
                  <span className="text-ivory-50/75">{b.who}</span>
                  <span className="text-ivory-50/55">{b.kind}</span>
                  <span className="text-right text-ivory-50/75">{inr(b.fare)}</span>
                  <span className="text-right font-semibold text-gold-200">+{inr(b.markup)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* activity */}
          <div className="flex w-[270px] flex-col rounded-2xl bg-navy-900 p-3">
            <EventStream />
          </div>
        </div>
      </div>
    </div>
  );
}
