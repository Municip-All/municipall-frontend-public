import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewName, NotifItem } from '../../types';
import { NOTIFICATIONS } from '../../data';
import DOMPurify from 'dompurify';
import { ThemeToggle } from '../../components';
import './PageLayout.scss';

const LINKS: Array<{ view: ViewName; label: string }> = [
  { view: 'home', label: 'Accueil' },
  { view: 'sig', label: 'Signalements' },
  { view: 'evenement', label: 'Évènements' },
  { view: 'contact', label: 'Contact' },
];

export const TopNav: React.FC<{ active?: ViewName }> = ({ active = 'home' }) => {
  const { showView, toggleNotif, toggleBot, botOpen, user } = useApp();
  const initials = user ? (user.prenom[0] ?? '') + (user.nom[0] ?? '') : 'M';

  return (
    <nav className="pl-nav">
      <span className="pl-nav-logo" onClick={() => showView('home')} role="button" aria-label="Accueil" tabIndex={0}>Municip<span>'All</span></span>
      <ul className="pl-nav-links">
        {LINKS.map(l => (
          <li key={l.view}>
            <button className={`pl-nav-link${active === l.view ? ' pl-nav-link--on' : ''}`} onClick={() => showView(l.view)}>{l.label}</button>
          </li>
        ))}
      </ul>
      <div className="pl-nav-right">
        <ThemeToggle />
        <button type="button" className={`pl-nav-icon${botOpen ? ' pl-nav-icon--on' : ''}`} onClick={toggleBot} title="Assistant MuniBot">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        </button>
        <button type="button" className="pl-nav-icon" onClick={toggleNotif} title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span className="pl-nav-dot" />
        </button>
        <button type="button" className="pl-nav-avatar" onClick={() => showView('profil')} aria-label="Profil">{initials.toUpperCase()}</button>
      </div>
    </nav>
  );
};

export { MuniBot } from '../chatbot/ChatBot';

export const NotifDrawer: React.FC = () => {
  const { notifOpen, closeNotif } = useApp();
  const [items, setItems] = React.useState<NotifItem[]>(NOTIFICATIONS);

  React.useEffect(() => {
    if (!notifOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeNotif(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [notifOpen, closeNotif]);

  if (!notifOpen) return null;

  const unreadCount = items.filter(n => !n.read).length;
  const markItem = (id: number | string) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAll = () => setItems(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <>
      <div className="nd-backdrop" onClick={closeNotif} />
      <div className="nd-panel">
        <div className="nd-header">
          <div className="nd-header-left">
            <div className="nd-title">Notifi<em>cations</em></div>
            <div className="nd-subtitle">Vos dernières alertes municipales</div>
          </div>
          <div className={`nd-badge${unreadCount === 0 ? ' nd-badge--zero' : ''}`}>
            {unreadCount === 0 ? '✓ Lu' : `${unreadCount} non lu${unreadCount > 1 ? 's' : ''}`}
          </div>
          <button className="nd-close" onClick={closeNotif} title="Fermer (Echap)">✕</button>
        </div>
        {items.length === 0 ? (
          <div className="nd-empty"><div className="nd-empty-icon">🔔</div>Aucune notification pour l'instant.</div>
        ) : (
          <div className="nd-list">
            {items.map(n => (
              <div key={n.id} className={`nd-item${n.read ? '' : ' nd-item--unread'}`} onClick={() => markItem(n.id)}>
                <div className="nd-item-icon">{n.icon}</div>
                <div className="nd-item-body">
                  <div className="nd-item-text" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(n.text) }} />
                  <div className="nd-item-time">{n.time}</div>
                </div>
                {!n.read && <div className="nd-unread-dot" />}
              </div>
            ))}
          </div>
        )}
        <div className="nd-footer">
          <button className="nd-mark-read" onClick={markAll} disabled={unreadCount === 0}>
            {unreadCount === 0 ? 'Tout est lu ✓' : 'Tout marquer comme lu'}
          </button>
        </div>
      </div>
    </>
  );
};

export const PageLayout: React.FC<{ active?: ViewName; children: React.ReactNode }> = ({ active, children }) => (
  <div className="pl-root">
    <TopNav active={active} />
    {children}
  </div>
);
