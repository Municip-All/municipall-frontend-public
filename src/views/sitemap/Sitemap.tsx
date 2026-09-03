import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../layout/PageLayout';
import './Sitemap.scss';

export const Sitemap: React.FC = () => {
  const { showView } = useApp();

  return (
    <PageLayout active="sitemap">
      <div className="sitemap-view">
        <div className="sitemap-container">
          <h1>Plan du site</h1>
          <p className="sitemap-intro">Découvrez la structure complète de Municip'All et accédez à toutes les sections disponibles</p>

          <section className="sitemap-section">
            <h2>Services citoyens</h2>
            <ul className="sitemap-list">
              <li><button onClick={() => showView('sig')} className="sitemap-link">Signalements</button> - Signalez les problèmes dans votre quartier</li>
              <li><button onClick={() => showView('collecte')} className="sitemap-link">Collecte des déchets</button> - Informations et calendriers de collecte</li>
              <li><button onClick={() => showView('travaux')} className="sitemap-link">Travaux</button> - Chantiers et fermetures de routes</li>
              <li><button onClick={() => showView('transports')} className="sitemap-link">Transports</button> - Horaires et plans des transports en commun</li>
            </ul>
          </section>

          <section className="sitemap-section">
            <h2>Vie locale</h2>
            <ul className="sitemap-list">
              <li><button onClick={() => showView('evenement')} className="sitemap-link">Événements</button> - Agenda des manifestations municipales</li>
              <li><button onClick={() => showView('social')} className="sitemap-link">Associations</button> - Clubs et organisations locales</li>
            </ul>
          </section>

          <section className="sitemap-section">
            <h2>Communication</h2>
            <ul className="sitemap-list">
              <li><button onClick={() => showView('contact')} className="sitemap-link">Nous contacter</button> - Formulaire de contact direct</li>
            </ul>
          </section>

          <section className="sitemap-section">
            <h2>Compte utilisateur</h2>
            <ul className="sitemap-list">
              <li><button onClick={() => showView('profil')} className="sitemap-link">Mon profil</button> - Gérer vos informations personnelles</li>
            </ul>
          </section>

          <section className="sitemap-section">
            <h2>Informations légales</h2>
            <ul className="sitemap-list">
              <li><button onClick={() => showView('privacy')} className="sitemap-link">Politique de confidentialité</button> - Protection de vos données</li>
              <li><button onClick={() => showView('conditions')} className="sitemap-link">Conditions d'utilisation</button> - Règles d'utilisation du site</li>
              <li><button onClick={() => showView('accessibility')} className="sitemap-link">Accessibilité</button> - Informations d'accessibilité</li>
            </ul>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};
