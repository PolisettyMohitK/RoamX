"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollTrigger } from "@/lib/gsap";
import EnquiryForm from "@/components/ui/EnquiryForm";
import { getLenis } from "@/components/SmoothScroll";
import { contact, site } from "@/lib/content";

const OPEN_EVENT = "roamx:contact";
const SPRING = { type: "spring", stiffness: 340, damping: 34, mass: 0.9 } as const;

/** Open the floating "Talk to us" panel from anywhere (e.g. a Start button before payments are live). */
export function openContact() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/*
 * A glass "Talk to us" pill fixed to the bottom-right. It morphs open into a glass panel holding the enquiry
 * form, and back. Shown once the intro has handed over, hidden while the menu is open and over the closing section. Switch it off with
 * `site.contactForm`.
 */
export default function ContactPill() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const shell = useRef<HTMLDivElement>(null);

  const set = (next: boolean) => {
    setOpen(next);
    if (next) getLenis()?.stop();
    else getLenis()?.start();
  };

  useEffect(() => {
    const arrived = () => setReady(true);
    if ((window as unknown as { __roamxArrived?: boolean }).__roamxArrived) arrived();
    const onOpen = () => {
      setReady(true);
      set(true);
    };
    const onMenu = (e: Event) => setMenu((e as CustomEvent<boolean>).detail);
    // the closing section has its own Start button (which opens this panel), so step aside from there on
    const end = ScrollTrigger.create({ trigger: "#join", start: "top 85%", onEnter: () => setAtEnd(true), onLeaveBack: () => setAtEnd(false) });
    window.addEventListener("roamx:arrived", arrived);
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener("roamx:menu", onMenu);
    return () => {
      end.kill();
      window.removeEventListener("roamx:arrived", arrived);
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("roamx:menu", onMenu);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!shell.current?.contains(e.target as Node)) set(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && set(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (!site.contactForm) return null;
  const shown = ready && !menu && (open || !atEnd);

  return (
    <div
      ref={shell}
      className={`fixed bottom-4 right-4 z-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:bottom-6 sm:right-6 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="panel"
            layoutId="contact-shell"
            transition={SPRING}
            style={{ borderRadius: 30 }}
            className="glass w-[min(calc(100vw-32px),440px)] overflow-hidden"
          >
            <motion.div layout transition={SPRING} data-lenis-prevent className="max-h-[min(78svh,720px)] overflow-y-auto p-6 text-navy-800 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-[26px] font-semibold leading-tight tracking-[-0.03em]">{contact.headline}</h3>
                  <p className="mt-2 text-[15px] text-navy-800/60">{contact.sub}</p>
                </div>
                <button
                  onClick={() => set(false)}
                  aria-label="Close"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-navy-800/[0.07] text-navy-800 transition hover:bg-navy-800/[0.12]"
                >
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </div>
              <EnquiryForm tone="light" className="mt-6" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            key="pill"
            layoutId="contact-shell"
            transition={SPRING}
            style={{ borderRadius: 999 }}
            onClick={() => set(true)}
            className="glass flex h-13 items-center gap-2.5 px-5 text-[15px] font-semibold text-navy-800 max-sm:w-13 max-sm:justify-center max-sm:px-0"
          >
            <motion.span layout="position" className="flex items-center gap-2.5">
              <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M3.5 5.5A2 2 0 0 1 5.5 3.5h9a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-3.5 3v-3h0a2 2 0 0 1-2-2z" strokeLinejoin="round" />
              </svg>
              <span className="max-sm:sr-only">{contact.pill}</span>
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
