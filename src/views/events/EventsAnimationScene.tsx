import React, { useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  buildEventsParticles,
  eventsTimelineVertexShader,
  eventsTimelineFragmentShader,
} from './EventsAnimationData';
import './EventsAnimation.scss';

interface EventsSceneProps {
  eventCount: number;
  theme: 'light' | 'dark';
  scrollProgress: number;
}

const TimelineVisualization: React.FC<{ eventCount: number; theme: 'light' | 'dark'; scrollProgress: number }> = ({
  eventCount,
  theme,
  scrollProgress,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const mouseWorld = useRef(new THREE.Vector2(0, 0));
  const mouseStrengthRef = useRef(0);

  const data = useMemo(() => buildEventsParticles(eventCount), [eventCount]);

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute('aIndex', new THREE.BufferAttribute(data.indices, 1));
    geo.setAttribute('aDay', new THREE.BufferAttribute(data.days, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(data.colors, 3));
    return geo;
  }, [data]);

  const sharedUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseStrength: { value: 0 },
    }),
    []
  );

  const pointsMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: eventsTimelineVertexShader,
        fragmentShader: eventsTimelineFragmentShader,
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
      (materialRef.current as THREE.ShaderMaterial).uniforms.uScroll.value = scrollProgress;
      (materialRef.current as THREE.ShaderMaterial).uniforms.uMouse.value = mouseWorld.current;
      mouseStrengthRef.current = Math.max(0, mouseStrengthRef.current - 0.03);
      (materialRef.current as THREE.ShaderMaterial).uniforms.uMouseStrength.value = mouseStrengthRef.current;
    }

    if (groupRef.current) {
      groupRef.current.rotation.z += 0.00008;
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;

      mouseWorld.current.x = (x - 0.5) * 12;
      mouseWorld.current.y = (y - 0.5) * 8;
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

const EventsAnimationFallback: React.FC = () => (
  <div className="events-animation__fallback">
    <div className="events-animation__fallback-pulse" />
  </div>
);

export const EventsAnimationScene: React.FC<EventsSceneProps> = ({ eventCount, theme, scrollProgress }) => {
  return (
    <div className="events-animation">
      <Suspense fallback={<EventsAnimationFallback />}>
        <Canvas
          camera={{
            position: [0, 0, 6],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
          <TimelineVisualization eventCount={eventCount} theme={theme} scrollProgress={scrollProgress} />
        </Canvas>
      </Suspense>
    </div>
  );
};
