"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Emblem } from "@/components/brand/Logo";
import { platform } from "@/lib/content";
import { cn } from "@/lib/utils";

/* RoamX admin dashboard, designed at 1000 × 625 and scaled by ScaledScreen. */

const ROUTES = [
  { d: "M60 300 C 160 280, 200 180, 300 170 S 460 90, 560 60", c: "#f6de9a" },
  { d: "M40 120 C 140 140, 220 240, 340 250 S 500 300, 580 330", c: "#8fa3cf" },
  { d: "M120 360 C 200 320, 260 340, 330 300 S 430 200, 520 210", c: "#d4a54e" },
];

const toneDot = { ok: "bg-emerald-400", warn: "bg-amber-400", gold: "bg-gold-200" } as const;

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
  return (
    <div className="flex h-[625px] w-[1000px] bg-navy-950 font-sans text-ivory-50">
      {/* sidebar */}
      <aside className="flex w-[64px] flex-col items-center gap-5 border-r border-navy-800 py-5">
        <Emblem width={30} height={30} />
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("size-9 rounded-xl", i === 0 ? "bg-navy-800 ring-1 ring-[#c9973f]" : "bg-navy-900")} />
        ))}
      </aside>

      <div className="flex flex-1 flex-col">
        {/* top bar */}
        <header className="flex h-[58px] items-center justify-between border-b border-navy-800 px-6">
          <div>
            <p className="text-[15px] font-semibold">Live operations</p>
            <p className="text-[11px] text-ivory-50/45">Tech Park campus · Morning shift</p>
          </div>
        </header>

        <div className="flex flex-1 gap-4 p-4">
          {/* map */}
          <div className="flex flex-1 flex-col gap-4">
            <div className="relative flex-1 overflow-hidden rounded-2xl bg-navy-900">
              <svg viewBox="0 0 620 380" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
                {Array.from({ length: 16 }, (_, i) => (
                  <path key={`v${i}`} d={`M${i * 40} 0V380`} stroke="#13254a" strokeWidth="1" />
                ))}
                {Array.from({ length: 10 }, (_, i) => (
                  <path key={`h${i}`} d={`M0 ${i * 40}H620`} stroke="#13254a" strokeWidth="1" />
                ))}
                <path d="M0 220 C 140 200, 260 260, 380 230 S 560 180, 620 200" stroke="#1a2f5c" strokeWidth="14" fill="none" />
                {ROUTES.map((r, i) => (
                  <g key={i}>
                    <path id={`dash-route-${i}`} d={r.d} stroke={r.c} strokeOpacity="0.9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle r="6" fill={r.c}>
                      <animateMotion dur={`${9 + i * 3}s`} repeatCount="indefinite" rotate="auto">
                        <mpath href={`#dash-route-${i}`} />
                      </animateMotion>
                    </circle>
                    <circle r="13" fill={r.c} opacity="0.2">
                      <animateMotion dur={`${9 + i * 3}s`} repeatCount="indefinite">
                        <mpath href={`#dash-route-${i}`} />
                      </animateMotion>
                    </circle>
                  </g>
                ))}
                <g transform="translate(560 60)">
                  <rect x="-16" y="-16" width="32" height="32" rx="9" fill="#fbf8f2" />
                  <path d="M-6 6V-4l6-4 6 4V6z" fill="#13254a" />
                </g>
              </svg>
            </div>

            {/* trips table */}
            <div className="rounded-2xl bg-navy-900 p-3">
              {platform.trips.map((t) => (
                <div key={t.id} className="grid grid-cols-[56px_1fr_60px_70px] items-center px-2 py-1.5 text-[12px]">
                  <span className="font-mono text-gold-200">{t.id}</span>
                  <span className="text-ivory-50/80">{t.label}</span>
                  <span className="font-mono text-ivory-50/50">{t.seats}</span>
                  <span className={cn("text-right", t.eta === "Arrived" ? "text-emerald-400" : "text-ivory-50/70")}>{t.eta}</span>
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
