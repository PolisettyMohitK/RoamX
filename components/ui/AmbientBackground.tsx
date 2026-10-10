import { cn } from "@/lib/utils";

// Quiet life for ivory sections: slow-drifting gold route lines over a fine grain.
const ROUTES = [
  "M-50 520 C 220 430, 380 610, 640 480 S 1060 300, 1500 380",
  "M-50 180 C 260 260, 420 80, 720 160 S 1180 330, 1500 220",
  "M200 900 C 360 700, 620 760, 820 560 S 1200 420, 1500 120",
];

export default function AmbientBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("grain pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {ROUTES.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#c9973f"
            strokeOpacity={0.3}
            strokeWidth={1.2}
            strokeDasharray="2 10"
            strokeLinecap="round"
            className="animate-[route-drift_linear_infinite]"
            style={{ animationDuration: `${38 + i * 9}s`, animationDirection: i % 2 ? "reverse" : "normal" }}
          />
        ))}
      </svg>
    </div>
  );
}
