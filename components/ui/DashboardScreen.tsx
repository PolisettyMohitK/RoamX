"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Emblem } from "@/components/brand/Logo";
import { business } from "@/lib/content";
import { cn } from "@/lib/utils";

/* RoamX company travel desk, designed at 1000 × 625 and scaled by ScaledScreen. */

// Flight arcs between cities on a stylised map (620 × 380).
const CITIES = {
  DEL: [250, 120],
  BOM: [205, 215],
  BLR: [255, 290],
  GOI: [215, 255],
  DXB: [95, 150],
  SIN: [520, 330],
} as const;
const ARC = (a: keyof typeof CITIES, b: keyof typeof CITIES, lift: number) => {
  const [x1, y1] = CITIES[a];
  const [x2, y2] = CITIES[b];
  return `M${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - lift} ${x2} ${y2}`;
};
const ROUTES = [
  { d: ARC("BLR", "DXB", 110), c: "#f6de9a" },
  { d: ARC("DEL", "SIN", 90), c: "#8fa3cf" },
  { d: ARC("BOM", "GOI", 40), c: "#d4a54e" },
];

const toneDot = { ok: "bg-emerald-400", warn: "bg-amber-400", gold: "bg-gold-200" } as const;

function EventStream() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const t = setInterval(() => setCount((c) => c + 1), 1900);
    return () => clearInterval(t);
  }, []);
  const n = business.events.length;
  const visible = Array.from({ length: Math.min(count, 5) }, (_, i) => {
    const idx = count - 1 - i;
    return { key: idx, ...business.events[idx % n] };
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
            <p className="text-[15px] font-semibold">Company trips</p>
            <p className="text-[11px] text-ivory-50/45">Travel desk · This month</p>
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
                {ROUTES.map((r, i) => (
                  <g key={i}>
                    <path id={`dash-route-${i}`} d={r.d} stroke={r.c} strokeOpacity="0.9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M7 0 L-5 -5 L-3 0 L-5 5 Z" fill={r.c}>
                      <animateMotion dur={`${7 + i * 2}s`} repeatCount="indefinite" rotate="auto">
                        <mpath href={`#dash-route-${i}`} />
                      </animateMotion>
                    </path>
                  </g>
                ))}
                {Object.entries(CITIES).map(([code, [x, y]]) => (
                  <g key={code}>
                    <circle cx={x} cy={y} r="4" fill="#fbf8f2" />
                    <text x={x + 8} y={y + 4} fontSize="11" fill="#fbf8f2" fillOpacity="0.6" fontFamily="var(--font-jetbrains)">
                      {code}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* trips table */}
            <div className="rounded-2xl bg-navy-900 p-3">
              {business.trips.map((t) => (
                <div key={t.id} className="grid grid-cols-[96px_1fr_90px] items-center px-2 py-1.5 text-[12px]">
                  <span className="font-mono text-gold-200">{t.id}</span>
                  <span className="text-ivory-50/80">{t.label}</span>
                  <span className={cn("text-right", t.status === "Completed" ? "text-emerald-400" : "text-ivory-50/70")}>{t.status}</span>
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
