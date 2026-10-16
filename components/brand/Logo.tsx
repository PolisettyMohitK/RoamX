import { useId } from "react";
import { cn } from "@/lib/utils";
import { BLADE, CONTINENTS_2X, NAVY_FACES, PLANE, R_LEG, RING, SWOOSH, SWOOSH_LINE } from "@/lib/logo-paths";

/*
 * RoamX mark, rebuilt as vector from RoamX_logo.jpeg: navy brushed-metal letter faces with a gold rim,
 * a gold R leg, gold ring + continents, the orbit swoosh with its navy core line, the plane and the gold X blade.
 */

type SvgProps = React.SVGProps<SVGSVGElement> & { title?: string };

export function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fbe4a3" />
        <stop offset="0.3" stopColor="#dcab58" />
        <stop offset="0.55" stopColor="#f1cd80" />
        <stop offset="0.8" stopColor="#b8833a" />
        <stop offset="1" stopColor="#8e6025" />
      </linearGradient>
      <linearGradient id={`${id}-navy`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#14284f" />
        <stop offset="0.5" stopColor="#0b1a38" />
        <stop offset="1" stopColor="#06112a" />
      </linearGradient>
    </defs>
  );
}

function Globe({ id }: { id: string }) {
  const gold = `url(#${id}-gold)`;
  return (
    <>
      <path fillRule="evenodd" fill={gold} d={RING} />
      <ellipse cx="514" cy="396" rx="124" ry="118" fill="#050d1e" />
      <ellipse cx="514" cy="396" rx="119" ry="115" fill={`url(#${id}-navy)`} />
      <g transform="scale(0.5)">
        <path d={CONTINENTS_2X} fill={gold} />
      </g>
      <path fill={gold} d={SWOOSH} />
      <path fill="none" stroke="#0b1a38" strokeWidth="3.5" strokeLinecap="round" d={SWOOSH_LINE} />
      <path fill={gold} d={PLANE} transform="translate(705 232) rotate(-36.9)" />
    </>
  );
}

function a11y(title: string | undefined) {
  return title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };
}

export function Wordmark({ title = "RoamX", className, ...rest }: SvgProps) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="40 118 1528 456" className={cn("block", className)} {...a11y(title)} {...rest}>
      <Defs id={id} />
      <path d={NAVY_FACES} fill={`url(#${id}-navy)`} stroke={`url(#${id}-gold)`} strokeWidth="3.5" />
      <path d={R_LEG} fill={`url(#${id}-gold)`} />
      <Globe id={id} />
      <path d={BLADE} fill={`url(#${id}-gold)`} />
    </svg>
  );
}

export function Emblem({ title = "RoamX", ...rest }: SvgProps) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="318 112 540 440" {...a11y(title)} {...rest}>
      <Defs id={id} />
      <Globe id={id} />
    </svg>
  );
}

export function Lockup({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Wordmark className="w-full" />
      <div className="mt-[5%] flex w-full items-center gap-[4%]">
        <span className="bg-gold h-px flex-1" />
        <span className="text-gold pl-[0.75em] font-serif text-[clamp(11px,1.9vw,24px)] tracking-[0.75em]">EVOLVE</span>
        <span className="bg-gold h-px flex-1" />
      </div>
    </div>
  );
}
