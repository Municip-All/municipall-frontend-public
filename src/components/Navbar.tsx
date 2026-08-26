import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewName } from '../types';
import './Navbar.scss';

const NAV_LINKS: Array<{ view: ViewName; label: string }> = [
  { view: 'home', label: 'Accueil' },
  { view: 'sig', label: 'Signalements' },
  { view: 'evenement', label: 'Évènements' },
  { view: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<{ active?: ViewName }> = ({ active = 'home' }) => {
  const { showView, toggleNotif, toggleBot, botOpen, user } = useApp();

  const initials = user
    ? (user.prenom[0] ?? '') + (user.nom[0] ?? '')
    : 'M';

  return (
    <nav className="navbar">
      <button type="button" className="navbar__logo" onClick={() => showView('home')}>
        Municip<span>'All</span>
      </button>

      <ul className="navbar__links">
        {NAV_LINKS.map(l => (
          <li key={l.view}>
            <button
              type="button"
              className={`navbar__link${active === l.view ? ' navbar__link--active' : ''}`}
              onClick={() => showView(l.view)}
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="navbar__right">
        <button
          type="button"
          className={`navbar__icon-btn${botOpen ? ' navbar__icon-btn--active' : ''}`}
          onClick={toggleBot}
          title="Assistant MuniBot"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </button>

        <button type="button" className="navbar__icon-btn" onClick={toggleNotif} title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="navbar__notif-dot" />
        </button>

        <button
          type="button"
          className="navbar__avatar"
          onClick={() => showView('profil')}
          title="Mon profil"
        >
          {initials.toUpperCase()}
        </button>
      </div>
    </nav>
  );
};
