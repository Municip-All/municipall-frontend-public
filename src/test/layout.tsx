import React, { useState, useEffect, useRef } from 'react';
import { useApp } from './Appcontext';
import { ViewName } from '../types';
import { NOTIFICATIONS, BOT_RESPONSES } from '../data';

// ── TOP BAR ──────────────────────────────────────────
export const TopBar: React.FC = () => {
  const { currentView, showView, user, toggleNotif, notifOpen, toggleBot } = useApp();
  const showBack = currentView !== 'home';
  const titles: Record<ViewName, string> = {
    home: `${user?.ville || 'Municip\'All'} · ${user?.codePostal || ''}`,
    sig: 'Nouveau Signalement',
    demandes: 'Mes Demandes',
    flux: 'Flux en Direct',
    agenda: 'Agenda',
    profil: 'Mon Profil',
    assos: 'Associations',
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className={`topbar__back ${showBack ? 'show' : ''}`} onClick={() => showView('home')}>←</button>
        <div className="topbar__logo">
          <div className="topbar__mark">M</div>
          <div>
            <div className="topbar__name">Municip<span style={{ color: 'var(--accent)' }}>'All</span></div>
            <div className="topbar__commune">{titles[currentView]}</div>
          </div>
        </div>
      </div>
      <div className="topbar__right">
        <button className="icon-btn" onClick={toggleBot} title="Assistant IA">🤖</button>
        <button className="icon-btn" onClick={toggleNotif} id="bellBtn" title="Notifications">
          🔔<div className="badge" />
        </button>
        <div className="avatar-btn" onClick={() => showView('profil')}>{user?.avatar || 'MB'}</div>
      </div>
    </header>
  );
};

// ── NOTIF DRAWER ─────────────────────────────────────
export const NotifDrawer: React.FC = () => {
  const { notifOpen, closeNotif } = useApp();
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#notifDrawer') && !target.closest('#bellBtn')) closeNotif();
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [closeNotif]);

  return (
    <div className={`notif-drawer ${notifOpen ? 'open' : ''}`} id="notifDrawer">
      {NOTIFICATIONS.map((n: any) => (
        <div key={n.id} className="notif-item">
          {!n.read && <div className="notif-dot" />}
          <div className="notif-icon">{n.icon}</div>
          <div>
            <div className="notif-text" dangerouslySetInnerHTML={{ __html: n.text }} />
            <div className="notif-time">{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── BOTTOM NAV (mobile) ───────────────────────────────
export const BottomNav: React.FC = () => {
  const { currentView, showView } = useApp();

  return (
    <nav className="bottomnav">
      <button className={`nav-tab ${currentView === 'home' ? 'active' : ''}`} onClick={() => showView('home')}><div className="ni">🏠</div><div className="nl">Accueil</div></button>
      <button className={`nav-tab ${currentView === 'demandes' ? 'active' : ''}`} onClick={() => showView('demandes')}><div className="ni">📋</div><div className="nl">Demandes</div></button>
      <button className="fab" onClick={() => showView('sig')}>＋</button>
      <button className={`nav-tab ${currentView === 'flux' ? 'active' : ''}`} onClick={() => showView('flux')}><div className="ni">📡</div><div className="nl">Flux Live</div></button>
      <button className={`nav-tab ${currentView === 'profil' ? 'active' : ''}`} onClick={() => showView('profil')}><div className="ni">👤</div><div className="nl">Profil</div></button>
    </nav>
  );
};

// ── DESKTOP SIDEBAR ───────────────────────────────────
export const DesktopSidebar: React.FC = () => {
  const { currentView, showView } = useApp();

  return (
    <aside className="desktop-sidebar">
      <div className="dsb-logo"><span>NAVIGATION</span></div>
      <button className="dsb-fab" onClick={() => showView('sig')}>＋ Nouveau signalement</button>
      <div className="dsb-section-label">Menu</div>
      <div className={`dsb-nav-item ${currentView === 'home' ? 'active' : ''}`} onClick={() => showView('home')}><span className="ni">🏠</span>Accueil</div>
      <div className={`dsb-nav-item ${currentView === 'demandes' ? 'active' : ''}`} onClick={() => showView('demandes')}><span className="ni">📋</span>Mes Demandes</div>
      <div className={`dsb-nav-item ${currentView === 'flux' ? 'active' : ''}`} onClick={() => showView('flux')}><span className="ni">📡</span>Flux en direct</div>
      <div className={`dsb-nav-item ${currentView === 'agenda' ? 'active' : ''}`} onClick={() => showView('agenda')}><span className="ni">📅</span>Agenda</div>
      <div className="dsb-divider"></div>
      <div className="dsb-section-label">Compte</div>
      <div className={`dsb-nav-item ${currentView === 'profil' ? 'active' : ''}`} onClick={() => showView('profil')}><span className="ni">👤</span>Mon Profil</div>
      <div className={`dsb-nav-item ${currentView === 'assos' ? 'active' : ''}`} onClick={() => showView('assos')}><span className="ni">🤝</span>Associations</div>
      <div className="dsb-divider"></div>
      <div style={{ padding: '.5rem .5rem 0' }}>
        <div style={{ fontSize: '.65rem', color: 'var(--dim)', fontFamily: 'var(--fd)', fontWeight: 600 }}>Municip'All v2.2.0</div>
        <div style={{ fontSize: '.62rem', color: 'var(--dim)', marginTop: '.1rem' }}>RGPD · Confidentialité</div>
      </div>
    </aside>
  );
};

// ── TOAST ────────────────────────────────────────────
export const Toast: React.FC = () => {
  const { toast } = useApp();
  return <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>;
};

// ── MUNIBOT ───────────────────────────────────────────
interface BotMessage { id: number; role: 'bot' | 'user'; text: string; time: string; typing?: boolean; }

export const MuniBot: React.FC = () => {
  const { botOpen, toggleBot, pendingBotMsg, clearPendingBotMsg } = useApp();
  const [messages, setMessages] = useState<BotMessage[]>([
    { id: 0, role: 'bot', text: 'Bonjour 👋 Je suis <strong>Muni-Bot</strong>. Comment puis-je vous aider ?', time: 'Maintenant' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (pendingBotMsg) { setInput(pendingBotMsg); clearPendingBotMsg(); setTimeout(() => sendMessage(pendingBotMsg), 50); }
  }, [pendingBotMsg]);

  const now = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const sendMessage = (override?: string) => {
    const msg = (override ?? input).trim();
    if (!msg) return;
    setInput('');
    const userId = Date.now();
    setMessages(prev => [...prev, { id: userId, role: 'user', text: msg, time: now() }]);
    const typId = userId + 1;
    setMessages(prev => [...prev, { id: typId, role: 'bot', text: '', time: '', typing: true }]);
    setTimeout(() => {
      const lower = msg.toLowerCase();
      const key = Object.keys(BOT_RESPONSES).find(k => lower.includes(k)) ?? 'default';
      const reply = BOT_RESPONSES[key];
      setMessages(prev => prev.map(m => m.id === typId ? { ...m, typing: false, text: reply, time: now() } : m));
    }, 1100);
  };

  const quickReplies = ['🛣️ Signaler', '🏛️ Horaires', '🚲 Aide vélo', '📋 Mes demandes'];
  const quickMessages = ['Signaler un problème', 'Horaires Mairie', 'Aide vélo disponible ?', 'État de ma demande'];

  return (
    <div className={`bot-overlay ${botOpen ? 'open' : ''}`}>
      <div className="bot-header">
        <div className="bot-ava">🤖</div>
        <div><div className="bot-name">Muni-Bot</div><div className="bot-desc">Assistant IA · 24h/24</div></div>
        <button className="bot-close" onClick={toggleBot}>✕</button>
      </div>

      <div className="bot-messages">
        {messages.map(m => (
          <div key={m.id} className={`msg ${m.role}`}>
            {m.typing ? (
              <div className="typing-indicator">
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            ) : (
              <>
                <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: m.text }} />
                <div className="msg-time">{m.time}</div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-replies">
        {quickReplies.map((label, i) => (
          <button key={i} className="qr-btn" onClick={() => sendMessage(quickMessages[i])}>{label}</button>
        ))}
      </div>

      <div className="bot-input-row">
        <input className="bot-input" placeholder="Votre message…" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }} />
        <button className="bot-send" onClick={() => sendMessage()}>➤</button>
      </div>
    </div>
  );
};