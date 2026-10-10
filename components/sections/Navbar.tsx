"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollTrigger } from "@/lib/gsap";
import { Wordmark } from "@/components/brand/Logo";
import { scrollToTarget, getLenis } from "@/components/SmoothScroll";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#top",
      start: "top+=45% top",
      end: "max",
      onToggle: (self) => setVisible(self.isActive),
    });
    return () => st.kill();
  }, []);

  // Lock page scroll only while the mobile menu is open. (Done on user action, not on mount,
  // so it can never unlock scrolling while the intro is playing.)
  const setMenu = (next: boolean) => {
    setOpen(next);
    if (next) getLenis()?.stop();
    else getLenis()?.start();
  };

  const go = (href: string | number) => {
    if (open) setMenu(false);
    scrollToTarget(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:top-4",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0",
        )}
      >
        <nav className="flex h-14 w-full max-w-[1120px] items-center justify-between rounded-full border border-champagne-200/70 bg-ivory-50/75 pl-5 pr-2 shadow-[0_10px_40px_-18px_rgba(10,20,48,0.35)] backdrop-blur-xl">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go(0);
            }}
            aria-label="RoamX home"
          >
            <Wordmark className="h-[22px] w-auto sm:h-6" />
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(n.href);
                  }}
                  className="rounded-full px-4 py-2 text-sm font-medium text-navy-800/75 transition-colors hover:bg-navy-800/5 hover:text-navy-800"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href="#join"
              onClick={(e) => {
                e.preventDefault();
                go("#join");
              }}
              className="bg-gold hidden h-10 items-center rounded-full px-5 text-sm font-semibold text-navy-900 transition hover:brightness-105 sm:flex"
            >
              Plan my trip
            </a>
            <button
              onClick={() => setMenu(!open)}
              className="grid size-10 place-items-center rounded-full text-navy-800 md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className="relative block h-3 w-5">
                <span className={cn("absolute left-0 top-0 h-[2px] w-5 rounded bg-current transition", open && "top-[5px] rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-[2px] w-5 rounded bg-current transition", open && "bottom-[5px] -rotate-45")} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-navy-950 px-6 pb-10 pt-28 md:hidden"
          >
            <ul className="space-y-2">
              {nav.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={n.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(n.href);
                    }}
                    className="font-display text-[40px] font-semibold tracking-tight text-ivory-50"
                  >
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href="#join"
              onClick={(e) => {
                e.preventDefault();
                go("#join");
              }}
              className="bg-gold flex h-14 items-center justify-center rounded-full font-semibold text-navy-900"
            >
              Plan my trip
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
