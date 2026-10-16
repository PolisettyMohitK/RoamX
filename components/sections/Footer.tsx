"use client";

import { Wordmark } from "@/components/brand/Logo";
import { BLADE, NAVY_FACES, R_LEG, RING, SWOOSH } from "@/lib/logo-paths";
import { scrollToTarget } from "@/components/SmoothScroll";
import { footer, nav, site } from "@/lib/content";

const LABEL = "font-mono text-[12px] text-navy-800/45";
const LINK = "text-[15px] text-navy-800 transition-colors hover:text-[#9a6e2a]";

// The footer wordmark with a slow polished-gold highlight sweeping across its shapes.
function SheenWordmark() {
  return (
    <div className="relative">
      <Wordmark className="w-full" />
      <svg viewBox="40 118 1528 456" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <clipPath id="footer-mark">
            <path d={NAVY_FACES} />
            <path d={R_LEG} />
            <path d={RING} />
            <ellipse cx="514" cy="396" rx="124" ry="118" />
            <path d={SWOOSH} />
            <path d={BLADE} />
          </clipPath>
          <linearGradient id="footer-sheen" x1="0" x2="1">
            <stop offset="0" stopColor="#fff6dc" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff6dc" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g clipPath="url(#footer-mark)">
          <rect x="0" y="80" width="260" height="560" fill="url(#footer-sheen)" style={{ animation: "sheen 7s cubic-bezier(0.45,0,0.25,1) infinite" }} />
        </g>
      </svg>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ivory-50">
      <div className="mx-auto max-w-[1440px] px-6 pt-14 sm:px-10 sm:pt-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1fr_1fr_1.3fr]">
          <div>
            <p className={LABEL}>Explore</p>
            <ul className="mt-4 space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(n.href);
                    }}
                    className={LINK}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={LABEL}>Connect</p>
            <ul className="mt-4 space-y-2">
              {Object.entries(site.socials).map(([k, v]) => (
                <li key={k}>
                  <a href={v} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {k === "x" ? "X / Twitter" : k === "linkedin" ? "LinkedIn" : "Instagram"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className={LABEL}>Contact</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={`mailto:${site.email}`} className={LINK}>
                  {site.email}
                </a>
              </li>
              {footer.phone && (
                <li>
                  <a href={`tel:${footer.phone.replace(/\s/g, "")}`} className={LINK}>
                    {footer.phone}
                  </a>
                </li>
              )}
              {footer.address && <li className="whitespace-pre-line pt-2 text-[15px] text-navy-800/75">{footer.address}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-16 sm:mt-24">
          <SheenWordmark />
        </div>

        <div className="flex flex-col gap-3 pb-8 pt-6 text-[13px] text-navy-800/55 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex gap-6">
            {footer.legal.map((l) => (
              <a key={l.label} href={l.href} className="transition-colors hover:text-navy-800">
                {l.label}
              </a>
            ))}
          </span>
          <span className="font-mono text-[12px]">© 2026 RoamX</span>
        </div>
      </div>
    </footer>
  );
}
