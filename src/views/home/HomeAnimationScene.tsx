import React, { useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  buildStatsParticles,
  homeStatsFragmentShader,
  homeStatsVertexShader,
} from './homeAnimationData';
import './HomeAnimation.scss';

interface StatsSceneProps {
  stats: { total: number; active: number; resolved: number };
  theme: 'light' | 'dark';
}

const StatsVisualization: React.FC<{ stats: { total: number; active: number; resolved: number }; theme: 'light' | 'dark' }> = ({ stats, theme }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const mouseWorld = useRef(new THREE.Vector2(0, 0));
  const mouseStrengthRef = useRef(0);

  const data = useMemo(() => buildStatsParticles(stats), [stats]);

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 1));
    geo.setAttribute('aValue', new THREE.BufferAttribute(data.values, 1));
    geo.setAttribute('aCategory', new THREE.BufferAttribute(data.categories, 1));
    return geo;
  }, [data]);

  const sharedUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMouseStrength: { value: 0 },
    }),
    []
  );

  const pointsMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: homeStatsVertexShader,
        fragmentShader: homeStatsFragmentShader,
        uniforms: sharedUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [sharedUniforms]
  );

  useFrame(() => {
    if (materialRef.current && 'uniforms' in materialRef.current) {
      (materialRef.current as THREE.ShaderMaterial).uniforms.uTime.value += 0.016;
      (materialRef.current as THREE.ShaderMaterial).uniforms.uMouse.value = mouseWorld.current;
      mouseStrengthRef.current = Math.max(0, mouseStrengthRef.current - 0.02);
      (materialRef.current as THREE.ShaderMaterial).uniforms.uMouseStrength.value = mouseStrengthRef.current;
    }

    if (groupRef.current) {
      groupRef.current.rotation.z += 0.0002;
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;

      mouseWorld.current.x = (x - 0.5) * 8;
      mouseWorld.current.y = (y - 0.5) * 6;
      mouseStrengthRef.current = 1;
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);
    return () => gl.domElement.removeEventListener('mousemove', handleMouseMove);
  }, [gl.domElement]);

  return (
    <group ref={groupRef}>
      <points geometry={pointsGeometry} material={pointsMaterial} ref={materialRef} />
    </group>
  );
};

const HomeAnimationFallback: React.FC = () => (
  <div className="home-animation__fallback">
    <div className="home-animation__fallback-orb" />
  </div>
);

export const HomeAnimationScene: React.FC<StatsSceneProps> = ({ stats, theme }) => {
  return (
    <div className="home-animation">
      <Suspense fallback={<HomeAnimationFallback />}>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 45,
            near: 0.1,
            far: 1000,
          }}
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
          <StatsVisualization stats={stats} theme={theme} />
        </Canvas>
      </Suspense>
    </div>
  );
};
