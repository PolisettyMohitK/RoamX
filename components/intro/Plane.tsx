import { forwardRef, useId } from "react";
import { Wordmark } from "@/components/brand/Logo";

/*
 * Side-view RoamX airliner in ivory livery, flying right. viewBox 0 0 620 230.
 * The fuselage logo sits exactly on the centre line (x = 310).
 * Animation hooks: [data-body] (everything but the logo), [data-logo] (the fuselage wordmark),
 * [data-logo-box] (exact logo bounds, used to measure the zoom), [data-exhaust] (contrail origin).
 */

const LOGO_W = 168;
const LOGO_H = (LOGO_W * 456) / 1528; // keep the wordmark's exact aspect ratio
const LOGO_X = 310 - LOGO_W / 2;
const LOGO_Y = 122 - LOGO_H / 2;

const Plane = forwardRef<SVGSVGElement, { className?: string }>(function Plane({ className }, ref) {
  const id = useId().replace(/:/g, "");
  const windows = [
    ...Array.from({ length: 6 }, (_, i) => 128 + i * 15),
    ...Array.from({ length: 6 }, (_, i) => 412 + i * 15),
  ];
  return (
    <svg ref={ref} viewBox="0 0 620 230" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe4a3" />
          <stop offset="0.45" stopColor="#d4a54e" />
          <stop offset="1" stopColor="#8e6025" />
        </linearGradient>
      </defs>

      <g data-body>
        {/* far wing + stabiliser (behind the fuselage) */}
        <path d="M352 96 L300 46 H326 L408 94 Z" fill="#b9ae99" />
        <path d="M78 104 L46 84 H66 L118 102 Z" fill="#b9ae99" />

        {/* tail fin */}
        <path d="M64 88 L28 14 H60 L132 88 Z" fill="#e6dccb" />
        <path d="M44 46 L60 46 L96 86 H78 Z" fill="#0b1a38" />
        <path d="M60 14 L132 88 H124 L56 18 Z" fill="#c9973f" />

        {/* fuselage */}
        <path d="M38 118 C38 100 58 86 92 86 H520 C560 86 594 102 612 122 C596 142 562 156 520 156 H96 C66 156 46 144 40 132 Z" fill="#efe8dc" />
        <path d="M96 140 H530 C560 140 586 134 604 128 C590 144 560 156 520 156 H96 C70 156 50 148 42 136 Z" fill="#e2d8c6" />

        {/* gold cheatline */}
        <path d="M50 112 H218 M402 112 H540" stroke="#c9973f" strokeWidth="2.5" />

        {/* windows, either side of the logo */}
        {windows.map((x) => (
          <rect key={x} x={x} y={98} width={8} height={9} rx={3} fill="#13254a" />
        ))}
        {/* cockpit */}
        <path d="M556 98 C572 100 590 108 600 118 H568 C560 112 556 106 556 98 Z" fill="#0b1a38" />
        {/* door */}
        <rect x={526} y={96} width={14} height={40} rx={4} fill="none" stroke="#cfc3ac" strokeWidth="1.5" />

        {/* near stabiliser */}
        <path d="M84 132 L40 168 H64 L126 134 Z" fill="#dcd2bf" />

        {/* near wing + engine */}
        <path d="M356 142 L262 214 H296 L420 146 Z" fill="#dcd2bf" />
        <path d="M262 214 H296 L300 210 H266 Z" fill="#c9973f" />
        <rect x={286} y={160} width={74} height={24} rx={12} fill="#0b1a38" />
        <rect x={350} y={160} width={10} height={24} rx={5} fill={`url(#${id}-gold)`} />
        <rect x={280} y={165} width={10} height={14} rx={4} fill="#1c1f25" />
        <circle data-exhaust cx={281} cy={172} r={1} fill="none" />
      </g>

      {/* fuselage logo */}
      <g data-logo>
        <Wordmark x={LOGO_X} y={LOGO_Y} width={LOGO_W} height={LOGO_H} title="" />
        <rect data-logo-box x={LOGO_X} y={LOGO_Y} width={LOGO_W} height={LOGO_H} fill="none" />
      </g>
    </svg>
  );
});

export default Plane;
