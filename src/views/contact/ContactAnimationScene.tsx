import React, { useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  buildContactFormParticles,
  contactFormFragmentShader,
  contactFormVertexShader,
} from './ContactAnimationData';
import './ContactAnimation.scss';

interface ContactSceneProps {
  theme: 'light' | 'dark';
  focusedField?: number;
}

const FormVisualization: React.FC<{ theme: 'light' | 'dark'; focusedField?: number }> = ({ theme, focusedField = -1 }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const mouseWorld = useRef(new THREE.Vector2(0, 0));
  const mouseStrengthRef = useRef(0);

  const data = useMemo(() => buildContactFormParticles(), []);

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute('aFieldId', new THREE.BufferAttribute(data.fieldIds, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 1));
    geo.setAttribute('aFieldColor', new THREE.BufferAttribute(data.colors, 3));
    return geo;
  }, [data]);

  const sharedUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseStrength: { value: 0 },
      uFocusedField: { value: focusedField },
    }),
    [focusedField]
  );

  const pointsMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: contactFormVertexShader,
        fragmentShader: contactFormFragmentShader,
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
      (materialRef.current as THREE.ShaderMaterial).uniforms.uFocusedField.value = focusedField;
      mouseStrengthRef.current = Math.max(0, mouseStrengthRef.current - 0.04);
      (materialRef.current as THREE.ShaderMaterial).uniforms.uMouseStrength.value = mouseStrengthRef.current;
    }

    if (groupRef.current) {
      groupRef.current.rotation.x += 0.0001;
      groupRef.current.rotation.y += 0.00015;
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;

      mouseWorld.current.x = (x - 0.5) * 6;
      mouseWorld.current.y = (y - 0.5) * 4;
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

const ContactAnimationFallback: React.FC = () => (
  <div className="contact-animation__fallback">
    <div className="contact-animation__fallback-wave" />
  </div>
);

export const ContactAnimationScene: React.FC<ContactSceneProps> = ({ theme, focusedField = -1 }) => {
  return (
    <div className="contact-animation">
      <Suspense fallback={<ContactAnimationFallback />}>
        <Canvas
          camera={{
            position: [0, 0, 4.5],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
          <FormVisualization theme={theme} focusedField={focusedField} />
        </Canvas>
      </Suspense>
    </div>
  );
};
