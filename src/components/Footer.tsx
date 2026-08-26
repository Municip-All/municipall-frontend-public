import React from 'react';
import './Footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          Municip<span>'All</span>
          <span className="footer__tagline"> · Démocratie de proximité</span>
        </div>
        <ul className="footer__links">
          <li><span>Solutions</span></li>
          <li><span>À propos</span></li>
          <li><span>Contact</span></li>
          <li><span>RGPD</span></li>
        </ul>
        <p className="footer__legal">© 2026 Municip'All. Tous droits réservés.</p>
      </div>
    </footer>
  );
};
