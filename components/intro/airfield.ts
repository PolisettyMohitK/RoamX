import * as THREE from "three";

/*
 * Blue-hour airfield for the takeoff intro: sky dome, asphalt runway with worn markings, runway lights and a distant
 * city glow on the horizon. The camera stands on the runway centre line at z = 0, looking down it along -z.
 */

export const HAZE = 0x2c3554; // horizon haze; also the fog colour

const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
// Colours are sRGB and written straight out (no tone mapping), so the zenith is the site's navy exactly.
const SKY_FRAG = /* glsl */ `
  uniform float fade;
  uniform float linearOut;
  varying vec3 vDir;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    float ahead = max(0.0, -d.z / max(0.0001, length(d.xz))); // towards the far end of the runway
    vec3 zenith = vec3(0.039, 0.078, 0.188);   // #0a1430
    vec3 upper  = vec3(0.090, 0.165, 0.330);
    vec3 haze   = vec3(0.173, 0.208, 0.329);   // #2c3554
    vec3 glow   = vec3(0.86, 0.55, 0.40);
    vec3 col = mix(haze, upper, smoothstep(0.0, 0.2, h));
    col = mix(col, zenith, smoothstep(0.14, 0.7, h));
    float g = exp(-max(h, 0.0) * 16.0) * (0.25 + 0.75 * pow(ahead, 4.0));
    col = mix(col, glow, g * 0.8);
    col = mix(col, haze * 0.7, smoothstep(0.0, -0.06, h)); // below the horizon (hidden by the ground)
    vec3 cell = floor(d * 420.0);
    float star = step(0.9975, hash(cell)) * smoothstep(0.25, 0.6, h) * hash(cell + 1.7);
    col += vec3(0.75, 0.8, 0.95) * star * 0.55;
    if (linearOut > 0.5) col = pow(col, vec3(2.2));
    gl_FragColor = vec4(col * (1.0 - fade), 1.0 - fade);
  }
`;

function sky(linearOut: boolean) {
  const mat = new THREE.ShaderMaterial({
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    uniforms: { fade: { value: 0 }, linearOut: { value: linearOut ? 1 : 0 } },
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    blending: THREE.CustomBlending, // drawn first, in the opaque pass
    blendSrc: THREE.OneFactor, // colour is already premultiplied
    blendDst: THREE.OneMinusSrcAlphaFactor,
    fog: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(3500, 64, 32), mat);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return mesh;
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

// One 45 m × 60 m tile of runway: grainy asphalt, rubber streaks, worn centre-line dash and edge stripes.
function asphalt(anisotropy: number) {
  const W = 512;
  const H = 1024;
  const [c, g] = canvas(W, H);
  const img = g.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const xm = (x / W) * 45 - 22.5;
      const rubber = Math.exp(-(((Math.abs(xm) - 3.5) / 2.8) ** 2)) * 0.35; // tyre tracks either side of centre
      const v = 34 + Math.random() * 16 - rubber * 18;
      img.data[i] = v;
      img.data[i + 1] = v + 1;
      img.data[i + 2] = v + 4;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const pxM = W / 45;
  const pyM = H / 60;
  const paintRect = (x: number, y: number, w: number, h: number) => {
    for (let k = 0; k < (w * h) / 6; k++) {
      g.fillStyle = `rgba(214,211,202,${0.25 + Math.random() * 0.25})`;
      g.fillRect(x + Math.random() * w, y + Math.random() * h, 2, 2);
    }
    g.fillStyle = "rgba(214,211,202,0.3)";
    g.fillRect(x, y, w, h);
  };
  paintRect(W / 2 - 0.45 * pxM, 0, 0.9 * pxM, 30 * pyM); // 30 m dash, 30 m gap
  for (const s of [-1, 1]) paintRect(W / 2 + s * 21.6 * pxM - 0.45 * pxM, 0, 0.9 * pxM, H);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = anisotropy;
  return t;
}

const LIGHT_VERT = /* glsl */ `
  attribute vec3 color;
  attribute float size;
  uniform float scale;
  varying vec3 vColor;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float d = -mv.z;
    float px = size * scale / d;
    gl_PointSize = max(1.8, px);
    vA = clamp(px / 1.8, 0.4, 1.0) * exp(-d * 0.00032);
    vColor = color;
  }
`;
const LIGHT_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vA;
  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float r = dot(p, p);
    float a = exp(-r * 6.0) + 0.35 * exp(-r * 1.6);
    gl_FragColor = vec4(vColor * a * vA, a * vA);
  }
`;

function lights(viewportHeight: number) {
  const pos: number[] = [];
  const col: number[] = [];
  const size: number[] = [];
  const add = (x: number, y: number, z: number, c: [number, number, number], s: number) => {
    pos.push(x, y, z);
    col.push(...c);
    size.push(s);
  };
  const WARM: [number, number, number] = [1.0, 0.8, 0.52];
  const WHITE: [number, number, number] = [0.92, 0.95, 1.0];
  const RED: [number, number, number] = [1.0, 0.16, 0.12];
  for (let z = -10; z > -3100; z -= 60) for (const x of [-23.5, 23.5]) add(x, 0.35, z, WARM, 1.3);
  // centre line: red for the last 300 m, alternating for the 600 m before, then white
  for (let z = -16, i = 0; z > -3100; z -= 15, i++) {
    const c = z > -300 ? RED : z > -900 ? (i % 2 ? RED : WHITE) : WHITE;
    add(0.6, 0.05, z, c, 0.6);
  }
  for (let x = -21; x <= 21; x += 3) add(x, 0.3, -12, RED, 0.7); // runway end lights at the viewer's feet
  // a sparse city on the horizon
  for (let i = 0; i < 320; i++) {
    const r = Math.random();
    const c: [number, number, number] = r < 0.65 ? [1.0, 0.72, 0.42] : r < 0.9 ? [0.95, 0.92, 0.85] : [0.7, 0.8, 1.0];
    add((Math.random() - 0.5) * 7000, Math.random() * 24, -2400 - Math.random() * 1000, c, 1.4 + Math.random() * 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.setAttribute("size", new THREE.Float32BufferAttribute(size, 1));
  const mat = new THREE.ShaderMaterial({
    vertexShader: LIGHT_VERT,
    fragmentShader: LIGHT_FRAG,
    uniforms: { scale: { value: viewportHeight / 2 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  return pts;
}

export function buildAirfield(renderer: THREE.WebGLRenderer, viewportHeight: number) {
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const group = new THREE.Group();

  const dome = sky(false);
  group.add(dome);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(9000, 9000),
    new THREE.MeshStandardMaterial({ color: 0x0a0e19, roughness: 1, envMapIntensity: 0.1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.03;
  group.add(ground);

  const tile = asphalt(aniso);
  const LENGTH = 3240;
  tile.repeat.set(1, LENGTH / 60);
  const runway = new THREE.Mesh(
    new THREE.PlaneGeometry(45, LENGTH),
    new THREE.MeshStandardMaterial({ map: tile, roughness: 0.95, color: 0xb4bccc, envMapIntensity: 0.25 }), // a faint sheen of the afterglow
  );
  runway.rotation.x = -Math.PI / 2;
  runway.position.set(0, 0, 40 - LENGTH / 2);
  group.add(runway);

  group.add(lights(viewportHeight));

  // the sky alone, in linear light, for the jet's reflections
  const envScene = new THREE.Scene();
  envScene.add(sky(true));

  return { group, envScene, skyUniforms: (dome.material as THREE.ShaderMaterial).uniforms };
}
