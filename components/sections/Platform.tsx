"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import ScaledScreen from "@/components/ui/ScaledScreen";
import DashboardScreen from "@/components/ui/DashboardScreen";
import TravellerAppScreen from "@/components/ui/TravellerAppScreen";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { business } from "@/lib/content";

/*
 * Device frames adapted from Great UI's Macbook Mockup and Mobile Mockup (great-ui.com),
 * re-skinned for RoamX: the lid opens with scroll and the screens run the RoamX product.
 */

function Laptop() {
  return (
    <div className="relative mx-auto w-full [perspective:2200px]">
      <div
        data-lid
        className="relative mx-auto w-[88%] origin-bottom rounded-t-[clamp(10px,1.8vw,22px)] bg-[#0b0f1c] p-[1.3%] pb-[1.6%] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] [transform-style:preserve-3d] will-change-transform"
      >
        <span className="absolute left-1/2 top-[0.55%] size-[0.45%] min-h-1 min-w-1 -translate-x-1/2 rounded-full bg-[#1d2438]" />
        <div className="overflow-hidden rounded-t-[clamp(4px,0.8vw,10px)]">
          <ScaledScreen width={1000} height={625}>
            <DashboardScreen />
          </ScaledScreen>
        </div>
      </div>
      <div className="relative mx-auto h-[clamp(9px,1.5vw,18px)] w-full rounded-b-[clamp(8px,1.4vw,18px)] bg-[linear-gradient(180deg,#ece7dd_0%,#cfc8bb_55%,#9f998c_100%)] shadow-[0_30px_60px_-20px_rgba(10,20,48,0.45)]">
        <span className="absolute left-1/2 top-0 h-[45%] w-[12%] -translate-x-1/2 rounded-b-lg bg-[#b9b2a5]" />
      </div>
    </div>
  );
}

function Phone() {
  return (
    <div className="relative rounded-[clamp(30px,3.6vw,46px)] bg-[#0b0f1c] p-[3.2%] shadow-[0_40px_80px_-30px_rgba(10,20,48,0.6),inset_0_0_0_1px_rgba(255,255,255,0.1)]">
      <span className="absolute -left-[1.5%] top-[18%] h-[6%] w-[1.5%] rounded-l bg-[#1d2438]" />
      <span className="absolute -left-[1.5%] top-[27%] h-[9%] w-[1.5%] rounded-l bg-[#1d2438]" />
      <span className="absolute -right-[1.5%] top-[24%] h-[12%] w-[1.5%] rounded-r bg-[#1d2438]" />
      <div className="relative overflow-hidden rounded-[clamp(24px,3vw,38px)]">
        <span className="absolute left-1/2 top-[1.6%] z-10 h-[3.6%] w-[32%] -translate-x-1/2 rounded-full bg-[#0b0f1c]" />
        <ScaledScreen width={300} height={620}>
          <TravellerAppScreen />
        </ScaledScreen>
      </div>
    </div>
  );
}

export default function Platform() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-lid]"),
        { rotateX: -86 },
        {
          rotateX: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: q("[data-stage]")[0], start: "top 90%", end: "top 25%", scrub: 0.8 },
        },
      );
      gsap.from(q("[data-phone]"), {
        yPercent: 35,
        opacity: 0,
        ease: "power3.out",
        scrollTrigger: { trigger: q("[data-stage]")[0], start: "top 55%", end: "top 10%", scrub: 0.8 },
      });
      gsap.from(q("[data-head] > *"), {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-head]")[0], start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="business" className="relative overflow-hidden bg-ivory-100 pb-28 pt-28 sm:pb-40 sm:pt-36">
      <AmbientBackground />
      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-10">
        <div data-head className="mx-auto max-w-[760px] text-center">
          <h2 className="font-display text-[clamp(36px,5vw,72px)] font-semibold leading-[1.02] tracking-[-0.035em] text-navy-800">
            {business.headline}
          </h2>
          <p className="mt-5 text-[clamp(16px,1.4vw,19px)] text-navy-800/60">{business.sub}</p>
        </div>

        <div data-stage className="relative mx-auto mt-16 max-w-[1000px] sm:mt-20">
          <Laptop />
          <div
            data-phone
            className="relative z-10 mx-auto mt-10 w-[min(62vw,260px)] md:absolute md:-bottom-[12%] md:-right-[4%] md:mt-0 md:w-[21%]"
          >
            <Phone />
          </div>
        </div>
      </div>
    </section>
  );
}
