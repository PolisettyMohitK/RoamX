"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { testimonials } from "@/lib/content";

const DURATION = 6500;

export default function Testimonials() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setI((v) => (v + 1) % testimonials.length), DURATION);
    return () => clearTimeout(t);
  }, [i]);

  const t = testimonials[i];

  return (
    <section className="relative overflow-hidden bg-navy-900 py-28 text-ivory-50 sm:py-40">
      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-10">
        <span aria-hidden className="text-gold block font-display text-[clamp(90px,12vw,160px)] leading-[0.6]">
          “
        </span>
        <div className="relative mt-4 min-h-[clamp(220px,22vw,280px)]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="max-w-[22ch] font-display text-[clamp(30px,4.4vw,64px)] font-medium leading-[1.08] tracking-[-0.03em]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 text-[15px]">
                <span className="font-semibold text-ivory-50">{t.name}</span>
                <span className="text-ivory-50/50"> · {t.org}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
