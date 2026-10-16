"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/components/SmoothScroll";
import AmbientBackground from "@/components/ui/AmbientBackground";
import StartButton from "@/components/ui/StartButton";
import { sell } from "@/lib/content";

const SPRING = { type: "spring", stiffness: 260, damping: 32, mass: 1 } as const;
type Item = (typeof sell.items)[number];
// one size for tiles and the window, so the window reuses the already-loaded photo while it morphs
const TILE_SIZES = "(min-width: 768px) 600px, 100vw";

/*
 * A tight gallery of photos at mixed shapes. Hover (or focus) reveals the title; a click lifts the photo
 * into a floating window in the middle of the screen, the photo on the left and the story on the right.
 */
export default function Sell() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-head] > *"), {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(q("[data-tile]"), {
        y: 50,
        opacity: 0,
        stagger: 0.05,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-grid]")[0], start: "top 85%" },
      });
    },
    { scope: root },
  );

  useEffect(() => {
    if (open === null) return;
    getLenis()?.stop();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("keydown", esc);
      getLenis()?.start();
    };
  }, [open]);

  const item: Item | null = open === null ? null : sell.items[open];

  return (
    <section ref={root} id="sell" className="relative overflow-hidden bg-ivory-50 py-28 sm:py-40">
      <AmbientBackground />
      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-10">
        <div data-head className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[13ch] font-display text-[clamp(40px,6vw,88px)] font-semibold leading-[0.98] tracking-[-0.04em] text-navy-800">
            {sell.headline}
          </h2>
          <p className="max-w-[40ch] text-[clamp(16px,1.4vw,19px)] leading-relaxed text-navy-800/65">{sell.sub}</p>
        </div>

        <div
          data-grid
          className="mt-14 grid grid-flow-dense grid-cols-2 gap-1.5 [grid-auto-rows:clamp(110px,26vw,170px)] sm:mt-20 md:grid-cols-4 md:[grid-auto-rows:clamp(120px,13vw,190px)]"
        >
          {sell.items.map((p, i) => (
            <button
              key={p.image}
              data-tile
              onClick={() => setOpen(i)}
              aria-label={`${p.kind}: ${p.title}`}
              className="group relative overflow-hidden rounded-[14px] text-left outline-offset-2"
              style={{ gridColumn: `span ${p.span[0]}`, gridRow: `span ${p.span[1]}` }}
            >
              <motion.div layoutId={`sell-img-${i}`} transition={SPRING} className="absolute inset-0 overflow-hidden rounded-[14px] bg-navy-800">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  quality={85}
                  sizes={TILE_SIZES}
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
              </motion.div>
              {/* revealed on hover / focus */}
              <span className="absolute inset-0 flex flex-col justify-end bg-navy-950/55 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-5">
                <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gold-200">{p.kind}</span>
                <span className="mt-1 font-display text-[clamp(17px,1.6vw,22px)] font-semibold leading-tight tracking-[-0.02em] text-ivory-50">{p.title}</span>
                <span className="mt-1 text-[13px] text-ivory-50/70">{p.line}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* the floating window */}
      <AnimatePresence>
        {item && open !== null && (
          <div className="fixed inset-0 z-[60] grid place-items-center p-4 sm:p-8">
            <motion.button
              aria-label="Close"
              onClick={() => setOpen(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 cursor-default bg-navy-950/45 backdrop-blur-md"
            />
            <div data-lenis-prevent className="relative grid max-h-[92svh] w-full max-w-[980px] overflow-y-auto rounded-[28px] md:grid-cols-[1.1fr_1fr] md:overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 bg-ivory-50 shadow-[0_40px_120px_-30px_rgba(5,10,30,0.7)]"
              />
              <motion.div
                layoutId={`sell-img-${open}`}
                transition={SPRING}
                className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-navy-800 md:aspect-auto md:min-h-[520px]"
              >
                <Image src={item.image} alt={item.alt} fill quality={85} sizes={TILE_SIZES} className="object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="relative flex flex-col justify-center p-7 text-navy-800 sm:p-10"
              >
                <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9a6e2a]">{item.kind}</span>
                <h3 className="mt-3 font-display text-[clamp(28px,3vw,40px)] font-semibold leading-[1.05] tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-navy-800/70">{sell.detail[item.kind]}</p>
                <p className="mt-6 font-display text-[18px] font-semibold text-navy-800">
                  Your markup on top. <span className="text-gold">Yours to keep.</span>
                </p>
                <StartButton className="mt-8 self-start" onBefore={() => setOpen(null)} />
              </motion.div>
              <button
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="glass absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full text-navy-800"
              >
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
