"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faq } from "@/lib/content";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-ivory-100 py-28 sm:py-40">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <h2 className="font-display text-[clamp(36px,5vw,72px)] font-semibold leading-[1.02] tracking-[-0.035em] text-navy-800 lg:sticky lg:top-32 lg:self-start">
          Questions, answered.
        </h2>
        <ul className="border-t border-navy-800/10">
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-navy-800/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-[clamp(18px,1.7vw,22px)] font-medium tracking-[-0.015em] text-navy-800">{f.q}</span>
                  <span
                    className={cn(
                      "relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                      isOpen ? "border-transparent bg-navy-800" : "border-navy-800/15",
                    )}
                  >
                    <span className={cn("absolute h-[1.5px] w-3.5 rounded", isOpen ? "bg-gold-200" : "bg-navy-800")} />
                    <span
                      className={cn(
                        "absolute h-3.5 w-[1.5px] rounded transition-transform duration-300",
                        isOpen ? "scale-y-0 bg-gold-200" : "bg-navy-800",
                      )}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[60ch] pb-7 pr-14 text-[16px] leading-relaxed text-navy-800/65">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
