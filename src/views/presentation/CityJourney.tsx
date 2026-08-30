import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  buildConnections,
  buildJourneyData,
  journeyLinesFragmentShader,
  journeyLinesVertexShader,
  journeyPointsFragmentShader,
  journeyPointsVertexShader,
  JOURNEY_PALETTES,
} from './cityJourneyData';
import { StaticSkylineFallback } from './SkylineFallback';
import './CityJourney.scss';

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Piecewise-linear interpolation across camera keyframes. */
const keyframe = (frames: Array<[number, number]>, p: number) => {
  if (p <= frames[0][0]) return frames[0][1];
  for (let i = 0; i < frames.length - 1; i += 1) {
    const [aP, aV] = frames[i];
    const [bP, bV] = frames[i + 1];
    if (p <= bP) return aV + ((bV - aV) * (p - aP)) / (bP - aP);
  }
  return frames[frames.length - 1][1];
};

const CAMERA_Z: Array<[number, number]> = [
  [0, 13.5],
  [0.34, 9.2],
  [0.52, 7.9],
  [0.74, 8.9],
  [1, 12.4],
];

interface SceneProps {
  progressRef: React.MutableRefObject<number>;
  count: number;
  coarsePointer: boolean;
  theme: 'light' | 'dark';
}

const JourneyScene: React.FC<SceneProps> = ({ progressRef, count, coarsePointer, theme }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const lineMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const sceneScaleRef = useRef(1);
  const mouseWorld = useRef(new THREE.Vector2(999, 999));
  // A mouse is always "present"; a finger only counts while it is on the glass,
  // otherwise the last touch would leave a permanent dent in the city.
  const engagedRef = useRef(!coarsePointer);
  const { gl } = useThree();
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);

  const data = useMemo(() => buildJourneyData(count), [count]);

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(data.starts, 3));
    geo.setAttribute('aSkyline', new THREE.BufferAttribute(data.skyline, 3));
    geo.setAttribute('aWord', new THREE.BufferAttribute(data.word, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1));
    geo.setAttribute('aColorMix', new THREE.BufferAttribute(data.colorMix, 1));
    return geo;
  }, [data]);

  // Links carry a copy of their endpoint's attributes so they deform identically.
  const linesGeometry = useMemo(() => {
    const pairs = buildConnections(data.skyline, count, Math.min(1400, Math.floor(count / 5)));
    const n = pairs.length;
    const starts = new Float32Array(n * 3);
    const skyline = new Float32Array(n * 3);
    const word = new Float32Array(n * 3);
    const seeds = new Float32Array(n);
    const sizes = new Float32Array(n);
    const colorMix = new Float32Array(n);

    for (let i = 0; i < n; i += 1) {
      const src = pairs[i];
      for (let axis = 0; axis < 3; axis += 1) {
        starts[i * 3 + axis] = data.starts[src * 3 + axis];
        skyline[i * 3 + axis] = data.skyline[src * 3 + axis];
        word[i * 3 + axis] = data.word[src * 3 + axis];
      }
      seeds[i] = data.seeds[src];
      sizes[i] = data.sizes[src];
      colorMix[i] = data.colorMix[src];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(starts, 3));
    geo.setAttribute('aSkyline', new THREE.BufferAttribute(skyline, 3));
    geo.setAttribute('aWord', new THREE.BufferAttribute(word, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aColorMix', new THREE.BufferAttribute(colorMix, 1));
    return geo;
  }, [data, count]);

  const sharedUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uForm: { value: 0 },
      uMorph: { value: 0 },
      uBreathe: { value: 0 },
      uMouseStrength: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uGlow: { value: 0 },
      uAlphaScale: { value: 1 },
    }),
    []
  );

  const pointsMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: journeyPointsVertexShader,
        fragmentShader: journeyPointsFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          ...sharedUniforms,
          uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1 },
        },
      }),
    [sharedUniforms]
  );

  const linesMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: journeyLinesVertexShader,
        fragmentShader: journeyLinesFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { ...sharedUniforms, uLink: { value: 0 } },
      }),
    [sharedUniforms]
  );

  useEffect(() => {
    if (!coarsePointer) return;
    const el = gl.domElement;
    const engage = () => { engagedRef.current = true; };
    const release = () => { engagedRef.current = false; };
    el.addEventListener('pointerdown', engage, { passive: true });
    el.addEventListener('pointerup', release, { passive: true });
    el.addEventListener('pointercancel', release, { passive: true });
    el.addEventListener('pointerleave', release, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', engage);
      el.removeEventListener('pointerup', release);
      el.removeEventListener('pointercancel', release);
      el.removeEventListener('pointerleave', release);
    };
  }, [coarsePointer, gl]);

  // Repaint for the active theme: palette into the shared uniforms, and a
  // blend-mode swap so the field never washes out on the cream ground.
  useEffect(() => {
    const palette = JOURNEY_PALETTES[theme];
    sharedUniforms.uColorA.value.setRGB(...palette.colorA);
    sharedUniforms.uColorB.value.setRGB(...palette.colorB);
    sharedUniforms.uGlow.value = palette.glow;
    sharedUniforms.uAlphaScale.value = palette.alphaScale;

    for (const material of [pointsMaterial, linesMaterial]) {
      material.blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
      material.needsUpdate = true;
    }
  }, [theme, sharedUniforms, pointsMaterial, linesMaterial]);

  useEffect(
    () => () => {
      pointsGeometry.dispose();
      linesGeometry.dispose();
      pointsMaterial.dispose();
      linesMaterial.dispose();
    },
    [pointsGeometry, linesGeometry, pointsMaterial, linesMaterial]
  );

  useFrame((state) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;

    // The city is authored at desktop width. On a portrait phone that overflows
    // the frame entirely, so shrink the whole scene to the viewport's aspect
    // rather than dollying the camera back (which would shrink the particles).
    const aspect = state.size.width / Math.max(1, state.size.height);
    const scale = Math.min(1, Math.max(0.3, aspect / 1.6));
    sceneScaleRef.current = scale;
    if (groupRef.current) groupRef.current.scale.setScalar(scale);

    const engaged = engagedRef.current;
    if (engaged) {
      raycaster.setFromCamera(state.pointer, state.camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        // Particle maths runs in un-scaled local space, so bring the pointer with it.
        mouseWorld.current.set(hit.x / scale, hit.y / scale);
      }
    } else {
      mouseWorld.current.set(999, 999);
    }

    // ACT I→II assembly, III reaction, IV breath + links, V the word.
    const form = smoothstep(0.02, 0.34, p);
    const mouseStrength = smoothstep(0.34, 0.46, p) * (1 - smoothstep(0.84, 0.95, p)) * (engaged ? 1 : 0);
    const breathe = smoothstep(0.56, 0.7, p) * (1 - smoothstep(0.84, 0.94, p));
    const link = smoothstep(0.58, 0.72, p) * (1 - smoothstep(0.82, 0.92, p));
    const morph = smoothstep(0.82, 0.97, p);

    for (const material of [pointsMaterial, linesMaterial]) {
      const u = material.uniforms;
      u.uTime.value = t;
      u.uForm.value = form;
      u.uMorph.value = morph;
      u.uBreathe.value = breathe;
      u.uMouseStrength.value = THREE.MathUtils.lerp(u.uMouseStrength.value, mouseStrength, 0.08);
      u.uMouse.value.lerp(mouseWorld.current, 0.12);
    }
    linesMaterial.uniforms.uLink.value = THREE.MathUtils.lerp(linesMaterial.uniforms.uLink.value, link, 0.1);

    const camera = state.camera;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, keyframe(CAMERA_Z, p), 0.05);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 0.55, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.25 + state.pointer.y * 0.28, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <primitive object={linesGeometry} attach="geometry" />
        <primitive object={linesMaterial} ref={lineMaterialRef} attach="material" />
      </lineSegments>
      <points>
        <primitive object={pointsGeometry} attach="geometry" />
        <primitive object={pointsMaterial} ref={materialRef} attach="material" />
      </points>
    </group>
  );
};

class WebglBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function detectWebglSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

interface CityJourneyProps {
  progressRef: React.MutableRefObject<number>;
  theme: 'light' | 'dark';
}

export const CityJourney: React.FC<CityJourneyProps> = ({ progressRef, theme }) => {
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [webglSupported] = useState(detectWebglSupport);

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    setCoarsePointer(query.matches);
    const onChange = () => setCoarsePointer(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  if (!webglSupported) return <StaticSkylineFallback />;

  return (
    <div className="cj-canvas">
      <WebglBoundary fallback={<StaticSkylineFallback />}>
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.25, 13.5], fov: 45, near: 0.1, far: 60 }}
        >
          <JourneyScene
            progressRef={progressRef}
            count={coarsePointer ? 4200 : 9000}
            coarsePointer={coarsePointer}
            theme={theme}
          />
        </Canvas>
      </WebglBoundary>
    </div>
  );
};
