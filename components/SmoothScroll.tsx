"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

// Gentle ease in/out used for every automatic scroll.
const easeInOutSine = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

/** Slow, premium programmatic scroll. Duration grows with distance. */
export function glideTo(target: number | string, minDuration = 1.8) {
  if (!lenis) {
    if (typeof target === "string") document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  const y = typeof target === "number" ? target : (document.querySelector<HTMLElement>(target)?.getBoundingClientRect().top ?? 0) + lenis.scroll;
  const screens = Math.abs(y - lenis.scroll) / window.innerHeight;
  lenis.scrollTo(y, { duration: Math.min(4.5, Math.max(minDuration, 1.2 + screens * 0.6)), easing: easeInOutSine });
}

export function scrollToTarget(target: string | number) {
  glideTo(target, 2);
}

const IDLE_MS = 1200;

/*
 * Where to settle when scrolling rests part-way. Only the scroll-driven stages ([data-pin]) settle:
 * - inside a stage → move to the next resting state (data-stops, as progress 0–1) in the direction
 *   of travel, unless the user only nudged past the previous one;
 * - with a stage's edge in the middle of the screen → bring that stage (or its neighbour) fully in.
 * Ordinary content sections are never moved, so reading is never interrupted.
 */
function settleTarget(y: number, dir: number): number | null {
  const vh = window.innerHeight;
  const sections = [...document.querySelectorAll<HTMLElement>("main > section")];
  const tops = sections.map((s) => s.getBoundingClientRect().top + y);

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    if (!s.hasAttribute("data-pin")) continue;
    const start = tops[i];
    const len = s.offsetHeight - vh;
    const p = (y - start) / len;
    if (p <= 0.004 || p >= 0.996) continue;
    const stops = (s.dataset.stops ?? "0,1").split(",").map(Number);
    let k = 0;
    while (k < stops.length - 2 && p > stops[k + 1]) k++;
    const [a, b] = [stops[k], stops[k + 1]];
    const t = (p - a) / (b - a);
    const to = dir >= 0 ? (t > 0.15 ? b : a) : t < 0.85 ? a : b;
    return start + to * len;
  }

  for (let i = 1; i < sections.length; i++) {
    const pinnedEdge = sections[i].hasAttribute("data-pin") || sections[i - 1].hasAttribute("data-pin");
    if (!pinnedEdge) continue;
    const offset = tops[i] - y;
    if (offset > vh * 0.15 && offset < vh * 0.85) return dir >= 0 ? tops[i] : tops[i] - vh;
  }
  return null;
}

export default function SmoothScroll() {
  useEffect(() => {
    // The site's motion is part of the experience, so don't let an OS "reduce motion" setting
    // turn every glide into an instant jump.
    const l = new Lenis({ lerp: 0.08, wheelMultiplier: 0.85, respectReducedMotion: false });
    lenis = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let timer = 0;
    let dir = 1;
    let touching = false;
    const settle = () => {
      if (touching || l.isStopped || l.isScrolling) return;
      if (document.activeElement instanceof HTMLInputElement) return;
      const target = settleTarget(l.scroll, dir);
      if (target !== null && Math.abs(target - l.scroll) > 2) glideTo(target, 1.6);
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = window.setTimeout(settle, IDLE_MS);
    };
    l.on("scroll", () => {
      if (l.direction) dir = l.direction;
      schedule();
    });
    const down = () => {
      touching = true;
      clearTimeout(timer);
    };
    const up = () => {
      touching = false;
      schedule();
    };
    window.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchend", up, { passive: true });
    window.addEventListener("touchcancel", up, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("touchstart", down);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchcancel", up);
      gsap.ticker.remove(tick);
      l.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
