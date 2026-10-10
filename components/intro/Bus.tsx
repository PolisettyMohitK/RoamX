import { forwardRef, useId } from "react";
import { Wordmark } from "@/components/brand/Logo";

/*
 * Side-view RoamX coach in ivory livery, facing right. viewBox 0 0 620 230.
 * The side logo sits exactly on the bus centre line (x = 310) and the wheels are mirrored around it.
 * Animation hooks: [data-body] (everything but the logo), [data-logo] (the side wordmark),
 * [data-wheel] groups (rotate around their own centre), [data-exhaust] (smoke origin).
 */

const LOGO_H = (168 * 456) / 1528; // keep the wordmark's exact aspect ratio

function BusWheel({ cx, id }: { cx: number; id: string }) {
  return (
    <g data-wheel>
      <circle cx={cx} cy={180} r={34} fill="#0b0d11" />
      <circle cx={cx} cy={180} r={30} fill="none" stroke="#1c1f25" strokeWidth={2} />
      <circle cx={cx} cy={180} r={21} fill={`url(#${id}-gold)`} />
      <circle cx={cx} cy={180} r={16} fill="#0b1a38" />
      {[0, 72, 144, 216, 288].map((a) => (
        <rect key={a} x={cx - 1.6} y={164} width={3.2} height={16} rx={1.6} fill={`url(#${id}-gold)`} transform={`rotate(${a} ${cx} 180)`} />
      ))}
      <circle cx={cx} cy={180} r={5} fill={`url(#${id}-gold)`} />
    </g>
  );
}

const Bus = forwardRef<SVGSVGElement, { className?: string }>(function Bus({ className }, ref) {
  const id = useId().replace(/:/g, "");
  const windows = [34, 104, 174, 244, 314, 384];
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
        <ellipse cx="310" cy="214" rx="296" ry="7" fill="#000" opacity="0.45" />

        {/* body */}
        <path d="M30 20H566c16 0 26 10 30 26l14 104c2 16-6 30-24 30H22c-10 0-16-6-16-16V44C6 30 16 20 30 20z" fill="#efe8dc" />
        <path d="M30 20H566c9 0 16 3 21 9H9c4-6 12-9 21-9z" fill="#e2d8c6" />

        {/* window band */}
        <rect x={22} y={36} width={494} height={66} rx={8} fill="#0b1a38" />
        {windows.map((x) => (
          <rect key={x} x={x} y={42} width={62} height={54} rx={5} fill="#13254a" />
        ))}
        <path d="M578 40c6 0 9 3 10 8l9 62c1 6-2 9-7 9h-12V40z" fill="#0b1a38" />

        {/* gold belt line */}
        <rect x={6} y={108} width={514} height={4} fill="#c9973f" />
        <rect x={570} y={108} width={36} height={4} fill="#c9973f" />

        {/* skirt */}
        <path d="M6 164h604l1 2c0 8-6 14-16 14H22c-10 0-16-6-16-16z" fill="#1c1f25" />

        {/* wheel arches + wheels */}
        <path d="M106 180a42 42 0 0 1 84 0z" fill="#0f1115" />
        <path d="M430 180a42 42 0 0 1 84 0z" fill="#0f1115" />
        <BusWheel cx={148} id={id} />
        <BusWheel cx={472} id={id} />

        {/* front door */}
        <rect x={522} y={34} width={46} height={130} rx={3} fill="#0b1a38" />
        <rect x={526} y={40} width={17} height={118} rx={2} fill="#13254a" />
        <rect x={547} y={40} width={17} height={118} rx={2} fill="#13254a" />

        {/* lights */}
        <rect x={598} y={140} width={10} height={14} rx={3} fill="#f6de9a" />
        <rect x={6} y={128} width={6} height={22} rx={2} fill="#b3261e" />
        <rect x={0} y={168} width={10} height={5} rx={2} fill="#0f1115" />
        <circle data-exhaust cx={1} cy={170.5} r={1} fill="none" />
      </g>

      {/* side logo */}
      <g data-logo>
        <Wordmark x={226} y={116} width={168} height={LOGO_H} title="" />
        {/* exact logo box, used to measure the zoom target */}
        <rect data-logo-box x={226} y={116} width={168} height={LOGO_H} fill="none" />
      </g>
    </svg>
  );
});

export default Bus;
