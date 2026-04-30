/* eslint-disable */
const fs = require('fs');

let layout = fs.readFileSync('src/test/layout.tsx', 'utf8');

const newDesktopSidebar = `// ── DESKTOP SIDEBAR ───────────────────────────────────
export const DesktopSidebar: React.FC = () => {
  const { currentView, showView } = useApp();

  return (
    <aside className="desktop-sidebar">
      <div className="dsb-logo"><span>NAVIGATION</span></div>
      <button className="dsb-fab" onClick={() => showView('sig')}>＋ Nouveau signalement</button>
      <div className="dsb-section-label">Menu</div>
      <div className={\`dsb-nav-item \${currentView === 'home' ? 'active' : ''}\`} onClick={() => showView('home')}><span className="ni">🏠</span>Accueil</div>
      <div className={\`dsb-nav-item \${currentView === 'demandes' ? 'active' : ''}\`} onClick={() => showView('demandes')}><span className="ni">📋</span>Mes Demandes</div>
      <div className={\`dsb-nav-item \${currentView === 'flux' ? 'active' : ''}\`} onClick={() => showView('flux')}><span className="ni">📡</span>Flux en direct</div>
      <div className={\`dsb-nav-item \${currentView === 'agenda' ? 'active' : ''}\`} onClick={() => showView('agenda')}><span className="ni">📅</span>Agenda</div>
      <div className="dsb-divider"></div>
      <div className="dsb-section-label">Compte</div>
      <div className={\`dsb-nav-item \${currentView === 'profil' ? 'active' : ''}\`} onClick={() => showView('profil')}><span className="ni">👤</span>Mon Profil</div>
      <div className={\`dsb-nav-item \${currentView === 'assos' ? 'active' : ''}\`} onClick={() => showView('assos')}><span className="ni">🤝</span>Associations</div>
      <div className="dsb-divider"></div>
      <div style={{ padding: '.5rem .5rem 0' }}>
        <div style={{ fontSize: '.65rem', color: 'var(--dim)', fontFamily: 'var(--fd)', fontWeight: 600 }}>Municip'All v2.2.0</div>
        <div style={{ fontSize: '.62rem', color: 'var(--dim)', marginTop: '.1rem' }}>RGPD · Confidentialité</div>
      </div>
    </aside>
  );
};`;

layout = layout.replace(/\/\/ ── DESKTOP SIDEBAR ───────────────────────────────────[\s\S]+?};/m, newDesktopSidebar);

const newBottomNav = `// ── BOTTOM NAV (mobile) ───────────────────────────────
export const BottomNav: React.FC = () => {
  const { currentView, showView } = useApp();

  return (
    <nav className="bottomnav">
      <button className={\`nav-tab \${currentView === 'home' ? 'active' : ''}\`} onClick={() => showView('home')}><div className="ni">🏠</div><div className="nl">Accueil</div></button>
      <button className={\`nav-tab \${currentView === 'demandes' ? 'active' : ''}\`} onClick={() => showView('demandes')}><div className="ni">📋</div><div className="nl">Demandes</div></button>
      <button className="fab" onClick={() => showView('sig')}>＋</button>
      <button className={\`nav-tab \${currentView === 'flux' ? 'active' : ''}\`} onClick={() => showView('flux')}><div className="ni">📡</div><div className="nl">Flux Live</div></button>
      <button className={\`nav-tab \${currentView === 'profil' ? 'active' : ''}\`} onClick={() => showView('profil')}><div className="ni">👤</div><div className="nl">Profil</div></button>
    </nav>
  );
};`;

layout = layout.replace(/\/\/ ── BOTTOM NAV \(mobile\) ───────────────────────────────[\s\S]+?};/m, newBottomNav);

fs.writeFileSync('src/test/layout.tsx', layout);
console.log('Rewrote layout.tsx');

let appSrc = `import React from 'react';
import './test/App.css';
import { AppProvider, useApp } from './test/Appcontext';
import { AuthScreen } from './test/authscreen';
import { HomeView } from './test/homeview';
import { SignalementView } from './test/signalementview';
import { TopBar, BottomNav, DesktopSidebar, Toast, MuniBot, NotifDrawer } from './test/layout';
import { DemandesView, FluxView, AgendaView, ProfilView, AssosView } from './test/otherviews';

const MainContent: React.FC = () => {
  const { isAuthenticated, currentView } = useApp();

  if (!isAuthenticated) return <AuthScreen />;

  return (
    <div className="app">
      {/* ──── TOP BAR ──── */}
      <TopBar />

      {/* Notif drawer */}
      <NotifDrawer />

      {/* ──── DESKTOP WRAPPER ──── */}
      <div className="desktop-wrapper">
        
        {/* Desktop Sidebar */}
        <DesktopSidebar />

        {/* ──── MAIN ──── */}
        <main className="main" id="main">
          {currentView === 'home' && <HomeView />}
          {currentView === 'sig' && <SignalementView />}
          {currentView === 'demandes' && <DemandesView />}
          {currentView === 'flux' && <FluxView />}
          {currentView === 'agenda' && <AgendaView />}
          {currentView === 'profil' && <ProfilView />}
          {currentView === 'assos' && <AssosView />}
        </main>
        
        {/* ══════════ BOTTOM NAV (mobile) ══════════ */}
        <BottomNav />

        {/* Toast */}
        <Toast />

      </div>{/* .desktop-wrapper OR .app ? */}

      {/* ══════════ MUNIBOT ══════════ */}
      <MuniBot />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
`;

fs.writeFileSync('src/App.tsx', appSrc);
console.log('Rewrote App.tsx');
