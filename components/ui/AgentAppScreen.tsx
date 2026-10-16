"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { platform } from "@/lib/content";

/* The agent's portal on their phone, designed at 300 × 620 and scaled by ScaledScreen. Cycles through a sale. */

const STEPS = ["enquiry", "quote", "issued", "earned"] as const;

export default function AgentAppScreen() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % STEPS.length), 2800);
    return () => clearInterval(t);
  }, []);
  const step = STEPS[i];

  return (
    <div className="flex h-[620px] w-[300px] flex-col bg-ivory-50 font-sans text-navy-800">
      <div className="flex items-center justify-between px-7 pb-1 pt-4 text-[12px] font-semibold">
        <span>9:41</span>
        <span className="h-2.5 w-4 rounded-[3px] border border-navy-800/70" />
      </div>

      <div className="flex items-center justify-between px-5 pt-3">
        <div>
          <p className="text-[11px] text-navy-800/50">Good morning</p>
          <p className="text-[17px] font-semibold">{platform.agency}</p>
        </div>
        <span className="grid size-[34px] place-items-center rounded-xl bg-[#1f3a6e] font-display text-[12px] font-bold text-ivory-50">NJ</span>
      </div>

      <div className="mx-4 mt-4 rounded-3xl bg-navy-900 p-5 text-ivory-50">
        <p className="text-[11px] text-ivory-50/50">Markup earned this month</p>
        <p className="mt-1 font-display text-[32px] font-semibold text-gold-200">₹3,770</p>
        <p className="mt-1 text-[11px] text-ivory-50/50">4 bookings · all yours</p>
      </div>

      <div className="relative flex-1 px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="rounded-3xl bg-white p-4 shadow-[0_20px_40px_-20px_rgba(10,20,48,0.35)]"
          >
            {step === "enquiry" && (
              <>
                <p className="text-[11px] uppercase tracking-wider text-navy-800/45">New enquiry</p>
                <p className="mt-1 text-[16px] font-semibold">Ananya R. · Goa, 2 people</p>
                <p className="text-[12px] text-navy-800/55">Flights and a beach stay, 14–17 Nov</p>
                <button className="bg-gold mt-4 h-11 w-full rounded-2xl text-[14px] font-semibold text-navy-900">Build a quote</button>
              </>
            )}
            {step === "quote" && (
              <>
                <p className="text-[11px] uppercase tracking-wider text-navy-800/45">Quote</p>
                <div className="mt-2 space-y-1.5 text-[13px]">
                  <p className="flex justify-between"><span className="text-navy-800/60">Flights BLR ⇄ GOI</span><span>₹8,400</span></p>
                  <p className="flex justify-between"><span className="text-navy-800/60">Resort, 3 nights</span><span>₹9,600</span></p>
                  <p className="flex justify-between font-semibold text-[#b8862f]"><span>Your markup</span><span>+ ₹1,150</span></p>
                </div>
              </>
            )}
            {step === "issued" && (
              <>
                <p className="text-[11px] uppercase tracking-wider text-emerald-600">Ticket issued</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[24px] font-semibold">BLR</span>
                  <span className="mx-3 flex-1 border-t border-dashed border-navy-800/25" />
                  <span className="text-[24px] font-semibold">GOI</span>
                </div>
                <p className="mt-2 text-[11.5px] text-navy-800/60">Sent to Ananya under {platform.agency}</p>
              </>
            )}
            {step === "earned" && (
              <>
                <p className="text-[11px] uppercase tracking-wider text-navy-800/45">Booking complete</p>
                <p className="mt-1 font-display text-[26px] font-semibold text-[#b8862f]">+ ₹1,150</p>
                <p className="text-[12px] text-navy-800/55">Added to your earnings</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-around px-6 pb-6 pt-3">
        {[0, 1, 2, 3].map((k) => (
          <span key={k} className={k === 0 ? "h-1.5 w-6 rounded-full bg-navy-800" : "size-1.5 rounded-full bg-navy-800/25"} />
        ))}
      </div>
    </div>
  );
}
