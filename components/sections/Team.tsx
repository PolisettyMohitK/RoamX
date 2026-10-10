"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { team } from "@/lib/content";
import { cn } from "@/lib/utils";

/*
 * Hover-reveal team list adapted from Great UI's Team Section (great-ui.com):
 * muted names brighten on hover, the role slides in, and a portrait follows the cursor.
 */

function Portrait({ name, image, className }: { name: string; image: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div className={cn("relative overflow-hidden rounded-[22px] bg-navy-800", className)}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full w-full place-items-center bg-navy-800">
          <span className="text-gold font-display text-6xl font-semibold">{initials}</span>
        </div>
      )}
    </div>
  );
}

export default function Team() {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const y = useMotionValue(0);
  const sy = useSpring(y, { stiffness: 220, damping: 26 });

  return (
    <section className="relative overflow-hidden bg-ivory-50 py-28 sm:py-40">
      <AmbientBackground />
      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-10">
        <h2 className="font-display text-[clamp(36px,5vw,72px)] font-semibold leading-[1.02] tracking-[-0.035em] text-navy-800">
          The people driving RoamX.
        </h2>

        <div className="relative mt-14">
          <ul
            ref={listRef}
            onMouseLeave={() => setActive(null)}
            onMouseMove={(e) => {
              const r = listRef.current!.getBoundingClientRect();
              y.set(e.clientY - r.top - 140);
            }}
            className="border-t border-navy-800/10"
          >
            {team.map((m, i) => (
              <li key={i} className="border-b border-navy-800/10">
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setOpen(open === i ? null : i)}
                  className="group grid w-full grid-cols-1 items-baseline gap-1 py-5 text-left lg:grid-cols-[220px_1fr] lg:py-6"
                  aria-expanded={open === i}
                >
                  <span
                    className={cn(
                      "font-mono text-[12px] uppercase tracking-[0.16em] text-gold-500 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:-translate-x-2 lg:opacity-35",
                      active === i && "lg:translate-x-0 lg:opacity-100",
                    )}
                  >
                    {m.role}
                  </span>
                  <span
                    className={cn(
                      "font-display text-[clamp(34px,6vw,88px)] font-semibold leading-none tracking-[-0.04em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      active === null || active === i ? "text-navy-800" : "text-navy-800/20",
                      active === i && "lg:pl-4",
                    )}
                  >
                    {m.name}
                  </span>
                </button>
                {/* touch / tablet: inline portrait */}
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden lg:hidden"
                    >
                      <Portrait name={m.name} image={m.image} className="mb-6 aspect-[4/5] w-[min(60vw,260px)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* desktop: floating portrait follows the cursor */}
          <motion.div style={{ y: sy }} className="pointer-events-none absolute right-0 top-0 hidden w-[260px] lg:block">
            <AnimatePresence mode="popLayout">
              {active !== null && (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.92, rotate: -3, y: 30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Portrait name={team[active].name} image={team[active].image} className="aspect-[4/5] w-full shadow-[0_30px_60px_-25px_rgba(10,20,48,0.5)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
