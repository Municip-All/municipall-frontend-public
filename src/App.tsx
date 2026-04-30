import React from 'react';
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
