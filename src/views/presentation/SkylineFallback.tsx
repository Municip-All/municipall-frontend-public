import React from 'react';
import { MONUMENT_SKYLINE_PATH } from '../../assets/monumentSkylinePath';
import './SkylineFallback.scss';

/**
 * Motionless stand-in for the WebGL journey — used for `prefers-reduced-motion`
 * and for browsers without a WebGL context. Deliberately kept free of any
 * three.js import so it stays in the main bundle.
 */
export const StaticSkylineFallback: React.FC = () => (
  <div className="cj-fallback" aria-hidden="true">
    <svg viewBox="0 0 900 155" preserveAspectRatio="xMidYMid meet">
      <path d={MONUMENT_SKYLINE_PATH} />
    </svg>
  </div>
);
