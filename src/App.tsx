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
import { PrivacyPolicyView } from './views/privacy/PrivacyPolicyView';
import { Conditions } from './views/conditions/Conditions';
import { Accessibility } from './views/accessibility/Accessibility';
import { Sitemap } from './views/sitemap/Sitemap';
import { NotifDrawer, MuniBot } from './views/layout/PageLayout';
import { ViewTransition } from './components';
import { ViewName } from './types';
import { setGoToPresentationCallback } from './context/navigationCallbacks';

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
  privacy: 'Politique de Confidentialité',
  conditions: 'Conditions d\'utilisation',
  accessibility: 'Accessibilité',
  sitemap: 'Plan du site',
};

const MainContent: React.FC<{ pendingView?: string | null }> = ({ pendingView }) => {
  const { isAuthenticated, isAuthLoading, currentView, showView } = useApp();

  useEffect(() => {
    if (isAuthenticated && pendingView) {
      showView(pendingView as ViewName);
    }
  }, [isAuthenticated, pendingView, showView]);

  let key: string = currentView;
  let node: React.ReactNode;

  if (isAuthLoading) {
    key = 'loading';
    node = <LoadingView />;
  } else if (!isAuthenticated) {
    key = 'auth';
    node = <AuthScreen />;
  } else {
    switch (currentView) {
      case 'home': node = <HomeView />; break;
      case 'sig': node = <ReportsView />; break;
      case 'evenement': node = <EventsView />; break;
      case 'contact': node = <ContactView />; break;
      case 'profil': node = <ProfileView />; break;
      case 'collecte': node = <CollecteView />; break;
      case 'travaux': node = <TravauxView />; break;
      case 'transports': node = <TransportsView />; break;
      case 'social': node = <SocialView />; break;
      case 'privacy': node = <PrivacyPolicyView />; break;
      case 'conditions': node = <Conditions />; break;
      case 'accessibility': node = <Accessibility />; break;
      case 'sitemap': node = <Sitemap />; break;
      default:
        node = (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.8rem', letterSpacing: '-1.5px', color: 'var(--color-ink)' }}><em>{VIEW_LABELS[currentView as ViewName]}</em></h1>
            <p style={{ fontSize: '.9rem', color: 'var(--color-neutral-500)' }}>Cette page sera bientôt disponible.</p>
            <button style={{ marginTop: '.5rem', padding: '.8rem 1.8rem', background: 'var(--color-ink)', border: 'none', borderRadius: '2rem', fontFamily: 'var(--font-body)', fontSize: '.88rem', fontWeight: 500, color: 'var(--color-neutral-50)', cursor: 'pointer' }} onClick={() => showView('home')}>← Retour à l'accueil</button>
          </div>
        );
    }
  }

  return <ViewTransition viewKey={key} variant="swift">{node}</ViewTransition>;
};

const ChatbotWidget: React.FC = () => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return null;
  return <MuniBot />;
};

const App: React.FC = () => {
  const [stage, setStage] = useState<'loading' | 'presentation' | 'app'>('loading');
  const [pendingView, setPendingView] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setStage('presentation'), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setGoToPresentationCallback(() => {
      setStage('presentation');
    });
  }, []);

  const handlePresentationComplete = () => {
    setStage('app');
  };

  const handleNavigateTo = (view: string) => {
    setPendingView(view);
  };

  return (
    <AppProvider>
      <ViewTransition viewKey={stage} variant="cinematic">
        {stage === 'loading' && <LoadingView />}
        {stage === 'presentation' && <PresentationView onComplete={handlePresentationComplete} onNavigateTo={handleNavigateTo} />}
        {stage === 'app' && <MainContent pendingView={pendingView} />}
      </ViewTransition>
      {stage === 'app' && <NotifDrawer />}
      {stage === 'app' && <ChatbotWidget />}
      {stage === 'app' && <div className="hairline-top" />}
      {stage === 'app' && <div className="hairline-bottom" />}
    </AppProvider>
  );
};

export default App;
