"use client";

import { Fragment, useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Defs } from "@/components/brand/Logo";
import { CONTINENTS_2X, PLANE, RING, SWOOSH, SWOOSH_LINE } from "@/lib/logo-paths";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { problem, problemGlobe, problemHighlights, steps, stepsLine } from "@/lib/content";

const TITLE = "text-gold font-display font-extrabold leading-none tracking-[-0.045em] whitespace-nowrap";

// The plane sits on the logo with its tail at (705, 232), heading -36.9°; its middle is 89 units along the body.
const PLANE_MID = { x: 776.2, y: 178.6 };
// One loop around the globe that leaves and returns along the plane's own heading.
const ORBIT =
  "M776.2 178.6 C 816 149, 690 175, 530 215 C 400 248, 345 330, 352 415 C 360 510, 470 575, 590 548 C 700 523, 728 215, 776.2 178.6";
// The continents repeat every SPIN_PERIOD units, so sliding them reads as the globe turning.
const SPIN_PERIOD = 250;

/**
 * The logo globe, laid out by its ring: the element's box is the ring (294 × 278 emblem units), and the
 * swoosh and plane spill outside it. `planeRef` lets the plane fly; `[data-spin]` turns the globe.
 */
function GlobeMark({ planeRef }: { planeRef?: React.Ref<SVGGElement> }) {
  const id = useId().replace(/:/g, "");
  const gold = `url(#${id}-gold)`;
  return (
    <svg
      viewBox="318 112 540 440"
      className="pointer-events-none absolute overflow-visible"
      style={{ width: `${(540 / 294) * 100}%`, height: `${(440 / 278) * 100}%`, left: `${(-49 / 294) * 100}%`, top: `${(-145 / 278) * 100}%` }}
      aria-hidden
    >
      <Defs id={id} />
      <clipPath id={`${id}-globe`}>
        <ellipse cx="514" cy="396" rx="124" ry="118" />
      </clipPath>
      <path fillRule="evenodd" fill={gold} d={RING} />
      <ellipse cx="514" cy="396" rx="124" ry="118" fill="#050d1e" />
      <ellipse cx="514" cy="396" rx="119" ry="115" fill={`url(#${id}-navy)`} />
      <g clipPath={`url(#${id}-globe)`}>
        <g data-spin>
          <path d={CONTINENTS_2X} fill={gold} transform="scale(0.5)" />
          <path d={CONTINENTS_2X} fill={gold} transform={`translate(${-SPIN_PERIOD} 0) scale(0.5)`} />
        </g>
      </g>
      <path fill={gold} d={SWOOSH} />
      <path fill="none" stroke="#0b1a38" strokeWidth="3.5" strokeLinecap="round" d={SWOOSH_LINE} />
      <g ref={planeRef} transform={`translate(${PLANE_MID.x} ${PLANE_MID.y}) rotate(-36.9)`}>
        <path fill={gold} d={PLANE} transform="translate(-89 0)" />
      </g>
    </svg>
  );
}

/*
 * One pinned story. The problem line appears word by word, with the logo globe as the "o" in one of its words.
 * Then the navy stage opens as a circle from the centre while the globe lifts off the word and flies to the
 * middle, growing to stage size. There it turns, its plane flies a loop around it and comes home, and
 * "Buy. Brand. Learn. Earn." plays out.
 */
export default function Story() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const plane = useRef<SVGGElement>(null);
  const words = problem.split(" ");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const st = stage.current!;
      const inline = q("[data-o]")[0] as HTMLElement;
      const flyer = q("[data-flyer]")[0] as HTMLElement;
      const land = q("[data-land]")[0] as HTMLElement;

      // geometry, in the stage's coordinates (measured on refresh, so resizes stay exact)
      const box = (el: Element) => {
        const r = el.getBoundingClientRect();
        const s = st.getBoundingClientRect();
        return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, w: r.width, h: r.height };
      };

      gsap.set(flyer, { autoAlpha: 0, xPercent: -50, yPercent: -50 });
      // turn the plane about its own middle (the group's origin), not its bounding box's corner
      const pb = plane.current!.getBBox();
      gsap.set(plane.current, { transformOrigin: `${-pb.x}px ${-pb.y}px` });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      });

      // A: the line appears, one word at a time
      tl.fromTo(q("[data-word]"), { opacity: 0, yPercent: 35 }, { opacity: 1, yPercent: 0, stagger: 0.014, duration: 0.05, ease: "power2.out" }, 0.01)
        .to({}, { duration: 0.02 }, 0.33);

      // B: the stage opens from the centre; the globe lifts off the word and flies to the middle
      tl.set(inline, { autoAlpha: 0 }, 0.37)
        .set(flyer, { autoAlpha: 1, width: () => box(land).w, height: () => box(land).h }, 0.37)
        .fromTo(
          flyer,
          { x: () => box(inline).x, y: () => box(inline).y, scale: () => box(inline).w / box(land).w },
          { x: () => box(land).x, y: () => box(land).y, scale: 1, duration: 0.22, ease: "power2.inOut" },
          0.37,
        )
        .fromTo(
          q("[data-dark]"),
          { clipPath: "circle(0px at 50% 50%)" },
          { clipPath: () => `circle(${Math.hypot(st.offsetWidth, st.offsetHeight) / 2 + 2}px at 50% 50%)`, duration: 0.22, ease: "power2.inOut" },
          0.37,
        )
        // C: its plane flies a loop around the globe and comes home
        .to(plane.current, { motionPath: { path: ORBIT, autoRotate: true }, duration: 0.28, ease: "sine.inOut" }, 0.62);

      q("[data-travel]").forEach((el) => {
        if (!el.offsetParent) return; // hidden at this breakpoint
        tl.fromTo(
          el,
          { x: () => window.innerWidth - (el.getBoundingClientRect().left - (gsap.getProperty(el, "x") as number)) },
          { x: 0, duration: 0.24, ease: "power1.out" },
          0.6,
        );
      });
      q("[data-step]").forEach((w, i) => {
        tl.fromTo(w, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.03, ease: "power2.out" }, 0.7 + i * 0.06);
      });
      tl.to({}, { duration: 0.02 }, 0.98);

      // both globes (in the word and in flight) turn together, always, but only while the section is on screen
      gsap.to(q("[data-spin]"), {
        x: SPIN_PERIOD,
        duration: 14,
        ease: "none",
        repeat: -1,
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="how" data-pin data-stops="0,0.35,0.6,0.92,1" className="relative h-[560svh] bg-navy-950">
      <div ref={stage} className="sticky top-0 isolate h-svh overflow-hidden">
        {/* A: the problem line, on ivory */}
        <div className="absolute inset-0 flex items-center bg-ivory-50">
          <AmbientBackground />
          <p className="relative mx-auto max-w-[1180px] px-5 font-display text-[clamp(34px,5.6vw,84px)] font-semibold leading-[1.06] tracking-[-0.03em] text-navy-800 sm:px-10">
            {words.map((w, i) => (
              <Fragment key={i}>
                <span
                  data-word
                  style={{ opacity: 0 }}
                  className={`inline-block ${problemHighlights.includes(w) ? "text-gold" : w === problemGlobe.word ? "whitespace-nowrap" : ""}`}
                >
                  {w === problemGlobe.word ? (
                    <>
                      {w.slice(0, problemGlobe.at)}
                      <span data-o className="relative mx-[0.02em] inline-block h-[0.58em] w-[0.613em] align-baseline">
                        <GlobeMark />
                      </span>
                      {w.slice(problemGlobe.at + 1)}
                    </>
                  ) : (
                    w
                  )}
                </span>{" "}
              </Fragment>
            ))}
          </p>
        </div>

        {/* B + C: the navy stage, opened as a circle from the centre */}
        <div
          data-dark
          className="metal-dark absolute inset-0 flex flex-col items-center justify-center px-5 text-ivory-50 [--ww:min(46vw,560px,56svh)] max-sm:[--ww:min(62vw,38svh)]"
          style={{ clipPath: "circle(0px at 50% 50%)" }}
        >
          <p data-travel className={`${TITLE} mb-7 text-[clamp(44px,15vw,72px)] sm:hidden`}>
            RoamX
          </p>

          <div className="relative grid aspect-square w-[var(--ww)] place-items-center">
            {/* the wordmark is centred on the ring, so RoamX and Evolve sit evenly either side of it */}
            <div className="pointer-events-none absolute left-1/2 top-[56.8%] w-max -translate-x-1/2 -translate-y-1/2 max-sm:hidden">
              <div data-travel className={`${TITLE} grid grid-cols-[1fr_auto_1fr] items-center text-[clamp(40px,6.5vw,150px)]`}>
                <span className="justify-self-end">RoamX</span>
                <span className="w-[calc(var(--ww)*0.6+10vw)]" />
                <span>Evolve</span>
              </div>
            </div>
            {/* where the globe lands: its ring, sized and centred on the screen, nudged down so the plane above it has room */}
            <div data-land className="aspect-[294/278] w-[60%] translate-y-[12%]" />
          </div>

          <p data-travel className={`${TITLE} mt-3 text-[clamp(44px,15vw,72px)] sm:hidden`}>
            Evolve
          </p>

          <div className="relative z-[3] mt-[clamp(24px,5svh,56px)] w-full max-w-[920px] text-center">
            <p className="font-display text-[clamp(28px,4vw,56px)] font-semibold leading-tight tracking-[-0.03em]">
              {steps.map((s) => (
                <Fragment key={s}>
                  <span data-step className="inline-block opacity-0">
                    {s}.
                  </span>{" "}
                </Fragment>
              ))}
            </p>
            <p className="mx-auto mt-4 max-w-[46ch] text-[clamp(15px,1.3vw,18px)] leading-relaxed text-ivory-50/60">{stepsLine}</p>
          </div>
        </div>

        {/* the globe in flight, above both layers */}
        <div data-flyer className="pointer-events-none absolute left-0 top-0 z-10">
          <GlobeMark planeRef={plane} />
        </div>
      </div>
    </section>
  );
}
