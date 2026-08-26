import React from 'react';
import './Loading.scss';

export const Spinner: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <div className={`spinner ${className}`} style={{ width: size, height: size }}>
    <div className="spinner__ring" />
  </div>
);

export const Skeleton: React.FC<{ width?: string; height?: string; radius?: string; className?: string }> = ({
  width = '100%',
  height = '16px',
  radius = '4px',
  className = '',
}) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius: radius }}
  />
);

export const PageLoader: React.FC = () => (
  <div className="page-loader">
    <Spinner size={32} />
    <p className="page-loader__text">Chargement…</p>
  </div>
);
