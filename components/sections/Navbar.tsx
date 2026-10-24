"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollTrigger } from "@/lib/gsap";
import { Wordmark } from "@/components/brand/Logo";
import { scrollToTarget, getLenis } from "@/components/SmoothScroll";
import { cta, nav } from "@/lib/content";
import StartButton from "@/components/ui/StartButton";
import { cn } from "@/lib/utils";

export const MENU_EVENT = "roamx:menu"; // detail: boolean (open)

const SPRING = { type: "spring", stiffness: 380, damping: 36, mass: 0.9 } as const;

/*
 * Glass pill header on every screen size: logo, Start button, menu pill. The menu pill's glass stretches down
 * into a panel hanging under it (like iOS Control Center), and the Start button morphs from the header into
 * the panel and back, so it is never on screen twice.
 */
export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [down, setDown] = useState(false); // scrolling down hides the header; any scroll up brings it back
  const [wide, setWide] = useState(false); // the header shows the Start button from 640px
  const shell = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#top",
      start: "top+=45% top",
      // shown from here to the end of the page, hidden again only when scrolling back up past it
      onEnter: () => setVisible(true),
      onLeaveBack: () => setVisible(false),
    });
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setDown(y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      st.kill();
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", sync);
    };
  }, []);

  // Scroll is paused only while the menu is open (on user action, never on mount, so it can't
  // unlock scrolling during the intro).
  const setMenu = (next: boolean) => {
    setOpen(next);
    window.dispatchEvent(new CustomEvent(MENU_EVENT, { detail: next }));
    if (next) getLenis()?.stop();
    else getLenis()?.start();
  };

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!shell.current?.contains(e.target as Node)) setMenu(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const go = (href: string | number) => {
    if (open) setMenu(false);
    scrollToTarget(href);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:top-4",
        (visible && !down) || open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0",
      )}
    >
      <div ref={shell} className="relative w-full max-w-[1120px]">
        <nav className="glass-thick flex h-16 w-full items-center justify-between rounded-full pl-6 pr-3">
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
          <div className="flex items-center gap-2">
            {wide && !open && (
              <motion.div layoutId="nav-cta" transition={SPRING} className="rounded-full">
                <StartButton label={cta.short} className="h-10 px-5 text-sm" />
              </motion.div>
            )}
            <button
              onClick={() => setMenu(!open)}
              className="relative grid size-10 place-items-center rounded-full text-navy-800"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {!open && <motion.span layoutId="nav-shell" transition={SPRING} style={{ borderRadius: 20 }} className="absolute inset-0 bg-navy-800/[0.07]" />}
              <span className="relative block h-3 w-5">
                <span className={cn("absolute left-0 top-0 h-[2px] w-5 rounded bg-current transition", open && "top-[5px] rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-[2px] w-5 rounded bg-current transition", open && "bottom-[5px] -rotate-45")} />
              </span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              layoutId="nav-shell"
              transition={SPRING}
              style={{ borderRadius: 30 }}
              className="glass absolute right-0 top-[calc(100%+10px)] w-[min(calc(100vw-24px),340px)] overflow-hidden p-3"
            >
              <motion.div layout transition={SPRING}>
              <ul className="py-1">
                {nav.map((n, i) => (
                  <motion.li
                    key={n.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ delay: 0.08 + i * 0.04, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={n.href}
                      onClick={(e) => {
                        e.preventDefault();
                        go(n.href);
                      }}
                      className="block rounded-2xl px-4 py-3 font-display text-[19px] font-semibold tracking-[-0.02em] text-navy-800 transition-colors hover:bg-navy-800/[0.06]"
                    >
                      {n.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div layoutId="nav-cta" transition={SPRING} className="mt-2 rounded-full">
                <StartButton label={cta.short} className="h-13 w-full" onBefore={() => setMenu(false)} />
              </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
