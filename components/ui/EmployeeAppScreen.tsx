"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Emblem } from "@/components/brand/Logo";

/* RoamX employee app, designed at 300 × 620 and scaled by ScaledScreen. Auto-plays the ride flow. */

const STEPS = ["book", "assigned", "live", "board"] as const;

function MiniMap({ progress }: { progress: boolean }) {
  return (
    <div className="relative h-[230px] overflow-hidden rounded-3xl bg-navy-900">
      <svg viewBox="0 0 280 230" className="absolute inset-0 h-full w-full">
        {Array.from({ length: 8 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 40} 0V230`} stroke="#13254a" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 40}H280`} stroke="#13254a" />
        ))}
        <path id="app-route" d="M30 200 C 80 190, 90 120, 140 110 S 220 60, 250 30" stroke="#f6de9a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="250" cy="30" r="7" fill="#fbf8f2" />
        {progress && (
          <circle r="8" fill="#f6de9a">
            <animateMotion dur="5s" repeatCount="indefinite">
              <mpath href="#app-route" />
            </animateMotion>
          </circle>
        )}
      </svg>
    </div>
  );
}

export default function EmployeeAppScreen() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % STEPS.length), 2800);
    return () => clearInterval(t);
  }, []);
  const step = STEPS[i];

  return (
    <div className="flex h-[620px] w-[300px] flex-col bg-ivory-50 font-sans text-navy-800">
      {/* status bar */}
      <div className="flex items-center justify-between px-7 pb-1 pt-4 text-[12px] font-semibold">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-4 rounded-[3px] border border-navy-800/70" />
        </span>
      </div>

      <div className="flex items-center justify-between px-5 pt-3">
        <div>
          <p className="text-[11px] text-navy-800/50">Good morning</p>
          <p className="text-[17px] font-semibold">Priya</p>
        </div>
        <Emblem width={34} height={34} />
      </div>

      <div className="relative flex-1 px-4 pt-4">
        <MiniMap progress={step === "live"} />

        <div className="relative mt-[-36px] px-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="rounded-3xl bg-white p-4 shadow-[0_20px_40px_-20px_rgba(10,20,48,0.35)]"
            >
              {step === "book" && (
                <>
                  <p className="text-[11px] uppercase tracking-wider text-navy-800/45">Next shuttle</p>
                  <p className="mt-1 text-[16px] font-semibold">Home → Tech Park</p>
                  <p className="text-[12px] text-navy-800/55">Route 07 · Departs 08:52 · 4 seats left</p>
                  <button className="bg-gold mt-4 h-11 w-full rounded-2xl text-[14px] font-semibold text-navy-900">Book seat</button>
                </>
              )}
              {step === "assigned" && (
                <>
                  <p className="text-[11px] uppercase tracking-wider text-emerald-600">Seat confirmed</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-full bg-navy-800 text-[14px] font-semibold text-gold-200">RK</span>
                    <div>
                      <p className="text-[15px] font-semibold">Ravi K. · 4.9</p>
                      <p className="font-mono text-[11.5px] text-navy-800/55">KA 01 AB 4521 · Shuttle</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[12px] text-navy-800/55">Pickup at Gate 2, 08:52</p>
                </>
              )}
              {step === "live" && (
                <>
                  <p className="text-[11px] uppercase tracking-wider text-navy-800/45">On the way</p>
                  <p className="mt-1 text-[22px] font-semibold">Arriving in 4 min</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-champagne-200">
                    <motion.div className="bg-gold h-full rounded-full" initial={{ width: "20%" }} animate={{ width: "78%" }} transition={{ duration: 2.4 }} />
                  </div>
                  <p className="mt-2 text-[12px] text-navy-800/55">Trip shared with security desk</p>
                </>
              )}
              {step === "board" && (
                <>
                  <p className="text-[11px] uppercase tracking-wider text-navy-800/45">Boarding OTP</p>
                  <div className="mt-2 flex gap-2">
                    {["4", "8", "2", "1"].map((d, k) => (
                      <motion.span
                        key={k}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: k * 0.1 }}
                        className="grid h-12 flex-1 place-items-center rounded-xl bg-navy-800 font-mono text-[20px] text-gold-200"
                      >
                        {d}
                      </motion.span>
                    ))}
                  </div>
                  <p className="mt-3 text-[12px] text-navy-800/55">Share with your driver to board</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* tab bar */}
      <div className="flex justify-around px-6 pb-6 pt-3">
        {[0, 1, 2, 3].map((k) => (
          <span key={k} className={k === 0 ? "h-1.5 w-6 rounded-full bg-navy-800" : "size-1.5 rounded-full bg-navy-800/25"} />
        ))}
      </div>
    </div>
  );
}
