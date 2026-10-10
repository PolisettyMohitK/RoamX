"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Emblem } from "@/components/brand/Logo";
import { site } from "@/lib/content";

/*
 * Social card with spring-driven 3D tilt, adapted from Great UI's Instagram Card (great-ui.com)
 * and re-skinned with RoamX's gold ring and navy surface.
 */

const MAX_TILT = 9;

export default function InstagramCard() {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]);

  return (
    <div className="[perspective:1000px]">
      <motion.a
        ref={ref}
        href={site.socials.instagram}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          x.set((e.clientX - r.left) / r.width - 0.5);
          y.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative block w-full max-w-[340px] overflow-hidden rounded-[28px] border border-[#c9973f]/35 bg-navy-900 p-6 text-ivory-50 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]"
      >
        <div className="relative flex items-center gap-4" style={{ transform: "translateZ(30px)" }}>
          <span className="bg-gold rounded-full p-[2.5px]">
            <span className="grid size-16 place-items-center rounded-full bg-navy-900">
              <Emblem width={44} height={44} title="" aria-hidden />
            </span>
          </span>
          <div>
            <p className="flex items-center gap-1.5 font-semibold">
              @{site.instagram}
              <svg viewBox="0 0 24 24" className="size-4 text-gold-200" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </p>
            <p className="text-sm text-ivory-50/55">RoamX</p>
          </div>
        </div>


        <p className="relative mt-5 text-[15px] leading-relaxed text-ivory-50/70" style={{ transform: "translateZ(14px)" }}>
          Follow the journey. Destinations, offers and trips we have planned.
        </p>
        <span
          className="bg-gold relative mt-5 flex h-11 items-center justify-center rounded-full text-sm font-semibold text-navy-900"
          style={{ transform: "translateZ(24px)" }}
        >
          Follow on Instagram
        </span>
      </motion.a>
    </div>
  );
}
