import { forwardRef, useId } from "react";
import { Emblem } from "@/components/brand/Logo";

/* Front view of a jet engine. Only the ref'd fan group rotates; the nacelle stays put. viewBox -100..100. */
const Turbine = forwardRef<SVGGElement, { className?: string }>(function Turbine({ className }, fanRef) {
  const id = useId().replace(/:/g, "");
  const blades = Array.from({ length: 18 }, (_, i) => i * 20);

  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe4a3" />
          <stop offset="0.3" stopColor="#dcab58" />
          <stop offset="0.55" stopColor="#f1cd80" />
          <stop offset="0.8" stopColor="#b8833a" />
          <stop offset="1" stopColor="#8e6025" />
        </linearGradient>
      </defs>

      {/* nacelle */}
      <circle r="99" fill="#0b1a38" />
      <circle r="96" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="4" />
      <circle r="88" fill="#040917" />

      <g ref={fanRef}>
        {blades.map((a) => (
          <path
            key={a}
            transform={`rotate(${a})`}
            fill={`url(#${id}-gold)`}
            d="M-4 -18 C 2 -38 10 -58 12 -86 L 1 -86 C -1 -60 -7 -40 -11 -18 Z"
          />
        ))}
        {/* spinner with a swirl, so the rotation reads even at slow speed */}
        <circle r="22" fill="#0b1a38" stroke={`url(#${id}-gold)`} strokeWidth="2" />
        <path d="M0 -20 C 14 -18 20 -4 12 6" fill="none" stroke="#c9973f" strokeWidth="2" strokeLinecap="round" />
        <Emblem x="-13" y="-11" width="26" height="21" title="" />
      </g>
    </svg>
  );
});

export default Turbine;
