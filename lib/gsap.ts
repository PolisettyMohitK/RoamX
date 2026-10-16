"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, useGSAP);
// Phone address bars resize the viewport while scrolling; re-measuring then makes pinned scenes jump.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };


