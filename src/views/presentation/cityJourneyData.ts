import { MONUMENT_SKYLINE_PATH, MONUMENT_SKYLINE_VIEWBOX } from '../../assets/monumentSkylinePath';

export interface JourneyData {
  starts: Float32Array;
  skyline: Float32Array;
  word: Float32Array;
  seeds: Float32Array;
  sizes: Float32Array;
  colorMix: Float32Array;
}

type Pt = [number, number];

/** Rasterize an arbitrary 2D draw call and collect every opaque pixel as a sample point. */
function sampleCanvas(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): Pt[] {
  const points: Pt[] = [];
  if (typeof document === 'undefined') return points;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return points;

  draw(ctx);

  const { data } = ctx.getImageData(0, 0, width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 40) points.push([x, y]);
    }
  }
  return points;
}

function sampleSkyline(): { points: Pt[]; width: number; height: number } {
  const scale = 2;
  const width = Math.round(MONUMENT_SKYLINE_VIEWBOX.width * scale);
  const height = Math.round(MONUMENT_SKYLINE_VIEWBOX.height * scale);
  const points = sampleCanvas(width, height, (ctx) => {
    ctx.scale(scale, scale);
    ctx.lineWidth = 2.4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#fff';
    ctx.stroke(new Path2D(MONUMENT_SKYLINE_PATH));
  });
  return { points, width, height };
}

function sampleWord(text: string): { points: Pt[]; width: number; height: number } {
  const fontSize = 190;
  // Playfair is the display face of the brand; fall back to a serif with similar weight.
  const family =
    typeof document !== 'undefined' && document.fonts?.check?.(`700 ${fontSize}px "Playfair Display"`)
      ? '"Playfair Display", Georgia, serif'
      : 'Georgia, "Times New Roman", serif';
  const font = `700 ${fontSize}px ${family}`;

  let textWidth = text.length * fontSize * 0.62;
  if (typeof document !== 'undefined') {
    const probe = document.createElement('canvas').getContext('2d');
    if (probe) {
      probe.font = font;
      textWidth = probe.measureText(text).width;
    }
  }

  const width = Math.ceil(textWidth) + 40;
  const height = Math.ceil(fontSize * 1.4);
  const points = sampleCanvas(width, height, (ctx) => {
    ctx.font = font;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
  });
  return { points, width, height };
}

/**
 * Both point clouds are sorted left-to-right and consumed in step, so a particle
 * that sits on the left of the skyline also lands on the left of the word. The
 * morph then reads as the city *sliding* into language rather than teleporting.
 */
function toWorld(points: Pt[], width: number, height: number, worldWidth: number, yOffset: number) {
  const worldHeight = (worldWidth * height) / width;
  const sorted = points.slice().sort((a, b) => a[0] - b[0]);
  return {
    sorted,
    project(index: number, out: Float32Array, cursor: number, depth: number) {
      const [px, py] = sorted[index];
      out[cursor] = (px / width - 0.5) * worldWidth;
      out[cursor + 1] = (0.5 - py / height) * worldHeight + yOffset;
      out[cursor + 2] = depth;
    },
  };
}

export function buildJourneyData(count: number): JourneyData {
  const skylineSrc = sampleSkyline();
  const wordSrc = sampleWord('DÉMOCRATIE');

  const skylineMap = toWorld(skylineSrc.points, skylineSrc.width, skylineSrc.height, 21, -0.35);
  // Narrower than the skyline and lifted, so the word clears the chapter caption
  // and stays inside frame at the final camera distance.
  const wordMap = toWorld(wordSrc.points, wordSrc.width, wordSrc.height, 11.4, 0.75);

  const starts = new Float32Array(count * 3);
  const skyline = new Float32Array(count * 3);
  const word = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const colorMix = new Float32Array(count);

  const skyCount = skylineMap.sorted.length;
  const wordCount = wordMap.sorted.length;

  for (let i = 0; i < count; i += 1) {
    const t = i / count;
    const c = i * 3;

    if (skyCount > 0) {
      const jitter = Math.floor((Math.random() - 0.5) * 60);
      const idx = Math.min(skyCount - 1, Math.max(0, Math.floor(t * skyCount) + jitter));
      skylineMap.project(idx, skyline, c, (Math.random() - 0.5) * 1.3);
    }

    if (wordCount > 0) {
      const jitter = Math.floor((Math.random() - 0.5) * 40);
      const idx = Math.min(wordCount - 1, Math.max(0, Math.floor(t * wordCount) + jitter));
      wordMap.project(idx, word, c, (Math.random() - 0.5) * 0.5);
    }

    // Act I — a wide, formless dust cloud the city has to be assembled out of.
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 9 + Math.random() * 11;
    starts[c] = r * Math.sin(phi) * Math.cos(theta);
    starts[c + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.62;
    starts[c + 2] = r * Math.cos(phi) - 3;

    seeds[i] = Math.random();
    sizes[i] = 1.3 + Math.random() * 2.3;
    colorMix[i] = t;
  }

  return { starts, skyline, word, seeds, sizes, colorMix };
}

/**
 * Local neighbour pairs, bucketed on a coarse grid. Act IV threads these as
 * lines — the "liens" between citizens — without ever doing an O(n²) search.
 */
export function buildConnections(skyline: Float32Array, count: number, maxPairs: number): Uint32Array {
  const cell = 0.5;
  const buckets = new Map<string, number[]>();

  for (let i = 0; i < count; i += 1) {
    const x = skyline[i * 3];
    const y = skyline[i * 3 + 1];
    const key = `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(i);
    else buckets.set(key, [i]);
  }

  const pairs: number[] = [];
  for (const bucket of Array.from(buckets.values())) {
    if (pairs.length / 2 >= maxPairs) break;
    for (let t = 0; t + 1 < bucket.length && pairs.length / 2 < maxPairs; t += 4) {
      pairs.push(bucket[t], bucket[t + 1]);
    }
  }

  return new Uint32Array(pairs);
}

export interface JourneyPalette {
  colorA: [number, number, number];
  colorB: [number, number, number];
  glow: number;
  alphaScale: number;
  additive: boolean;
}

/**
 * Additive blending only reads as light on a dark ground — on the cream theme it
 * washes straight out. Light mode therefore switches to normal blending with
 * darker, denser particles so the city stays legible in both themes.
 */
export const JOURNEY_PALETTES: Record<'dark' | 'light', JourneyPalette> = {
  dark: {
    colorA: [0.561, 0.796, 0.525],
    colorB: [0.851, 0.643, 0.255],
    glow: 0.28,
    alphaScale: 1,
    additive: true,
  },
  light: {
    colorA: [0.28, 0.4, 0.24],
    colorB: [0.5, 0.33, 0.14],
    glow: -0.06,
    alphaScale: 1.6,
    additive: false,
  },
};

/** Shared displacement model — points and links run identical maths so endpoints stay welded. */
const JOURNEY_COMMON = /* glsl */ `
  uniform float uTime;
  uniform float uForm;
  uniform float uMorph;
  uniform float uBreathe;
  uniform float uMouseStrength;
  uniform vec2 uMouse;

  attribute vec3 aSkyline;
  attribute vec3 aWord;
  attribute float aSeed;
  attribute float aSize;
  attribute float aColorMix;

  varying float vAlpha;
  varying float vColorMix;

  float easeInOut(float x) {
    return x * x * (3.0 - 2.0 * x);
  }

  float formAmount() {
    return easeInOut(clamp((uForm - aSeed * 0.4) / 0.6, 0.0, 1.0));
  }

  vec3 journeyPosition() {
    vec3 base = mix(position, aSkyline, formAmount());
    base = mix(base, aWord, easeInOut(clamp((uMorph - aSeed * 0.35) / 0.65, 0.0, 1.0)));

    // Act IV — the city inhales and exhales.
    float breath = sin(uTime * 0.9 + aSeed * 6.2831) * 0.5 + 0.5;
    base *= 1.0 + uBreathe * breath * 0.05;

    float idle = 0.05 * (1.0 - formAmount() * 0.55);
    base.x += sin(uTime * 0.55 + aSeed * 6.2831) * idle;
    base.y += cos(uTime * 0.45 + aSeed * 6.2831) * idle;
    base.z += sin(uTime * 0.35 + aSeed * 3.14159) * idle;

    // Act III — the city recoils from the visitor.
    vec2 toParticle = base.xy - uMouse;
    float dist = length(toParticle);
    base.xy += normalize(toParticle + 0.0001) * smoothstep(2.4, 0.0, dist) * uMouseStrength * 1.15;

    return base;
  }
`;

export const journeyPointsVertexShader = /* glsl */ `
  uniform float uPixelRatio;
  ${JOURNEY_COMMON}

  void main() {
    vec3 transformed = journeyPosition();
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = clamp(aSize * uPixelRatio * (13.0 / -mvPosition.z), 1.0, 22.0);

    vAlpha = mix(0.16, 1.0, formAmount());
    vColorMix = mix(aColorMix, 0.9, uMorph);
  }
`;

export const journeyPointsFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uGlow;
  uniform float uAlphaScale;

  varying float vAlpha;
  varying float vColorMix;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.02, d) * vAlpha * uAlphaScale;
    if (alpha <= 0.001) discard;

    vec3 color = mix(uColorA, uColorB, clamp(vColorMix, 0.0, 1.0));
    color += (0.5 - d) * uGlow;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;

export const journeyLinesVertexShader = /* glsl */ `
  ${JOURNEY_COMMON}

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(journeyPosition(), 1.0);
    vAlpha = formAmount();
    vColorMix = aColorMix;
  }
`;

export const journeyLinesFragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uLink;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uAlphaScale;

  varying float vAlpha;
  varying float vColorMix;

  void main() {
    float alpha = vAlpha * uLink * 0.5 * uAlphaScale;
    if (alpha <= 0.001) discard;
    gl_FragColor = vec4(mix(uColorA, uColorB, clamp(vColorMix, 0.0, 1.0)), clamp(alpha, 0.0, 1.0));
  }
`;
