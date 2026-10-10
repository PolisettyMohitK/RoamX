import * as THREE from "three";

/*
 * The RoamX jet for the takeoff intro, modelled in code. Units are metres.
 * Plane local axes: nose points +z, up is +y; the port (red light) wing is +x.
 */

export const DECAL_W = 13; // belly wordmark width (m): fits the flat underside between the engines
export const DECAL_H = (DECAL_W * 456) / 1528; // exact wordmark ratio
export const GEAR_H = 5.1; // fuselage centre height when the wheels are on the runway
export const MAIN_GEAR_Z = -3; // main wheels; the jet pivots on them as it rotates
const SEMI = 17.4; // half span at the wing tip
export const WINGSPAN = 2 * SEMI + 0.8; // with the winglets

const A0 = -25; // tail tip
const A1 = 21.8; // nose tip
const LEN = A1 - A0;
const R = 2; // fuselage radius

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// --- paint and metals ---
const paint = (p: THREE.MeshPhysicalMaterialParameters) =>
  new THREE.MeshPhysicalMaterial({ roughness: 0.34, metalness: 0.04, clearcoat: 0.85, clearcoatRoughness: 0.14, ...p });
const IVORY = paint({ color: 0xf1ebe1 });
const NAVY = paint({ color: 0x0c1a3a, roughness: 0.3, metalness: 0.25 });
const GOLD = new THREE.MeshPhysicalMaterial({ color: 0xd9ab57, metalness: 1, roughness: 0.24, clearcoat: 0.4 });
const STEEL = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, metalness: 1, roughness: 0.32 });
const TITANIUM = new THREE.MeshStandardMaterial({ color: 0x41464f, metalness: 1, roughness: 0.4 });
const RUBBER = new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.92 });
const VOID = new THREE.MeshBasicMaterial({ color: 0x030408 });

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}
function canvasTexture(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// NACA-style thickness distribution, normalised to 1 at 30% chord
const airfoil = (s: number) => 10 * (0.2969 * Math.sqrt(s) - 0.126 * s - 0.3516 * s * s + 0.2843 * s ** 3 - 0.1015 * s ** 4);

// ---------------------------------------------------------------------------------------------
// Fuselage livery: u runs round the body (0 = belly, 0.25 = +x side, 0.5 = top), v runs tail → nose.
// ---------------------------------------------------------------------------------------------
function fuselageLivery() {
  const W = 1024;
  const H = 4096;
  const [c, g] = canvas(W, H);
  const Y = (a: number) => ((A1 - a) / LEN) * H; // nose at the top of the canvas
  const U = (y: number, side: 1 | -1) => {
    const u = Math.acos(Math.max(-1, Math.min(1, -y / R))) / (Math.PI * 2);
    return (side > 0 ? u : 1 - u) * W;
  };
  const perM = H / LEN;

  g.fillStyle = "#f2ece2";
  g.fillRect(0, 0, W, H);

  // panel lines: hoops every couple of metres and a few long seams
  g.strokeStyle = "rgba(96,86,74,0.22)";
  g.lineWidth = 1.5;
  for (let a = -20; a < 18; a += 2.1) {
    g.beginPath();
    g.moveTo(0, Y(a));
    g.lineTo(W, Y(a));
    g.stroke();
  }
  for (const y of [1.45, -1.2]) {
    for (const s of [1, -1] as const) {
      g.beginPath();
      g.moveTo(U(y, s), Y(17));
      g.lineTo(U(y, s), Y(-19));
      g.stroke();
    }
  }

  for (const s of [1, -1] as const) {
    // gold cheatline with a fine navy pinstripe under it
    g.fillStyle = "#c99a45";
    const top = U(-0.02, s);
    const bot = U(-0.22, s);
    g.fillRect(Math.min(top, bot), Y(18.2), Math.abs(bot - top), Y(-19.5) - Y(18.2));
    g.fillStyle = "#14254d";
    const p = U(-0.3, s);
    g.fillRect(p - 2, Y(18.2), 4, Y(-19.5) - Y(18.2));

    // cabin windows
    const wu = U(0.62, s);
    const wh = (0.36 / (Math.PI * 2 * R)) * W;
    const ww = 0.25 * perM;
    for (let a = 12.4; a > -13.6; a -= 0.53) {
      if (Math.abs(a - -0.8) < 0.7) continue; // over-wing exit
      g.fillStyle = "#0c1526";
      g.beginPath();
      g.roundRect(wu - wh / 2, Y(a) - ww / 2, wh, ww, 8);
      g.fill();
      g.strokeStyle = "rgba(255,255,255,0.18)";
      g.lineWidth = 1.2;
      g.stroke();
    }

    // doors
    const door = (a: number, wM: number, hM: number, y: number) => {
      const du = U(y, s);
      const dh = (hM / (Math.PI * 2 * R)) * W;
      g.strokeStyle = "rgba(70,62,52,0.55)";
      g.lineWidth = 2.2;
      g.beginPath();
      g.roundRect(du - dh / 2, Y(a) - (wM * perM) / 2, dh, wM * perM, 10);
      g.stroke();
    };
    door(13.6, 1.05, 1.9, 0.25);
    door(-15.4, 1.05, 1.9, 0.25);
    door(-0.8, 0.55, 0.95, 0.55);

    // cockpit side windows and windscreen
    g.fillStyle = "#0a1222";
    const cock = (pts: [number, number][]) => {
      g.beginPath();
      pts.forEach(([u, a], i) => {
        const x = (s > 0 ? u : 1 - u) * W;
        if (i) g.lineTo(x, Y(a));
        else g.moveTo(x, Y(a));
      });
      g.closePath();
      g.fill();
    };
    cock([
      [0.33, 19.35],
      [0.375, 19.75],
      [0.375, 19.15],
      [0.335, 18.85],
    ]);
    cock([
      [0.385, 19.8],
      [0.44, 20.25],
      [0.44, 19.7],
      [0.385, 19.2],
    ]);
    cock([
      [0.45, 20.3],
      [0.495, 20.55],
      [0.495, 20.0],
      [0.45, 19.75],
    ]);

    // registration, painted along the rear fuselage
    g.save();
    g.translate(U(0.95, s), Y(-11.5));
    g.rotate(s > 0 ? Math.PI / 2 : -Math.PI / 2);
    g.fillStyle = "#1b2a4f";
    g.font = "600 30px Arial, sans-serif";
    g.fillText("VT-RMX", 0, 0);
    g.restore();
  }
  return canvasTexture(c);
}

function fuselage() {
  const prof = new THREE.SplineCurve(
    (
      [
        [0.02, A0],
        [0.4, -24.5],
        [0.95, -22.4],
        [1.5, -19.5],
        [1.88, -16],
        [2, -13],
        [2, 0],
        [2, 14],
        [1.95, 16.2],
        [1.78, 18.2],
        [1.45, 19.8],
        [1.0, 20.9],
        [0.5, 21.5],
        [0.02, A1],
      ] as const
    ).map(([r, a]) => new THREE.Vector2(r, a)),
  ).getPoints(140);
  const SEG = 96;
  const geo = new THREE.LatheGeometry(prof, SEG);
  geo.rotateX(Math.PI / 2); // lathe axis → +z; seam (u = 0) along the belly
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const a = pos.getZ(i);
    uv.setY(i, (a - A0) / LEN);
    // tail cone sweeps up (top stays level), nose droops a touch
    const up = a < -13 ? 1.75 * ((-13 - a) / 12) ** 2 : 0;
    const droop = a > 15 ? 0.22 * ((a - 15) / 6.8) ** 2 : 0;
    pos.setY(i, pos.getY(i) + up - droop);
  }
  geo.computeVertexNormals();
  // weld the normals across the seam so the belly shades smoothly
  const P = prof.length;
  const n = geo.attributes.normal;
  for (let j = 0; j < P; j++) {
    const a = j;
    const b = SEG * P + j;
    const x = (n.getX(a) + n.getX(b)) / 2;
    const y = (n.getY(a) + n.getY(b)) / 2;
    const z = (n.getZ(a) + n.getZ(b)) / 2;
    n.setXYZ(a, x, y, z);
    n.setXYZ(b, x, y, z);
  }
  const livery = fuselageLivery();
  return new THREE.Mesh(geo, paint({ color: 0xffffff, map: livery, bumpMap: livery, bumpScale: 0.6 }));
}

// ---------------------------------------------------------------------------------------------
// Lifting surfaces, lofted between airfoil sections. `up`/`dn` split the thickness above/below the
// section's base line (wing roots are flat-bottomed so the belly logo lies flush).
// ---------------------------------------------------------------------------------------------
type Sec = { x: number; le: number; chord: number; t: number; y: number; up: number; dn: number };

function loft(secs: Sec[], side: 1 | -1, steps = 10) {
  const N = 22;
  const S = Array.from({ length: N }, (_, k) => (1 - Math.cos((Math.PI * k) / (N - 1))) / 2);
  const ring = [...S.slice().reverse().map((s) => [s, 1] as const), ...S.slice(1).map((s) => [s, -1] as const)];
  const stations: Sec[] = [];
  for (let i = 0; i < secs.length - 1; i++) {
    for (let k = 0; k < steps; k++) {
      const f = k / steps;
      const a = secs[i];
      const b = secs[i + 1];
      const l = (p: keyof Sec) => a[p] + (b[p] - a[p]) * f;
      stations.push({ x: l("x"), le: l("le"), chord: l("chord"), t: l("t"), y: l("y"), up: l("up"), dn: l("dn") });
    }
  }
  stations.push(secs[secs.length - 1]);
  const span = stations[stations.length - 1].x - stations[0].x;
  const pos: number[] = [];
  const uvs: number[] = [];
  for (const st of stations) {
    for (const [s, face] of ring) {
      const th = st.t * airfoil(s);
      pos.push(side * st.x, face > 0 ? st.y + st.up * th : st.y - st.dn * th, st.le - s * st.chord);
      uvs.push(s, (st.x - stations[0].x) / span);
    }
  }
  const M = ring.length;
  const idx: number[] = [];
  for (let r = 0; r < stations.length - 1; r++) {
    for (let k = 0; k < M - 1; k++) {
      const a = r * M + k;
      const b = a + M;
      const c = a + 1;
      const d = b + 1;
      if (side > 0) idx.push(a, c, b, c, d, b);
      else idx.push(a, b, c, c, b, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// wing paint: u = chord (leading edge at 0), v = span (root at 0)
function wingLivery() {
  const W = 1024;
  const H = 512;
  const [c, g] = canvas(W, H);
  const X = (s: number) => s * W;
  const Y = (v: number) => (1 - v) * H;
  g.fillStyle = "#ece6db";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#c7c5c1"; // bare-metal leading edge
  g.fillRect(0, 0, X(0.035), H);
  g.strokeStyle = "rgba(92,84,74,0.32)";
  g.lineWidth = 2;
  const line = (s0: number, v0: number, s1: number, v1: number) => {
    g.beginPath();
    g.moveTo(X(s0), Y(v0));
    g.lineTo(X(s1), Y(v1));
    g.stroke();
  };
  line(0.13, 0.28, 0.13, 0.97); // slats
  line(0.74, 0.02, 0.74, 0.62); // flaps
  line(0.78, 0.68, 0.78, 0.93); // aileron
  for (const v of [0.28, 0.46, 0.62, 0.68, 0.93]) line(0.74, v, 1, v);
  g.strokeStyle = "rgba(92,84,74,0.14)";
  g.lineWidth = 1.2;
  for (let v = 0.08; v < 1; v += 0.075) line(0.13, v, 0.74, v);
  return canvasTexture(c);
}

function extrudeZY(points: [number, number][], thick: number, mat: THREE.Material) {
  // shape drawn in (z, y), extruded along x and centred on x = 0
  const shape = new THREE.Shape(points.map(([z, y]) => new THREE.Vector2(-z, y)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 });
  geo.translate(0, 0, -thick / 2);
  geo.rotateY(Math.PI / 2);
  return new THREE.Mesh(geo, mat);
}

function engine(fanBlades: number) {
  const eng = new THREE.Group();
  const outer = new THREE.LatheGeometry(
    (
      [
        [0.98, -2.6],
        [1.12, -1.4],
        [1.24, 0.2],
        [1.27, 1.2],
        [1.22, 2.3],
        [1.12, 2.85],
        [1.0, 3.0],
        [0.93, 2.85],
        [0.92, 2.2],
      ] as const
    ).map(([r, a]) => new THREE.Vector2(r, a)),
    48,
  );
  outer.rotateX(Math.PI / 2);
  eng.add(new THREE.Mesh(outer, IVORY));
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.985, 0.06, 12, 48), GOLD);
  lip.position.z = 2.98;
  eng.add(lip);
  const fan = new THREE.Mesh(new THREE.CircleGeometry(0.93, 48), VOID);
  fan.position.z = 2.2;
  eng.add(fan);
  for (let i = 0; i < fanBlades; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.62, 0.2), TITANIUM);
    const pivot = new THREE.Group();
    blade.position.y = 0.58;
    blade.rotation.y = 0.55; // blade twist
    pivot.add(blade);
    pivot.rotation.z = (i / fanBlades) * Math.PI * 2;
    pivot.position.z = 2.24;
    eng.add(pivot);
  }
  const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.75, 32), GOLD);
  spinner.rotation.x = Math.PI / 2;
  spinner.position.z = 2.62;
  eng.add(spinner);
  const core = new THREE.LatheGeometry(
    (
      [
        [0.98, -2.55],
        [0.72, -2.7],
        [0.6, -3.4],
      ] as const
    ).map(([r, a]) => new THREE.Vector2(r, a)),
    40,
  );
  core.rotateX(Math.PI / 2);
  eng.add(new THREE.Mesh(core, STEEL));
  const plug = new THREE.Mesh(new THREE.ConeGeometry(0.46, 1.3, 32), TITANIUM);
  plug.rotation.x = -Math.PI / 2;
  plug.position.z = -3.6;
  eng.add(plug);
  // pylon up to the wing
  eng.add(
    extrudeZY(
      [
        [1.6, 1.0],
        [-2.4, 1.0],
        [-3.8, 1.75],
        [-0.2, 1.75],
      ],
      0.32,
      IVORY,
    ),
  );
  return eng;
}

function emblemDecals(emblem: THREE.Texture | null, fin: THREE.Group) {
  if (!emblem) return;
  const mat = paint({ map: emblem, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  for (const s of [1, -1]) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(3.3, (3.3 * 440) / 540), mat);
    d.rotation.y = (s * Math.PI) / 2;
    d.position.set(s * 0.215, 5.6, -20.4);
    fin.add(d);
  }
}

function glowTexture() {
  const [c, g] = canvas(128, 128);
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.12, "rgba(255,255,255,0.8)");
  r.addColorStop(0.35, "rgba(255,255,255,0.16)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildPlane(logo: THREE.Texture, emblem: THREE.Texture | null) {
  const plane = new THREE.Group();
  plane.add(fuselage());

  // wings: flat-bottomed and flush with the belly inboard, dihedral outboard of the engines
  const wingMap = wingLivery();
  const wingMat = paint({ color: 0xffffff, map: wingMap, bumpMap: wingMap, bumpScale: 0.5, clearcoat: 0.6 });
  const tipY = -2.05 + (SEMI - 7.6) * 0.0875;
  const wingSecs: Sec[] = [
    { x: 0, le: 5.5, chord: 10, t: 0.75, y: -2.05, up: 1, dn: 0 },
    { x: 7.6, le: 0.94, chord: 5.54, t: 0.48, y: -2.05, up: 1, dn: 0 },
    { x: SEMI, le: -4.6, chord: 1.8, t: 0.16, y: tipY, up: 0.75, dn: 0.25 },
  ];
  const tailSecs: Sec[] = [
    { x: 0, le: -15.8, chord: 5.2, t: 0.4, y: 0.55, up: 0.5, dn: 0.5 },
    { x: 7.6, le: -21, chord: 1.9, t: 0.12, y: 1.31, up: 0.5, dn: 0.5 },
  ];
  const lights = new THREE.Group();
  const glow = glowTexture();
  const sprite = (color: number, size: number, x: number, y: number, z: number) => {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glow, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }),
    );
    s.scale.setScalar(size);
    s.position.set(x, y, z);
    lights.add(s);
    return s;
  };

  const nav: THREE.Sprite[] = [];
  const strobes: THREE.Sprite[] = [];
  for (const side of [1, -1] as const) {
    plane.add(new THREE.Mesh(loft(wingSecs, side), wingMat));
    plane.add(new THREE.Mesh(loft(tailSecs, side), IVORY));

    // gold blended winglet, canted outward
    const wl = extrudeZY(
      [
        [-4.6, 0],
        [-6.1, 2.5],
        [-6.75, 2.5],
        [-6.4, 0],
      ],
      0.12,
      GOLD,
    );
    wl.position.set(side * (SEMI - 0.05), tipY + 0.08, 0);
    wl.rotation.z = -side * 0.28;
    plane.add(wl);

    // flap-track fairings under the trailing edge, outboard of the engines
    for (const x of [12, 14.8]) {
      const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 2.3, 4, 12), IVORY);
      f.rotation.x = Math.PI / 2;
      f.position.set(side * x, -2.05 + (x - 7.6) * 0.0875 - 0.16, -5.1);
      plane.add(f);
    }

    const eng = engine(18);
    eng.position.set(side * 9.5, -3.48, 0.2);
    plane.add(eng);

    nav.push(sprite(side > 0 ? 0xff2a22 : 0x2bff7a, 1.1, side * (SEMI + 0.1), tipY + 0.2, -4.8));
    strobes.push(sprite(0xffffff, 5, side * (SEMI + 0.1), tipY + 0.2, -6.4));
  }

  // navy fin with the emblem on both sides
  const finGeo = loft(
    [
      { x: 0, le: -14.5, chord: 7.5, t: 0.55, y: 0, up: 0.5, dn: 0.5 },
      { x: 8, le: -22.6, chord: 2.7, t: 0.2, y: 0, up: 0.5, dn: 0.5 },
    ],
    1,
  );
  finGeo.rotateZ(Math.PI / 2); // span → up
  const fin = new THREE.Group();
  const finMesh = new THREE.Mesh(finGeo, NAVY);
  finMesh.position.y = 1.5;
  fin.add(finMesh);
  emblemDecals(emblem, fin);
  plane.add(fin);

  // landing gear: twin nose wheels and four-wheel main bogies, folding into the body
  const wheel = (parent: THREE.Object3D, r: number, x: number, y: number, z: number) => {
    const tyre = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.42, 24), RUBBER);
    tyre.rotation.z = Math.PI / 2;
    tyre.position.set(x, y, z);
    parent.add(tyre);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.5, r * 0.5, 0.44, 16), STEEL);
    hub.rotation.z = Math.PI / 2;
    hub.position.set(x, y, z);
    parent.add(hub);
  };
  const strut = (parent: THREE.Object3D, len: number) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, len, 12), STEEL);
    m.position.y = -len / 2;
    parent.add(m);
  };
  const mains: { g: THREE.Group; side: number }[] = [];
  for (const side of [1, -1]) {
    const g = new THREE.Group();
    g.position.set(side * 3, -1.95, MAIN_GEAR_Z);
    strut(g, 2.55);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 2.0), STEEL);
    beam.position.y = -2.5;
    g.add(beam);
    for (const x of [-0.33, 0.33]) for (const z of [-0.7, 0.7]) wheel(g, 0.6, x, -2.55, z);
    plane.add(g);
    mains.push({ g, side });
  }
  const nose = new THREE.Group();
  nose.position.set(0, -1.6, 15.2);
  strut(nose, 2.9);
  for (const x of [-0.3, 0.3]) wheel(nose, 0.5, x, -3.0, 0);
  plane.add(nose);
  // gear-mounted taxi light
  const noseLight = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glow, color: 0xfff3dc, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }),
  );
  noseLight.scale.setScalar(2.6);
  noseLight.position.set(0, -2.2, 0.4);
  nose.add(noseLight);

  const retract = (k: number) => {
    const fold = smooth(0, 0.75, k);
    const tuck = 0.9 * smooth(0.75, 1, k);
    for (const { g, side } of mains) {
      g.rotation.z = (-side * fold * Math.PI) / 2;
      g.position.y = -1.95 + tuck;
      g.visible = k < 1;
    }
    nose.rotation.x = (-fold * Math.PI) / 2;
    nose.position.y = -1.6 + tuck;
    nose.visible = k < 1;
  };

  // landing lights in the wing roots, blazing while they point at the viewer
  const landing = [sprite(0xfff3dc, 4.5, 3.0, -2.25, 3.4), sprite(0xfff3dc, 4.5, -3.0, -2.25, 3.4)];
  const beacons = [sprite(0xff2418, 2.2, 0, -2.2, -8.5), sprite(0xff2418, 2.2, 0, 2.15, -2)];
  plane.add(lights);

  const fwd = new THREE.Vector3();
  const here = new THREE.Vector3();
  const updateLights = (t: number, cam: THREE.Vector3) => {
    plane.getWorldDirection(fwd); // +z, the nose
    here.setFromMatrixPosition(plane.matrixWorld);
    const facing = Math.max(0, fwd.dot(here.sub(cam).normalize().negate()));
    const beam = facing ** 6;
    for (const l of landing) l.material.opacity = 0.25 + 0.75 * beam;
    noseLight.material.opacity = 0.3 + 0.7 * beam;
    const p = t % 1.3;
    const flash = p < 0.05 || (p > 0.16 && p < 0.21) ? 1 : 0;
    for (const s of strobes) s.material.opacity = flash;
    const b = t % 1.1;
    for (const s of beacons) s.material.opacity = b < 0.18 ? Math.sin((b / 0.18) * Math.PI) : 0;
    for (const s of nav) s.material.opacity = 0.9;
  };

  // the ROAMX wordmark painted on the flat underside (reads nose-up when seen from below)
  const decal = new THREE.Mesh(
    new THREE.PlaneGeometry(DECAL_W, DECAL_H),
    paint({ map: logo, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }),
  );
  decal.rotation.x = Math.PI / 2; // face down (-y), texture-up towards the nose (+z)
  decal.position.set(0, -2.06, -2.0);
  decal.renderOrder = 2;
  plane.add(decal);

  return { plane, decal, retract, updateLights };
}

function imageTexture(url: string, width: number, height: number): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const [c, g] = canvas(width, height);
      g.drawImage(img, 0, 0, width, height);
      resolve(canvasTexture(c));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/** Rasterises an on-page <svg> (e.g. the hero wordmark) into a crisp texture. */
export function svgTexture(svg: SVGSVGElement, width = 2048): Promise<THREE.Texture> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const [, , vbW, vbH] = (clone.getAttribute("viewBox") ?? "0 0 1528 456").split(/\s+/).map(Number);
  const height = Math.round((width * vbH) / vbW);
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
  return imageTexture(url, width, height).finally(() => URL.revokeObjectURL(url));
}

/** The RoamX emblem for the tail fin (the site icon). Resolves to null if it can't be loaded. */
export function emblemTexture(): Promise<THREE.Texture | null> {
  return imageTexture("/icon.svg", 540, 440).catch(() => null);
}
