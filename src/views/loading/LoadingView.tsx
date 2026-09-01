import React from 'react';
import { MONUMENT_SKYLINE_PATH } from '../../assets/monumentSkylinePath';
import './LoadingView.scss';

export const LoadingView: React.FC = () => {
  return (
    <>
      <div className="line-top"></div>

      <section className="loading" id="loadingOverlay">
        <div className="logo">
          <img src="/assets/Frame 24.png" alt="Municip'all" id="logoImg" />
        </div>

        <svg
          className="loading-line"
          viewBox="0 0 900 155"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Trait pointillé au sol */}
          <path id="groundDots" d="M 0,132 Q 450,140 900,132" />

          {/* Monuments: Tour Eiffel, Mont Saint-Michel, Pyramide du Louvre, Arc de Triomphe, Viaduc de Millau, Pont du Gard, Notre-Dame de Reims */}
          <path id="mainPath" d={MONUMENT_SKYLINE_PATH} />
        </svg>
      </section>

      <div className="line-bottom"></div>
    </>
  );
};
