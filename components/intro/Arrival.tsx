"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/components/SmoothScroll";
import { Wordmark } from "@/components/brand/Logo";
import { buildPlane, svgTexture, emblemTexture, DECAL_W, DECAL_H, GEAR_H, MAIN_GEAR_Z, WINGSPAN } from "./takeoffScene";
import { buildAirfield, HAZE } from "./airfield";

const SEEN_KEY = "roamx-arrived";
const FOV = 38;
const EYE = 1.7; // camera height: a person standing on the runway centre line
const T_HAND = 4.6; // seconds from start to the overhead moment
const PITCH = THREE.MathUtils.degToRad(20); // climb attitude
const CLIMB = THREE.MathUtils.degToRad(17); // flight path at the overhead moment (a little under the attitude)
const TRACK = 0.4; // how quickly the gaze stops following once the logo is handed off (s)
const FADE = 0.22; // painted logo → identical DOM copy

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function markArrived() {
  (window as unknown as { __roamxArrived?: boolean }).__roamxArrived = true;
  window.dispatchEvent(new Event("roamx:arrived"));
}

/*
 * Intro, seen by someone standing on a runway at blue-hour dusk. A RoamX jet rolls straight at the camera,
 * rotates and lifts off, pitching up steadily as it climbs. The viewer's gaze follows it up until it passes overhead,
 * belly square to the camera with ROAMX painted across its underside. Looking up, the sky deepens into the site's
 * metallic navy; the logo stays at the centre and grows into the hero logo while the jet climbs out of frame, and the
 * overlay then drops with no visible change.
 */
export default function Arrival() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current!;
      // After the hand-off, glide slowly down until the doors are fully open and the hero copy is in.
      // Only from the very top: never pull back someone whose scroll position the browser restored.
      const openHero = (delay: number) =>
        gsap.delayedCall(delay, () => {
          const hero = document.getElementById("top");
          const l = getLenis();
          if (!hero || !l || l.scroll > 5 || window.scrollY > 5) return;
          l.scrollTo(hero.offsetTop + hero.offsetHeight - window.innerHeight, {
            duration: 4.6,
            easing: (t) => 0.5 - 0.5 * Math.cos(Math.PI * t),
          });
        });
      let cleanup = () => {};
      const finish = () => {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        getLenis()?.start();
        markArrived();
        // Unmount on the next frame so the hand-off frame itself does no extra work.
        requestAnimationFrame(() => {
          cleanup();
          setGone(true);
        });
      };
      const skip = () => {
        gsap.set(el, { autoAlpha: 0 });
        finish();
        openHero(0.35);
      };

      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}
      if (seen) return skip();

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return skip(); // no WebGL: go straight to the site
      }

      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      getLenis()?.stop();

      const q = gsap.utils.selector(el);
      const drop = q("[data-drop]")[0] as HTMLElement;
      const gl = q("[data-gl]")[0] as HTMLElement;
      const heroSvg = document.querySelector<SVGSVGElement>("[data-hero-logo]")!;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(vw, vh);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      gl.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const airfield = buildAirfield(renderer, vh);
      scene.add(airfield.group);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(airfield.envScene, 0.02).texture;
      scene.environment = env; // the dusk sky in the paint: cool blue above, the warm horizon glinting on the edges
      scene.environmentIntensity = 0.9;
      scene.add(new THREE.HemisphereLight(0x7f97c8, 0x161a26, 1.1));
      const afterglow = new THREE.DirectionalLight(0xffb27a, 1.1); // the sun just below the far horizon: a warm rim
      afterglow.position.set(10, 12, -120);
      scene.add(afterglow);
      const fill = new THREE.DirectionalLight(0xc9d6ff, 0.9); // cool fill from behind the viewer
      fill.position.set(-20, 25, 60);
      scene.add(fill);
      const belly = new THREE.DirectionalLight(0xfff1dc, 1.6); // airfield light on the underside as it passes overhead
      belly.position.set(-8, -40, 25);
      scene.add(belly);

      const camera = new THREE.PerspectiveCamera(FOV, vw / vh, 0.1, 9000);
      camera.position.set(0, EYE, 0);

      let frame = () => {};
      let alive = true;
      cleanup = () => {
        if (!alive) return;
        alive = false;
        gsap.ticker.remove(frame);
        env.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };

      // --- screen-space helpers ---
      const fpx = vh / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)); // focal length in px
      const toScreen = (p: THREE.Vector3) => {
        p.project(camera);
        return { x: ((p.x + 1) / 2) * vw, y: ((1 - p.y) / 2) * vh };
      };

      const start = contextSafe!(([logoTex, emblem]: [THREE.Texture, THREE.Texture | null]) => {
        if (!alive) return; // unmounted while the textures were loading
        const { plane, decal, retract, updateLights } = buildPlane(logoTex, emblem);
        scene.add(plane);
        const v = new THREE.Vector3();

        // The overhead moment: the gaze is tilted up to meet the belly square on, the belly logo sits on the
        // hero logo's centre, and the whole jet spans most of the screen width.
        const hero = heroSvg.getBoundingClientRect();
        const dist = (WINGSPAN * fpx) / ((vw < vh ? 1.15 : 0.9) * vw);
        const aHand = Math.PI / 2 - PITCH;
        camera.rotation.x = aHand;
        camera.updateMatrixWorld();
        const target = camera.localToWorld(
          new THREE.Vector3(
            ((hero.left + hero.width / 2 - vw / 2) * dist) / fpx,
            (-(hero.top + hero.height / 2 - vh / 2) * dist) / fpx,
            -dist,
          ),
        );
        plane.rotation.x = -PITCH;
        plane.updateMatrixWorld(true);
        const end = target.clone().sub(decal.getWorldPosition(v)); // the jet's origin at that moment

        // Flight path, by distance down the runway: the jet pivots on its main wheels as it rotates, lifts off,
        // and its climb steepens smoothly to CLIMB by the overhead moment.
        const ground = (th: number) => GEAR_H * Math.cos(th) - MAIN_GEAR_Z * Math.sin(th);
        const climbH = end.y - ground(PITCH);
        const zLift = end.z - (2 * climbH) / Math.tan(CLIMB);
        const zRot = zLift - 80;
        const z0 = zLift - 260;
        // Speed: from a standstill, quickest mid-roll, easing into a slow pass overhead, then away again.
        const vEnd = 0.45 * dist;
        const m = Math.min(0.5, (vEnd * T_HAND) / (end.z - z0));
        const zAt = (t: number) => {
          if (t <= T_HAND) {
            const u = t / T_HAND;
            return z0 + (end.z - z0) * ((1 - m) * smooth(0, 1, u) + m * u);
          }
          const d = t - T_HAND;
          return end.z + vEnd * d + 0.3 * dist * d * d;
        };
        scene.fog = new THREE.FogExp2(HAZE, 0.00055);

        const pose = (t: number) => {
          const z = zAt(t);
          // nose-up attitude grows steadily from rotation to the overhead moment, and keeps easing up after
          const th = t <= T_HAND ? PITCH * smooth(zRot, end.z, z) : PITCH + 0.07 * smooth(0, 1.2, t - T_HAND);
          const lift = Math.max(0, (z - zLift) / (end.z - zLift));
          plane.position.set(end.x, ground(th) + climbH * lift * lift, z);
          plane.rotation.x = -th;
          retract(Math.min(1, Math.max(0, (z - zLift - 15) / 120)));
          plane.updateMatrixWorld(true);
        };
        const elev = () => {
          decal.getWorldPosition(v);
          return Math.atan2(v.y - EYE, -v.z);
        };

        // The gaze starts low (the runway in the lower part of the frame), follows the jet up, and locks onto it
        // as it comes overhead, so the logo is all but still on screen at the hand-off.
        const a0 = Math.atan((0.2 * vh) / fpx);
        const e0 = THREE.MathUtils.degToRad(1);
        const eHand = Math.atan2(target.y - EYE, -target.z);
        const lead = aHand - eHand;
        pose(T_HAND - 0.01);
        const omega = (eHand - elev()) / 0.01;
        const gaze = (t: number, e: number) => {
          if (t > T_HAND) return aHand + omega * TRACK * (1 - Math.exp(-(t - T_HAND) / TRACK));
          const u = Math.min(1, Math.max(0, (e - e0) / (eHand - e0)));
          return a0 + (e + lead - a0) * (1 - (1 - u) ** 3);
        };

        const decalMat = decal.material as THREE.MeshPhysicalMaterial;
        const skyFade = airfield.skyUniforms.fade;
        const fadeFrom = THREE.MathUtils.degToRad(50);
        const fadeTo = aHand - THREE.MathUtils.degToRad(3);
        const corner = new THREE.Vector3();
        const decalRect = () => {
          const p = toScreen(decal.localToWorld(corner.set(-DECAL_W / 2, DECAL_H / 2, 0)));
          const r = toScreen(decal.localToWorld(corner.set(DECAL_W / 2, -DECAL_H / 2, 0)));
          return { left: Math.min(p.x, r.x), top: Math.min(p.y, r.y), width: Math.abs(r.x - p.x) };
        };
        const place = (r: { left: number; top: number; width: number }) =>
          Object.assign(drop.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px` });
        const frustum = new THREE.Frustum();
        const viewProj = new THREE.Matrix4();
        const box = new THREE.Box3();

        let stage: "fly" | "fade" | "grow" | "rest" = "fly";
        const t0 = gsap.ticker.time;
        frame = () => {
          const t = gsap.ticker.time - t0;
          pose(t);
          const z = plane.position.z;
          const a = gaze(t, elev());
          // the ground trembles a little as the jet thunders closer, and settles once it's airborne
          const rumble = 0.022 * smooth(0.6, 2.2, t) * (1 - smooth(zLift - 30, zLift + 30, z));
          camera.position.y = EYE + rumble * (Math.sin(t * 41) + 0.6 * Math.sin(t * 67.3));
          camera.rotation.set(a + rumble * 0.02 * Math.sin(t * 53.1), 0, rumble * 0.03 * Math.sin(t * 37.7));
          camera.updateMatrixWorld();
          skyFade.value = smooth(fadeFrom, fadeTo, a); // looking up, the sky deepens into the site's navy
          updateLights(t, camera.position);

          if (stage === "fly" && t >= T_HAND) {
            // hand the painted logo to an identical DOM copy, riding with the jet while they cross-fade
            stage = "fade";
            gsap.to(drop, { autoAlpha: 1, duration: FADE, ease: "none" });
            gsap.to(decalMat, { opacity: 0, duration: FADE, ease: "none" });
          }
          if (stage === "fade") {
            place(decalRect());
            if (t >= T_HAND + FADE) {
              // then rest at the centre and grow into the hero logo while the jet climbs away
              stage = "grow";
              gsap.to(drop, {
                left: hero.left,
                top: hero.top,
                width: hero.width,
                duration: 1.4,
                ease: "power2.inOut",
                onComplete: () => {
                  place(heroSvg.getBoundingClientRect()); // exact, unrounded
                  stage = "rest";
                },
              });
            }
          }

          renderer.render(scene, camera);

          if (stage === "rest") {
            frustum.setFromProjectionMatrix(viewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
            if (!frustum.intersectsBox(box.setFromObject(plane)) || t > T_HAND + 4) {
              // The logo now sits exactly over the hero's logo, on the same navy: drop the overlay in the same frame.
              gsap.ticker.remove(frame);
              gsap.set(el, { autoAlpha: 0 });
              finish();
              openHero(0.05);
            }
          }
        };

        pose(0);
        gsap.ticker.add(frame);
        gsap.fromTo(gl, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "sine.out" });
      });

      Promise.all([svgTexture(heroSvg), emblemTexture()]).then(start).catch(skip);
      return () => cleanup();
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="metal-dark fixed inset-0 z-[70] overflow-hidden" aria-hidden>
      <div data-gl className="absolute inset-0" />
      {/* the belly logo after it leaves the plane */}
      <div data-drop className="invisible absolute">
        <Wordmark className="w-full" title="" />
      </div>
    </div>
  );
}
