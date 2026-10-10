"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Emblem } from "@/components/brand/Logo";
import { packages } from "@/lib/content";

/* RoamX traveller app, designed at 300 × 620 and scaled by ScaledScreen. Cycles through the trip. */

const STEPS = ["trip", "flight", "stay", "plan"] as const;
const goa = packages.items[0];

export default function TravellerAppScreen() {
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
          <p className="text-[11px] text-navy-800/50">Your trip</p>
          <p className="text-[17px] font-semibold">Goa · 12–17 Nov</p>
        </div>
        <Emblem width={34} height={34} />
      </div>

      <div className="relative flex-1 px-4 pt-4">
        <div className="relative h-[230px] overflow-hidden rounded-3xl bg-navy-900">
          <Image src={goa.image} alt="" fill sizes="300px" className="object-cover" />
        </div>

        <div className="relative mt-[-40px] px-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="rounded-3xl bg-white p-4 shadow-[0_20px_40px_-20px_rgba(10,20,48,0.35)]"
            >
              {step === "trip" && (
                <>
                  <p className="text-[11px] uppercase tracking-wider text-navy-800/45">Beach escape · 5 nights</p>
                  <p className="mt-1 text-[16px] font-semibold">Flights, villa & transfers</p>
                  <p className="text-[12px] text-navy-800/55">Everything confirmed. Have a great trip.</p>
                  <button className="bg-gold mt-4 h-11 w-full rounded-2xl text-[14px] font-semibold text-navy-900">View itinerary</button>
                </>
              )}
              {step === "flight" && (
                <>
                  <p className="text-[11px] uppercase tracking-wider text-emerald-600">Boarding pass</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[24px] font-semibold">BLR</span>
                    <span className="flex-1 border-t border-dashed border-navy-800/25 mx-3" />
                    <span className="text-[24px] font-semibold">GOI</span>
                  </div>
                  <p className="mt-2 font-mono text-[11.5px] text-navy-800/60">6E 1432 · 08:40 · Gate 14 · Seat 12A</p>
                </>
              )}
              {step === "stay" && (
                <>
                  <p className="text-[11px] uppercase tracking-wider text-navy-800/45">Your stay</p>
                  <p className="mt-1 text-[16px] font-semibold">Seaside villa, Candolim</p>
                  <p className="text-[12px] text-navy-800/55">Check-in today from 2:00 PM · Airport pickup booked</p>
                </>
              )}
              {step === "plan" && (
                <>
                  <p className="text-[11px] uppercase tracking-wider text-navy-800/45">Day 2</p>
                  <p className="mt-1 text-[16px] font-semibold">Sunset cruise at 5:30 PM</p>
                  <p className="text-[12px] text-navy-800/55">Dinner on the beach after. Your host will meet you at the jetty.</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-around px-6 pb-6 pt-3">
        {[0, 1, 2, 3].map((k) => (
          <span key={k} className={k === 0 ? "h-1.5 w-6 rounded-full bg-navy-800" : "size-1.5 rounded-full bg-navy-800/25"} />
        ))}
      </div>
    </div>
  );
}
