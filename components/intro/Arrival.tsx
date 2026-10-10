"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/components/SmoothScroll";
import Bus from "./Bus";

const SEEN_KEY = "roamx-arrived";

export function markArrived() {
  (window as unknown as { __roamxArrived?: boolean }).__roamxArrived = true;
  window.dispatchEvent(new Event("roamx:arrived"));
}

export default function Arrival() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current!;
      // After the hand-off, glide slowly down until the doors are fully open and the hero copy is in.
      // Only from the very top: never pull back someone whose scroll position the browser restored.
      const openHero = (delay: number) =>
        gsap.delayedCall(delay, () => {
          const hero = document.getElementById("top");
          const l = getLenis();
          if (!hero || !l || l.scroll > 5 || window.scrollY > 5) return;
          l.scrollTo(hero.offsetTop + hero.offsetHeight - window.innerHeight, {
            duration: 4.6,
            easing: (t) => 0.5 - 0.5 * Math.cos(Math.PI * t),
          });
        });
      const finish = () => {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        getLenis()?.start();
        markArrived();
        // Unmount on the next frame so the hand-off frame itself does no extra work.
        requestAnimationFrame(() => setGone(true));
      };

      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}
      if (seen) {
        gsap.set(el, { autoAlpha: 0 });
        finish();
        openHero(0.35);
        return;
      }

      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      getLenis()?.stop();

      const q = gsap.utils.selector(el);
      const wrap = q("[data-bus-wrap]")[0] as HTMLElement;
      const wheels = q("[data-wheel]");
      const vw = window.innerWidth;
      const busW = wrap.offsetWidth;
      const wheelCirc = 2 * Math.PI * 34 * (busW / 620);
      const startX = -(vw / 2 + busW);

      // Exhaust smoke: puffs are dropped behind the bus as it travels, so they trail off where it has been.
      const smoke = q("[data-smoke]")[0];
      const exhaust = q("[data-exhaust]")[0];
      const puffSize = busW * 0.06;
      const puff = (strength: number) => {
        const r = exhaust.getBoundingClientRect();
        const p = document.createElement("span");
        p.className = "smoke-puff";
        Object.assign(p.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${puffSize}px`, height: `${puffSize}px` });
        smoke.appendChild(p);
        gsap.fromTo(
          p,
          { xPercent: -50, yPercent: -50, scale: 0.4, opacity: 0.35 + 0.4 * strength },
          {
            x: -puffSize * (0.8 + Math.random() * 1.4),
            y: -puffSize * (0.3 + Math.random() * 0.9),
            scale: 1.8 + Math.random() * 1.4,
            opacity: 0,
            duration: 1.6 + Math.random() * 0.8,
            ease: "power2.out",
            onComplete: () => p.remove(),
          },
        );
      };
      let lastX = startX;
      let travel = 0;

      gsap.set(wrap, { xPercent: -50, yPercent: -50, x: startX });
      gsap.set(wheels, { transformOrigin: "50% 50%" });
      gsap.set(q("[data-ground]"), { scaleX: 0, transformOrigin: "left center" });

      let z: { x: number; y: number; scale: number } | null = null;
      const zoom = () => {
        if (z) return z;
        const target = document.querySelector("[data-hero-logo]")!.getBoundingClientRect();
        const logo = q("[data-logo-box]")[0].getBoundingClientRect();
        const box = wrap.getBoundingClientRect();
        const lx = logo.left + logo.width / 2;
        const ly = logo.top + logo.height / 2;
        wrap.style.transformOrigin = `${lx - box.left}px ${ly - box.top}px`;
        z = {
          x: (gsap.getProperty(wrap, "x") as number) + target.left + target.width / 2 - lx,
          y: (gsap.getProperty(wrap, "y") as number) + target.top + target.height / 2 - ly,
          scale: target.width / logo.width,
        };
        return z;
      };

      gsap
        .timeline({ onComplete: finish })
        .to(q("[data-ground]"), { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0)
        .to(
          wrap,
          {
            x: 0,
            duration: 1.9,
            ease: "power3.out",
            onUpdate() {
              const x = gsap.getProperty(wrap, "x") as number;
              gsap.set(wheels, { rotation: ((x - startX) / wheelCirc) * 360 });
              const dx = x - lastX;
              lastX = x;
              travel += dx;
              while (travel > puffSize * 0.45) {
                travel -= puffSize * 0.45;
                puff(Math.min(1, dx / (busW * 0.02)));
              }
            },
          },
          0.2,
        )
        .to(wrap, { x: () => zoom().x, y: () => zoom().y, scale: () => zoom().scale, duration: 1.4, ease: "power3.inOut" }, 2.15)
        .to(q("[data-body]"), { opacity: 0, duration: 0.45, ease: "power2.in" }, 2.15)
        .to(q("[data-ground]"), { opacity: 0, duration: 0.6, ease: "power1.inOut" }, 2.2)
        .to(smoke, { opacity: 0, duration: 0.5 }, 2.15)
        // The logo now sits exactly over the hero's logo: drop the overlay in the same frame.
        .set(el, { autoAlpha: 0 })
        .add(() => openHero(0.05));
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="metal-dark fixed inset-0 z-[70] overflow-hidden [--bw:min(86vw,760px)]" aria-hidden>
      <div data-ground className="absolute inset-x-0 top-[calc(50%+var(--bw)*0.16)] h-px bg-[#c9973f]" />
      <div data-smoke className="absolute inset-0" />
      <div data-bus-wrap className="absolute left-1/2 top-1/2 w-[var(--bw)]">
        <Bus className="w-full overflow-visible" />
      </div>
    </div>
  );
}
