import React, { useState, useEffect } from 'react';
import './test/App.css';
import { AppProvider, useApp } from './test/Appcontext';
import { AuthScreen } from './test/authscreen';
import { HomeView } from './test/homeview';
import { LoadingView } from './test/LoadingView';
import { PresentationView } from './test/PresentationView';
import { SignalementView } from './test/signalementview';
import { EvenementView, ContactView, ProfilView, CollecteView, TravauxView, TransportsView, SocialView } from './test/otherviews';
import { NotifDrawer, MuniBot } from './test/layout';
import { ViewName } from './types';

const VIEW_LABELS: Record<ViewName, string> = {
  home:       'Accueil',
  sig:        'Signalements',
  evenement:  'Évènements',
  contact:    'Contact',
  profil:     'Mon Profil',
  collecte:   'Déchets & Toilettes',
  travaux:    'Travaux',
  transports: 'Transports',
  social:     'Social',
};

const placeholderCss = `
  .placeholder-view {
    position: fixed; inset: 0;
    background: #FAFAF8;
    font-family: 'Inter', sans-serif;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 1.5rem;
  }
  .placeholder-eyebrow {
    font-size: .7rem; font-weight: 600; letter-spacing: .14em;
    text-transform: uppercase; color: rgba(15,15,14,.3);
  }
  .placeholder-title {
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: 2.8rem; letter-spacing: -1.5px; color: #0F0F0E;
    text-align: center;
  }
  .placeholder-title em { font-style: italic; color: #3B558F; }
  .placeholder-sub {
    font-size: .9rem; color: rgba(15,15,14,.4); text-align: center;
  }
  .placeholder-back {
    margin-top: .5rem;
    padding: .8rem 1.8rem; background: #0F0F0E;
    border: none; border-radius: 2rem;
    font-family: 'Inter', sans-serif; font-size: .88rem; font-weight: 500;
    color: #FAFAF8; cursor: pointer; letter-spacing: .02em;
    transition: background .2s, transform .2s;
  }
  .placeholder-back:hover { background: #1A3A8F; transform: translateY(-2px); }
`;

const PlaceholderView: React.FC<{ view: ViewName }> = ({ view }) => {
  const { showView } = useApp();
  useEffect(() => {
    const id = 'placeholder-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = placeholderCss;
      document.head.appendChild(s);
    }
  }, []);
  return (
    <div className="placeholder-view">
      <p className="placeholder-eyebrow">Page en construction</p>
      <h1 className="placeholder-title"><em>{VIEW_LABELS[view]}</em></h1>
      <p className="placeholder-sub">Cette page sera bientôt disponible.</p>
      <button className="placeholder-back" onClick={() => showView('home')}>
        ← Retour à l'accueil
      </button>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { isAuthenticated, currentView } = useApp();
  if (!isAuthenticated) return <AuthScreen />;

  switch (currentView) {
    case 'home':       return <HomeView />;
    case 'sig':        return <SignalementView />;
    case 'evenement':  return <EvenementView />;
    case 'contact':    return <ContactView />;
    case 'profil':     return <ProfilView />;
    case 'collecte':   return <CollecteView />;
    case 'travaux':    return <TravauxView />;
    case 'transports': return <TransportsView />;
    case 'social':     return <SocialView />;
    default:           return <PlaceholderView view={currentView as ViewName} />;
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
      {stage === 'loading'      && <LoadingView />}
      {stage === 'presentation' && <PresentationView onComplete={handlePresentationComplete} />}
      {stage === 'app'          && <MainContent />}
      {stage === 'app'          && <NotifDrawer />}
      {stage === 'app'          && <MuniBot />}
    </AppProvider>
  );
};

export default App;
