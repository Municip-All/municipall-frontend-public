import React, { useEffect } from 'react';
import { useApp } from './Appcontext';
import { ViewName, NotifItem } from '../types';
import { NOTIFICATIONS } from '../data';

export const sharedCss = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');

@keyframes ma-up {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ma-blob-1 {
  0%,100% { transform: translate(0,0) scale(1); }
  50%     { transform: translate(28px,-18px) scale(1.03); }
}
@keyframes ma-blob-2 {
  0%,100% { transform: translate(0,0) scale(1); }
  55%     { transform: translate(-22px,24px) scale(.97); }
}
@keyframes ma-blob-3 {
  0%,100% { transform: translate(0,0) scale(1); }
  60%     { transform: translate(14px,22px) scale(1.02); }
}

/* ── TopNav ────────────────────────────────────────── */
.tnav {
  position: sticky; top: 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 3.5rem; height: 64px;
  background: rgba(250,250,248,.93);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(15,15,14,.07);
}
.tnav-logo {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 1.2rem; color: #0F0F0E; letter-spacing: -.3px; cursor: pointer;
}
.tnav-logo span { color: #3B558F; }
.tnav-links { display: flex; gap: 2.25rem; list-style: none; margin: 0; padding: 0; }
.tnav-links button {
  font-size: .84rem; font-weight: 500; color: rgba(15,15,14,.38);
  background: none; border: none; transition: color .2s;
  letter-spacing: .01em; cursor: pointer; font-family: 'Inter', sans-serif; padding: 0;
}
.tnav-links button:hover { color: rgba(15,15,14,.75); }
.tnav-links button.on { color: #0F0F0E; }
.tnav-right { display: flex; align-items: center; gap: 1rem; }
.tnav-notif {
  width: 36px; height: 36px; border-radius: 50%;
  background: #F4F2ED; border: 1px solid rgba(15,15,14,.1);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; position: relative; transition: background .2s;
}
.tnav-notif:hover { background: #ECEAE4; }
.tnav-notif-dot {
  position: absolute; top: 7px; right: 7px; width: 7px; height: 7px;
  border-radius: 50%; background: #C62828; border: 1.5px solid #FAFAF8;
}
.tnav-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #1A3A8F, #7B8FCC);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: .82rem; color: #fff; cursor: pointer;
  box-shadow: 0 2px 12px rgba(26,58,143,.22);
}

/* ── Page root ─────────────────────────────────────── */
.ma-root {
  position: fixed; inset: 0; overflow-y: auto; overflow-x: hidden;
  background: #FAFAF8; font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased; color: #0F0F0E;
  scrollbar-width: thin; scrollbar-color: rgba(15,15,14,.12) transparent;
}
.ma-root::-webkit-scrollbar { width: 6px; }
.ma-root::-webkit-scrollbar-track { background: transparent; }
.ma-root::-webkit-scrollbar-thumb { background: rgba(15,15,14,.12); border-radius: 3px; }

/* ── Hero ──────────────────────────────────────────── */
.ma-hero {
  position: relative; overflow: hidden; background: #F4F2ED;
  padding: 4rem 3.5rem 3.5rem; border-bottom: 1px solid rgba(15,15,14,.07);
  display: flex; align-items: center; justify-content: space-between; gap: 3rem;
}
.ma-hero-blob {
  position: absolute; border-radius: 50%; filter: blur(72px); pointer-events: none;
}
.ma-hero-b1 { width: 520px; height: 380px; top: -150px; right: -80px; animation: ma-blob-1 15s ease-in-out infinite; }
.ma-hero-b2 { width: 360px; height: 280px; bottom: -70px; left: -60px; animation: ma-blob-2 21s ease-in-out 2s infinite; }
.ma-hero-b3 { width: 240px; height: 200px; top: 40%; right: 28%; animation: ma-blob-3 26s ease-in-out 1s infinite; }
.ma-hero-ghost {
  position: absolute; bottom: -2.5rem; right: -1.5rem;
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: clamp(120px, 15vw, 210px); line-height: 1;
  color: transparent; -webkit-text-stroke: 1px rgba(59,85,143,.055);
  pointer-events: none; user-select: none; letter-spacing: -6px; white-space: nowrap;
}
.ma-hero-left { position: relative; z-index: 1; flex: 1; }
.ma-hero-right { position: relative; z-index: 1; flex-shrink: 0; }

.ma-eyebrow {
  font-size: .72rem; font-weight: 600; letter-spacing: .14em;
  text-transform: uppercase; color: #3B558F; margin-bottom: .85rem;
  animation: ma-up .7s cubic-bezier(.22,1,.36,1) .1s both;
}
.ma-h1 {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: clamp(2.2rem, 3.5vw, 3.1rem); letter-spacing: -1.8px;
  color: #0F0F0E; line-height: 1.08; margin-bottom: .5rem;
  animation: ma-up .75s cubic-bezier(.22,1,.36,1) .2s both;
}
.ma-h1 em { font-style: italic; color: #3B558F; }
.ma-sub {
  font-size: .96rem; color: rgba(15,15,14,.45); line-height: 1.65; max-width: 520px;
  animation: ma-up .75s cubic-bezier(.22,1,.36,1) .32s both;
}

/* ── Hero stat blocks ──────────────────────────────── */
.ma-hero-stats {
  display: flex; border: 1px solid rgba(15,15,14,.1); border-radius: 12px;
  overflow: hidden; background: rgba(250,250,248,.88); backdrop-filter: blur(8px);
  animation: ma-up .75s cubic-bezier(.22,1,.36,1) .42s both;
}
.ma-stat-block {
  padding: 1.35rem 1.75rem; border-right: 1px solid rgba(15,15,14,.08); text-align: center;
}
.ma-stat-block:last-child { border-right: none; }
.ma-stat-num {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 2.3rem; letter-spacing: -1.5px; color: #0F0F0E; line-height: 1;
}
.ma-stat-num em { font-style: normal; color: #3B558F; }
.ma-stat-label {
  font-size: .63rem; font-weight: 600; letter-spacing: .09em;
  text-transform: uppercase; color: rgba(15,15,14,.28); margin-top: .3rem;
}

/* ── Content wrapper ───────────────────────────────── */
.ma-content { max-width: 1160px; margin: 0 auto; padding: 0 3.5rem 5rem; }

/* ── Section head ──────────────────────────────────── */
.ma-sec-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin: 3.25rem 0 1.6rem; padding-bottom: 1.1rem;
  border-bottom: 1px solid rgba(15,15,14,.08);
}
.ma-sec-label {
  font-size: .67rem; font-weight: 600; letter-spacing: .14em;
  text-transform: uppercase; color: rgba(15,15,14,.28); margin-bottom: .45rem;
}
.ma-sec-title {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 1.55rem; letter-spacing: -.9px; color: #0F0F0E; line-height: 1.1;
}
.ma-sec-title em { font-style: italic; color: #3B558F; }
.ma-sec-action {
  font-size: .8rem; font-weight: 500; color: rgba(15,15,14,.28);
  cursor: pointer; transition: color .2s; white-space: nowrap;
  background: none; border: none; font-family: 'Inter', sans-serif;
}
.ma-sec-action:hover { color: #0F0F0E; }

/* ── Badge ─────────────────────────────────────────── */
.ma-badge {
  font-size: .6rem; font-weight: 600; letter-spacing: .06em;
  text-transform: uppercase; padding: .22rem .62rem; border-radius: 20px; display: inline-block;
}
.ma-badge.en-cours  { background: rgba(59,85,143,.1);  color: #3B558F; }
.ma-badge.attente   { background: rgba(157,110,70,.12); color: #9D6E46; }
.ma-badge.resolu    { background: rgba(24,109,16,.1);   color: #186D10; }
.ma-badge.perturbe  { background: rgba(198,40,40,.1);   color: #C62828; }
.ma-badge.planifie  { background: rgba(107,79,160,.1);  color: #6B4FA0; }
.ma-badge.normal    { background: rgba(24,109,16,.1);   color: #186D10; }
.ma-badge.info      { background: rgba(59,85,143,.1);   color: #3B558F; }

/* ── Card base ─────────────────────────────────────── */
.ma-card {
  background: #F4F2ED; border: 1px solid rgba(15,15,14,.08); border-radius: 12px;
  transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s, border-color .22s;
}
.ma-card:hover {
  transform: translateY(-3px); box-shadow: 0 8px 28px rgba(15,15,14,.08);
  border-color: rgba(15,15,14,.14);
}

/* ── Filter chips ──────────────────────────────────── */
.ma-chips { display: flex; gap: .6rem; flex-wrap: wrap; margin-bottom: 1.75rem; }
.ma-chip {
  padding: .38rem .95rem; border-radius: 2rem; font-size: .78rem; font-weight: 500;
  border: 1px solid rgba(15,15,14,.12); background: transparent; color: rgba(15,15,14,.45);
  cursor: pointer; transition: all .18s; font-family: 'Inter', sans-serif;
}
.ma-chip:hover { border-color: rgba(15,15,14,.28); color: #0F0F0E; }
.ma-chip.on { background: #0F0F0E; color: #FAFAF8; border-color: #0F0F0E; }

/* ── Buttons ───────────────────────────────────────── */
.ma-btn {
  padding: .85rem 2rem; background: #0F0F0E; border: 1px solid #0F0F0E; border-radius: 2rem;
  font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 500; color: #FAFAF8;
  cursor: pointer; letter-spacing: .02em; display: inline-flex; align-items: center; gap: .5rem;
  transition: background .22s, border-color .22s, transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s;
}
.ma-btn:hover {
  background: #1A3A8F; border-color: #1A3A8F;
  transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,58,143,.22);
}
.ma-btn-ghost {
  padding: .82rem 1.8rem; background: transparent; border: 1px solid rgba(15,15,14,.18);
  border-radius: 2rem; font-family: 'Inter', sans-serif; font-size: .88rem; font-weight: 500;
  color: #0F0F0E; cursor: pointer; letter-spacing: .02em;
  display: inline-flex; align-items: center; gap: .5rem; transition: border-color .2s, transform .2s;
}
.ma-btn-ghost:hover { border-color: #0F0F0E; transform: translateY(-1px); }

/* ── Form ──────────────────────────────────────────── */
.ma-field { margin-bottom: 1rem; }
.ma-field-label {
  display: block; font-size: .68rem; font-weight: 500;
  letter-spacing: .07em; text-transform: uppercase;
  color: rgba(15,15,14,.35); margin-bottom: .42rem;
}
.ma-input, .ma-textarea, .ma-select {
  width: 100%; padding: .74rem .95rem;
  background: #FAFAF8; border: 1px solid rgba(15,15,14,.12); border-radius: 6px;
  font-size: .9rem; font-family: 'Inter', sans-serif; color: #0F0F0E;
  outline: none; box-sizing: border-box;
  transition: border-color .2s, box-shadow .2s, background .2s; appearance: none;
}
.ma-input::placeholder, .ma-textarea::placeholder { color: rgba(15,15,14,.25); }
.ma-input:focus, .ma-textarea:focus, .ma-select:focus {
  border-color: rgba(15,15,14,.42); background: #fff; box-shadow: 0 0 0 3px rgba(15,15,14,.04);
}
.ma-textarea { resize: none; line-height: 1.55; }
.ma-select option { background: #fff; }

/* ── Info card ─────────────────────────────────────── */
.ma-info-card {
  background: #F4F2ED; border: 1px solid rgba(15,15,14,.08);
  border-radius: 16px; overflow: hidden;
}
.ma-info-head {
  padding: 1.4rem 1.5rem 1.1rem; border-bottom: 1px solid rgba(15,15,14,.07);
}
.ma-info-head-label {
  font-size: .64rem; font-weight: 600; letter-spacing: .13em;
  text-transform: uppercase; color: rgba(15,15,14,.28); margin-bottom: .4rem;
}
.ma-info-head-title {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 1.15rem; letter-spacing: -.4px; color: #0F0F0E;
}
.ma-info-body { padding: 1.1rem 1.5rem; }
.ma-info-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: .72rem 0; border-bottom: 1px solid rgba(15,15,14,.06);
  font-size: .84rem; gap: 1rem;
}
.ma-info-row:last-child { border-bottom: none; }
.ma-info-row-label { color: rgba(15,15,14,.42); flex-shrink: 0; }
.ma-info-row-val { font-weight: 500; color: #0F0F0E; text-align: right; }

/* ── Alerts ────────────────────────────────────────── */
.ma-alert {
  padding: .9rem 1.1rem; border-radius: 10px;
  display: flex; align-items: flex-start; gap: .75rem;
  font-size: .84rem; line-height: 1.55; margin-bottom: 1.5rem;
}
.ma-alert.success { background: rgba(24,109,16,.05); border: 1px solid rgba(24,109,16,.15); color: #186D10; }
.ma-alert.danger  { background: rgba(198,40,40,.05); border: 1px solid rgba(198,40,40,.15); color: #C62828; }
.ma-alert.info    { background: rgba(59,85,143,.05);  border: 1px solid rgba(59,85,143,.15);  color: #3B558F; }
.ma-alert.warn    { background: rgba(157,110,70,.07); border: 1px solid rgba(157,110,70,.2);  color: #9D6E46; }

/* ── Grid helpers ──────────────────────────────────── */
.ma-two-col   { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; align-items: start; }
.ma-three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.ma-four-col  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
.ma-five-col  { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.25rem; }

/* ── Divider ───────────────────────────────────────── */
.ma-divider { height: 1px; background: rgba(15,15,14,.08); margin: 1.75rem 0; }

/* ── Empty state ───────────────────────────────────── */
.ma-empty { padding: 3.5rem 2rem; text-align: center; font-size: .9rem; color: rgba(15,15,14,.3); font-style: italic; }
`;

export const TopNav: React.FC<{ active?: ViewName }> = ({ active = 'home' }) => {
  const { showView, toggleNotif, user } = useApp();

  useEffect(() => {
    const id = 'municipall-shared-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = sharedCss;
      document.head.appendChild(s);
    }
  }, []);

  const LINKS: Array<{ view: ViewName; label: string }> = [
    { view: 'home',      label: 'Accueil' },
    { view: 'sig',       label: 'Signalements' },
    { view: 'evenement', label: 'Évènements' },
    { view: 'contact',   label: 'Contact' },
  ];

  return (
    <nav className="tnav">
      <span className="tnav-logo" onClick={() => showView('home')}>
        Municip<span>'All</span>
      </span>
      <ul className="tnav-links">
        {LINKS.map(l => (
          <li key={l.view}>
            <button className={active === l.view ? 'on' : ''} onClick={() => showView(l.view)}>
              {l.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tnav-right">
        <div className="tnav-notif" onClick={toggleNotif}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#0F0F0E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <div className="tnav-notif-dot" />
        </div>
        <div className="tnav-avatar" onClick={() => showView('profil')}>
          {user?.avatar ?? 'M'}
        </div>
      </div>
    </nav>
  );
};

export const BottomNav: React.FC      = () => null;
export const DesktopSidebar: React.FC = () => null;
export const Toast: React.FC          = () => null;
export { MuniBot } from './chatbot';
export const AppEdgeRules: React.FC   = () => null;
export const FloatingMapBtn: React.FC = () => null;

/* ── NotifDrawer ───────────────────────────────────── */

const ndCss = `
@keyframes nd-slide-in  { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes nd-slide-out { from { transform: translateX(0);    opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
@keyframes nd-fade-in   { from { opacity: 0; } to { opacity: 1; } }

.nd-backdrop {
  position: fixed; inset: 0; z-index: 150;
  background: rgba(15,15,14,.35); backdrop-filter: blur(3px);
  animation: nd-fade-in .22s ease both;
}
.nd-panel {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 151;
  width: 400px; max-width: 100vw;
  background: #FAFAF8; display: flex; flex-direction: column;
  box-shadow: -8px 0 48px rgba(15,15,14,.14);
  border-left: 1px solid rgba(15,15,14,.08);
  animation: nd-slide-in .28s cubic-bezier(.22,1,.36,1) both;
  font-family: 'Inter', sans-serif;
}

.nd-header {
  padding: 1.4rem 1.5rem 1.1rem;
  border-bottom: 1px solid rgba(15,15,14,.08);
  display: flex; align-items: center; gap: .9rem;
  flex-shrink: 0;
  background: rgba(250,250,248,.97);
}
.nd-header-left { flex: 1; }
.nd-title {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 1.25rem; letter-spacing: -.5px; color: #0F0F0E; line-height: 1.1;
}
.nd-title em { font-style: italic; color: #3B558F; }
.nd-subtitle { font-size: .74rem; color: rgba(15,15,14,.35); margin-top: .18rem; }

.nd-badge {
  padding: .25rem .65rem; border-radius: 1rem;
  background: #C62828; color: #fff;
  font-size: .7rem; font-weight: 700; letter-spacing: .04em;
  flex-shrink: 0;
}
.nd-badge.zero { background: rgba(15,15,14,.1); color: rgba(15,15,14,.45); }

.nd-close {
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(15,15,14,.06); border: 1px solid rgba(15,15,14,.09);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: .85rem; flex-shrink: 0; transition: background .18s; color: #0F0F0E;
}
.nd-close:hover { background: rgba(15,15,14,.13); }

.nd-list { flex: 1; overflow-y: auto; padding: .5rem 0; }
.nd-list::-webkit-scrollbar { width: 4px; }
.nd-list::-webkit-scrollbar-thumb { background: rgba(15,15,14,.1); border-radius: 2px; }

.nd-item {
  display: flex; align-items: flex-start; gap: 1rem;
  padding: 1rem 1.5rem; cursor: pointer;
  border-bottom: 1px solid rgba(15,15,14,.05);
  transition: background .15s; position: relative;
}
.nd-item:hover { background: rgba(15,15,14,.025); }
.nd-item.unread { background: rgba(59,85,143,.03); }
.nd-item.unread:hover { background: rgba(59,85,143,.06); }

.nd-item-icon {
  width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; background: rgba(15,15,14,.05);
  border: 1px solid rgba(15,15,14,.07);
}
.nd-item.unread .nd-item-icon { background: rgba(59,85,143,.09); border-color: rgba(59,85,143,.14); }

.nd-item-body { flex: 1; min-width: 0; }
.nd-item-text {
  font-size: .84rem; color: rgba(15,15,14,.72); line-height: 1.55;
}
.nd-item-text strong { color: #0F0F0E; font-weight: 600; }
.nd-item-time { font-size: .7rem; color: rgba(15,15,14,.3); margin-top: .3rem; }

.nd-unread-dot {
  position: absolute; top: 1.15rem; right: 1.2rem;
  width: 7px; height: 7px; border-radius: 50%;
  background: #3B558F; border: 1.5px solid #FAFAF8;
}

.nd-footer {
  padding: 1rem 1.5rem; border-top: 1px solid rgba(15,15,14,.07);
  flex-shrink: 0; display: flex; justify-content: center;
}
.nd-mark-read {
  background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif;
  font-size: .8rem; font-weight: 500; color: rgba(15,15,14,.38);
  letter-spacing: .02em; transition: color .18s; padding: .4rem 1rem;
  border-radius: 2rem;
}
.nd-mark-read:hover { color: #3B558F; background: rgba(59,85,143,.07); }

.nd-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: .75rem;
  color: rgba(15,15,14,.28); font-size: .88rem; padding: 3rem;
}
.nd-empty-icon { font-size: 2.5rem; opacity: .4; }
`;

export const NotifDrawer: React.FC = () => {
  const { notifOpen, closeNotif } = useApp();
  const [items, setItems] = React.useState<NotifItem[]>(NOTIFICATIONS);

  useEffect(() => {
    const id = 'municipall-nd-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = ndCss;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeNotif(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [notifOpen, closeNotif]);

  if (!notifOpen) return null;

  const unreadCount = items.filter(n => !n.read).length;

  const markItem = (id: number) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
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
          <div className={`nd-badge${unreadCount === 0 ? ' zero' : ''}`}>
            {unreadCount === 0 ? '✓ Lu' : `${unreadCount} non lu${unreadCount > 1 ? 's' : ''}`}
          </div>
          <button className="nd-close" onClick={closeNotif} title="Fermer (Echap)">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="nd-empty">
            <div className="nd-empty-icon">🔔</div>
            Aucune notification pour l'instant.
          </div>
        ) : (
          <div className="nd-list">
            {items.map(n => (
              <div
                key={n.id}
                className={`nd-item${n.read ? '' : ' unread'}`}
                onClick={() => markItem(n.id)}
              >
                <div className="nd-item-icon">{n.icon}</div>
                <div className="nd-item-body">
                  <div
                    className="nd-item-text"
                    dangerouslySetInnerHTML={{ __html: n.text }}
                  />
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
