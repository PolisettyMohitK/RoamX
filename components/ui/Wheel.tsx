import { forwardRef, useId } from "react";
import { Emblem } from "@/components/brand/Logo";

/* Large RoamX coach wheel. The ref'd group rotates. viewBox is centred on the axle: -100..100. */
const Wheel = forwardRef<SVGGElement, { className?: string }>(function Wheel({ className }, spinRef) {
  const id = useId().replace(/:/g, "");
  const treads = Array.from({ length: 56 }, (_, i) => (i * 360) / 56);
  const spokes = [0, 72, 144, 216, 288];
  const nuts = [36, 108, 180, 252, 324];

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
        <path id={`${id}-wall`} d="M0 -80 A80 80 0 1 1 -0.01 -80" />
      </defs>

      <g ref={spinRef}>
        <circle r="99" fill="#0c0e12" />
        {treads.map((a) => (
          <rect key={a} x="-2.2" y="-99" width="4.4" height="7" rx="1" fill="#1f232a" transform={`rotate(${a})`} />
        ))}
        <circle r="86" fill="none" stroke="#252a32" strokeWidth="1" />
        <text fill="#c9973f" fillOpacity="0.55" fontSize="7.2" letterSpacing="3.2" fontFamily="var(--font-jetbrains), monospace">
          <textPath href={`#${id}-wall`}>ROAMX · EVOLVE · ROAMX · EVOLVE · ROAMX · EVOLVE ·</textPath>
        </text>

        <circle r="72" fill={`url(#${id}-gold)`} />
        <circle r="66" fill="#0b1a38" />
        {spokes.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M-9 -20 L-6 -64 L-1 -64 L-3 -20 Z" fill={`url(#${id}-gold)`} />
            <path d="M9 -20 L6 -64 L1 -64 L3 -20 Z" fill={`url(#${id}-gold)`} />
          </g>
        ))}
        <circle r="24" fill={`url(#${id}-gold)`} />
        {nuts.map((a) => (
          <circle key={a} cx="0" cy="-19.5" r="2.4" fill="#0b1a38" transform={`rotate(${a})`} />
        ))}
        <circle r="15.5" fill="#0b1a38" />
        <Emblem x="-14" y="-12" width="28" height="23" title="" />
      </g>
    </svg>
  );
});

export default Wheel;
