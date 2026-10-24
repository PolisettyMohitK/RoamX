"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import ScaledScreen from "@/components/ui/ScaledScreen";
import PhoneFrame from "@/components/ui/PhoneFrame";
import { learn } from "@/lib/content";

const BEATS = [0.02, 0.22, 0.42, 0.62]; // where each photo takes over (share of the scroll)
const END = 0.82;
const SWAY = [0, 7, -6, 8]; // the phone's turn (deg) on each beat
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Where each notification lands around the phone: centred over it on phones, beside it on desktop.
const TOAST_POS = [
  "top-[78%] md:right-[86%] md:top-[30%]",
  "top-[68%] md:right-[86%] md:top-[46%]",
  "top-[62%] md:right-[86%] md:top-[16%]",
  "top-[73%] md:right-[86%] md:top-[40%]",
  "top-[84%] md:right-[86%] md:top-[64%]",
];
const TOASTS = learn.toasts.flatMap((list, beat) => list.map((text) => ({ text, beat })));

function Mark({ size = "size-9 text-[13px]" }: { size?: string }) {
  return <span className={`grid shrink-0 place-items-center rounded-[10px] bg-[#1f3a6e] font-display font-bold text-ivory-50 ${size}`}>NJ</span>;
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-[#e7c27a] px-2.5 py-1 font-display text-[13px] font-bold text-navy-900">{children}</span>;
}

// 1: their own portal, under their brand. TODO: swap for the client's dashboard screenshot when it arrives.
function HomeScreen() {
  return (
    <>
      <div data-in className="flex items-center gap-2 rounded-full bg-navy-800/[0.06] px-3 py-2 text-[12px] text-navy-800/55">
        <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="7" width="10" height="7" rx="1.5" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
        </svg>
        Your portal link
      </div>
      <div data-in className="mt-3 rounded-2xl border border-navy-800/10 bg-white px-4 py-3 text-[14px] text-navy-800/45">Where to?</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {["Flights", "Hotels"].map((t) => (
          <div key={t} data-in className="rounded-2xl bg-navy-800 px-4 pb-4 pt-12 font-display text-[18px] font-semibold text-ivory-50">
            {t}
          </div>
        ))}
        {["Buses", "Packages"].map((t) => (
          <div key={t} data-in className="rounded-2xl bg-navy-800/[0.07] px-4 py-3 font-display text-[14px] font-semibold">
            {t}
          </div>
        ))}
      </div>
      <div data-in className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
        <span className="grid size-8 place-items-center rounded-full bg-[#e7c27a]">
          <svg viewBox="0 0 16 16" className="ml-0.5 size-3 fill-navy-900">
            <path d="M4 2.5v11l9-5.5z" />
          </svg>
        </span>
        <span className="text-[13px] leading-tight">
          <span className="block font-semibold">Training</span>
          <span className="text-navy-800/55">Taking your first booking</span>
        </span>
      </div>
    </>
  );
}

// 2: a friend asks; you find the flight and book it
function BookScreen() {
  return (
    <div className="flex flex-col gap-2.5">
      <div data-in className="flex items-end gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#7a3b2e] text-[11px] font-bold text-ivory-50">R</span>
        <p className="rounded-[16px] rounded-bl-[4px] bg-white px-3.5 py-2.5 text-[14px] shadow-sm">{learn.enquiry}</p>
      </div>
      <div data-in className="rounded-2xl border border-navy-800/10 bg-white p-4">
        <div className="flex items-center justify-between font-display text-[18px] font-bold">
          <span>BLR</span>
          <span className="mx-2 h-px flex-1 border-t-2 border-dotted border-[#c9973f]" />
          <span>GOI</span>
        </div>
        <p className="mt-1 text-[12px] text-navy-800/55">Fri 07:40 · 2 seats · non-stop</p>
        <span data-press className="bg-gold mt-3 grid h-10 place-items-center rounded-xl text-[14px] font-semibold text-navy-900">
          Book for {learn.friend}
        </span>
      </div>
      <p data-in className="max-w-[85%] self-end rounded-[16px] rounded-br-[4px] bg-[#1f3a6e] px-3.5 py-2.5 text-[14px] text-ivory-50">{learn.reply}</p>
    </div>
  );
}

// 3: the ticket, under your brand, with your markup on top
function TicketScreen() {
  return (
    <div data-in className="rounded-3xl bg-white p-5 shadow-[0_20px_40px_-24px_rgba(10,20,48,0.4)]">
      <div className="flex items-center gap-2.5">
        <Mark size="size-7 text-[11px]" />
        <span className="font-display text-[15px] font-semibold">{learn.agency}</span>
        <span className="ml-auto text-[11px] font-semibold text-navy-800/45">E-ticket</span>
      </div>
      <div className="mt-6 flex items-end justify-between font-display font-bold">
        <span className="text-[40px] leading-none">BLR</span>
        <span className="mx-3 mb-3 h-px flex-1 border-t-2 border-dotted border-[#c9973f]" />
        <span className="text-[40px] leading-none">GOI</span>
      </div>
      <p className="mt-2 text-[12px] text-navy-800/55">{learn.friend} + 1 · Fri 07:40</p>
      <div className="mt-5 border-t border-dashed border-navy-800/15 pt-4 text-[13px]">
        <div className="flex justify-between text-navy-800/60">
          <span>Fare</span>
          <span>₹4,200</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold">Your markup</span>
          <span data-in>
            <Chip>+₹350</Chip>
          </span>
        </div>
      </div>
    </div>
  );
}

// 4: bookings keep coming
function ListScreen() {
  return (
    <div className="flex flex-col divide-y divide-navy-800/10 rounded-3xl bg-white px-4 shadow-sm">
      {learn.bookings.map((b) => (
        <div key={b.id} data-in className="flex items-center justify-between gap-3 py-3.5">
          <div>
            <p className="font-display text-[15px] font-semibold">{b.id}</p>
            <p className="text-[12px] text-navy-800/55">
              {b.kind} · {b.who}
            </p>
          </div>
          <Chip>+{inr(b.markup)}</Chip>
        </div>
      ))}
    </div>
  );
}

const SCREENS = [HomeScreen, BookScreen, TicketScreen, ListScreen];

// The portal's top bar: status bar, the brand, and what they've earned this month.
function PortalTop({ earned }: { earned?: React.Ref<HTMLSpanElement> }) {
  return (
    <>
      <div className="flex items-center justify-between px-7 pb-1 pt-4 text-[12px] font-semibold">
        <span>9:41</span>
        <span className="h-2.5 w-4 rounded-[3px] border border-navy-800/70" />
      </div>
      <div className="flex items-center gap-3 px-5 pt-3">
        <Mark />
        <span className="font-display text-[17px] font-semibold">{learn.agency}</span>
      </div>
      <div className="mx-4 mt-4 flex items-baseline justify-between rounded-2xl bg-navy-900 px-4 py-3 text-ivory-50">
        <span className="text-[12px] text-ivory-50/55">Earned this month</span>
        <span ref={earned} className="font-display text-[22px] font-semibold text-gold-200">
          {inr(0)}
        </span>
      </div>
    </>
  );
}

const SCREEN = "flex h-[620px] w-[300px] flex-col bg-ivory-100 text-navy-800";

/** The story's first screen on its own, for the dashboard section's phone to turn into as it flies down. */
export function PortalHome() {
  return (
    <div className={SCREEN}>
      <PortalTop />
      <div className="relative mt-4 flex-1 overflow-hidden px-4">
        <HomeScreen />
      </div>
    </div>
  );
}

/*
 * "Student to entrepreneur" as a photo story. A phone sits in the middle of each photo and walks through
 * the portal — your brand, a booking, the ticket, more bookings — while notifications pop out of it.
 * The last frame turns "Student" into "Entrepreneur".
 */
export default function Learn() {
  const root = useRef<HTMLElement>(null);
  const earned = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const photos = q("[data-photo]");
      const screens = q("[data-screen]");
      const caps = q("[data-cap]");
      const toasts = q("[data-toast]");
      const phone = q("[data-phone]")[0];
      const tally = { v: 0 };
      gsap.set(photos.slice(1), { autoAlpha: 0 });
      gsap.set(screens.slice(1), { xPercent: 100 });
      gsap.set(caps, { autoAlpha: 0, y: 18 });
      gsap.set(toasts, { autoAlpha: 0, scale: 0.6, y: 24 });
      gsap.set(phone, { rotationY: SWAY[0] });
      gsap.set(q("[data-to], [data-training]"), { autoAlpha: 0, y: 18, filter: "blur(6px)" });
      gsap.set(q("[data-from]"), { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 },
      });
      const stops = [...BEATS, END];
      photos.forEach((p, i) => {
        const at = stops[i];
        if (i > 0) tl.to(p, { autoAlpha: 1, duration: 0.06, ease: "sine.inOut" }, at - 0.04);
        tl.fromTo(p.firstElementChild, { scale: 1.12 }, { scale: 1, duration: 0.26, ease: "none" }, Math.max(0, at - 0.04));
      });

      // the phone (handed over from the dashboard section) turns a little on every beat, and leaves before the last frame
      BEATS.slice(1).forEach((at, i) => tl.to(phone, { rotationY: SWAY[i + 1], duration: 0.08, ease: "sine.inOut" }, at - 0.03));
      tl.to(phone, { autoAlpha: 0, y: -60, scale: 0.92, duration: 0.05, ease: "power2.in" }, END - 0.04);

      screens.forEach((s, i) => {
        const at = BEATS[i];
        if (i > 0) {
          tl.to(screens[i - 1], { xPercent: -30, autoAlpha: 0, duration: 0.05, ease: "power2.inOut" }, at - 0.02);
          tl.to(s, { xPercent: 0, duration: 0.05, ease: "power2.inOut" }, at - 0.02);
        }
        // the first screen arrives already filled in, as the dashboard section's phone showed it
        if (i > 0) tl.from(s.querySelectorAll("[data-in]"), { autoAlpha: 0, y: 14, stagger: 0.006, duration: 0.03 }, at + 0.03);
      });
      // the "Book" button gets tapped
      tl.to(q("[data-press]"), { scale: 0.93, duration: 0.012, yoyo: true, repeat: 1, ease: "power1.inOut" }, BEATS[1] + 0.1);

      caps.forEach((c, i) => {
        tl.to(c, { autoAlpha: 1, y: 0, duration: 0.04 }, BEATS[i] + 0.04).to(c, { autoAlpha: 0, y: -18, duration: 0.03 }, stops[i + 1] - 0.05);
      });

      // notifications pop out of the phone, then clear before the next beat
      TOASTS.forEach((t, k) => {
        const nth = TOASTS.filter((o, j) => o.beat === t.beat && j < k).length;
        // in by 0.78 at the latest, so every one is out again with the phone
        tl.to(toasts[k], { autoAlpha: 1, scale: 1, y: 0, duration: 0.04, ease: "back.out(1.7)" }, BEATS[t.beat] + 0.08 + nth * 0.02);
        tl.to(toasts[k], { autoAlpha: 0, y: -20, duration: 0.03, ease: "power2.in" }, stops[t.beat + 1] - 0.04);
      });

      // the phone's earnings figure follows the bookings
      learn.earned.forEach((v, i) => {
        if (i === 0 || v === learn.earned[i - 1]) return;
        tl.to(tally, { v, duration: 0.06, ease: "power1.out", onUpdate: () => (earned.current!.textContent = inr(Math.round(tally.v))) }, BEATS[i] + 0.08);
      });

      // Handoff: as this section scrolls up to the top, the dashboard section's phone flies from its spot into
      // this phone's spot (both rects read live, so it tracks the scroll), turning into the portal home on the
      // way. At the top this phone takes over; scrolling back up hands it back.
      const from = document.querySelector<HTMLElement>("[data-handoff]");
      const slot = q("[data-phone-slot]")[0];
      if (from) {
        const box = from.parentElement!;
        const layer = from.querySelector<HTMLElement>("[data-handoff-screen]")!;
        const ease = gsap.parseEase("power2.inOut");
        const fly = (st: ScrollTrigger) => {
          const p = st.progress;
          const done = p >= 1;
          slot.style.visibility = done ? "visible" : "hidden";
          from.style.visibility = done ? "hidden" : "";
          if (p <= 0) {
            gsap.set(from, { clearProps: "transform" });
            layer.style.opacity = "0";
            return;
          }
          const a = box.getBoundingClientRect();
          const b = slot.getBoundingClientRect();
          const e = ease(Math.min(p, 1));
          gsap.set(from, {
            x: (b.left - a.left) * e,
            y: (b.top - a.top) * e,
            scale: 1 + (b.width / a.width - 1) * e,
            transformOrigin: "0 0",
          });
          layer.style.opacity = String(gsap.utils.clamp(0, 1, (p - 0.2) / 0.2));
        };
        const st = ScrollTrigger.create({ trigger: root.current, start: "top bottom", end: "top top", onUpdate: fly, onRefresh: fly });
        fly(st);
      } else slot.style.visibility = "visible";

      // the student becomes an entrepreneur
      tl.to(q("[data-from]"), { autoAlpha: 1, y: 0, duration: 0.04 }, END + 0.02)
        .to(q("[data-from]"), { autoAlpha: 0, y: -18, filter: "blur(6px)", duration: 0.04 }, END + 0.08)
        .to(q("[data-to]"), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.05 }, END + 0.1)
        .to(q("[data-training]"), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.04 }, END + 0.13)
        .to({}, { duration: 0.02 }, 0.98);
    },
    { scope: root },
  );

  const photos = [...learn.beats, learn.end];

  return (
    <section ref={root} id="learn" data-pin data-stops="0,0.13,0.33,0.53,0.73,0.96,1" className="relative h-[520svh] bg-navy-950 text-ivory-50">
      <div className="sticky top-0 h-svh overflow-hidden">
        {photos.map((p) => (
          <div key={p.image} data-photo className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0">
              <Image src={p.image} alt={p.alt} fill quality={82} sizes="100vw" className="object-cover" style={{ objectPosition: p.pos }} />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 bg-navy-950/50" />

        <div className="relative mx-auto flex h-full max-w-[1180px] flex-col px-5 pb-24 pt-24 md:pb-[clamp(28px,6svh,72px)] [text-shadow:0_2px_24px_rgb(7_15_36/0.6)] sm:px-10">
          <h2 className="max-w-[16ch] font-display text-[clamp(26px,3.2vw,46px)] font-semibold leading-[1.05] tracking-[-0.03em]">{learn.headline}</h2>

          {/* one plain line per beat */}
          <div className="relative mt-auto h-[3.5em] text-[clamp(19px,2.3vw,34px)] md:h-[2.4em]">
            {learn.beats.map((b) => (
              <p key={b.caption} data-cap className="absolute inset-x-0 bottom-0 max-w-[26ch] font-display font-semibold leading-[1.15] tracking-[-0.02em] md:max-w-[22ch]">
                {b.caption}
              </p>
            ))}
          </div>
        </div>

        {/* the phone, with notifications popping out of it */}
        <div className="absolute left-1/2 top-[50%] w-[min(56vw,215px,27svh)] -translate-x-1/2 -translate-y-1/2 [perspective:1400px] md:left-[76%] md:w-[clamp(240px,40svh,340px)]">
          <div data-phone-slot className="invisible">
            <div data-phone>
              <PhoneFrame>
                <ScaledScreen width={300} height={620}>
                  <div className={SCREEN}>
                    <PortalTop earned={earned} />
                    <div className="relative mt-4 flex-1 overflow-hidden">
                      {SCREENS.map((S, i) => (
                        <div key={i} data-screen className="absolute inset-0 px-4">
                          <S />
                        </div>
                      ))}
                    </div>
                  </div>
                </ScaledScreen>
              </PhoneFrame>
            </div>
          </div>

          {TOASTS.map((t, k) => (
            <div
              key={t.text}
              data-toast
              className={`absolute left-1/2 z-10 w-max max-w-[78vw] -translate-x-1/2 rounded-2xl bg-ivory-50 px-4 py-3 text-[14px] font-semibold text-navy-800 shadow-[0_24px_50px_-18px_rgb(0_0_0/0.6)] md:translate-x-0 md:max-w-[300px] md:text-[15px] ${TOAST_POS[k]} ${TOAST_POS[k].includes("md:right") ? "md:left-auto" : ""}`}
            >
              <span className="mr-2 inline-block size-2 rounded-full bg-[#d4a54e] align-middle" />
              {t.text}
            </div>
          ))}
        </div>

        {/* the last frame: Student → Entrepreneur */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center px-5 text-center">
          <div className="relative">
            <p data-from className="absolute inset-x-0 top-0 font-display text-[clamp(40px,7vw,110px)] font-bold leading-none tracking-[-0.04em] text-ivory-50/80 [text-shadow:0_2px_30px_rgb(7_15_36/0.7)]">
              {learn.from}
            </p>
            <p data-to className="text-gold font-display text-[clamp(44px,9vw,140px)] font-extrabold leading-none tracking-[-0.045em] pb-[0.08em]">
              {learn.to}
            </p>
            <p data-training className="mt-4 text-[clamp(16px,1.4vw,20px)] text-ivory-50/85 [text-shadow:0_2px_20px_rgb(7_15_36/0.8)]">
              {learn.training}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
