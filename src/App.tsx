import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthScreen } from './views/auth/AuthScreen';
import { HomeView } from './views/home/HomeView';
import { LoadingView } from './views/loading/LoadingView';
import { PresentationView } from './views/presentation/PresentationView';
import { ReportsView } from './views/reports/ReportsView';
import { EventsView } from './views/events/EventsView';
import { ContactView } from './views/contact/ContactView';
import { ProfileView } from './views/profile/ProfileView';
import { CollecteView } from './views/collecte/CollecteView';
import { TravauxView } from './views/travaux/TravauxView';
import { TransportsView } from './views/transports/TransportsView';
import { SocialView } from './views/social/SocialView';
import { NotifDrawer, MuniBot } from './views/layout/PageLayout';
import { ViewName } from './types';

const VIEW_LABELS: Record<ViewName, string> = {
  home: 'Accueil',
  sig: 'Signalements',
  evenement: 'Évènements',
  contact: 'Contact',
  profil: 'Mon Profil',
  collecte: 'Déchets & Toilettes',
  travaux: 'Travaux',
  transports: 'Transports',
  social: 'Social',
};

const MainContent: React.FC = () => {
  const { isAuthenticated, isAuthLoading, currentView, showView } = useApp();
  if (isAuthLoading) return <LoadingView />;
  if (!isAuthenticated) return <AuthScreen />;

  switch (currentView) {
    case 'home': return <HomeView />;
    case 'sig': return <ReportsView />;
    case 'evenement': return <EventsView />;
    case 'contact': return <ContactView />;
    case 'profil': return <ProfileView />;
    case 'collecte': return <CollecteView />;
    case 'travaux': return <TravauxView />;
    case 'transports': return <TransportsView />;
    case 'social': return <SocialView />;
    default: return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.8rem', letterSpacing: '-1.5px', color: 'var(--color-ink)' }}><em>{VIEW_LABELS[currentView as ViewName]}</em></h1>
        <p style={{ fontSize: '.9rem', color: 'var(--color-neutral-500)' }}>Cette page sera bientôt disponible.</p>
        <button style={{ marginTop: '.5rem', padding: '.8rem 1.8rem', background: 'var(--color-ink)', border: 'none', borderRadius: '2rem', fontFamily: 'var(--font-body)', fontSize: '.88rem', fontWeight: 500, color: 'var(--color-neutral-50)', cursor: 'pointer' }} onClick={() => showView('home')}>← Retour à l'accueil</button>
      </div>
    );
  }
};

const App: React.FC = () => {
  const [stage, setStage] = useState<'loading' | 'presentation' | 'app'>('loading');

  useEffect(() => {
    const t = setTimeout(() => setStage('presentation'), 5000);
    return () => clearTimeout(t);
  }, []);

  const handlePresentationComplete = () => setStage('app');

  return (
    <AppProvider>
      {stage === 'loading' && <LoadingView />}
      {stage === 'presentation' && <PresentationView onComplete={handlePresentationComplete} />}
      {stage === 'app' && <MainContent />}
      {stage === 'app' && <NotifDrawer />}
      {stage === 'app' && <MuniBot />}
      {stage === 'app' && <div className="hairline-top" />}
      {stage === 'app' && <div className="hairline-bottom" />}
    </AppProvider>
  );
};

export default App;
