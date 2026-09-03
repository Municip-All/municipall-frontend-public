import React from 'react';
import { PageLayout } from '../layout/PageLayout';
import './Accessibility.scss';

export const Accessibility: React.FC = () => {
  return (
    <PageLayout active="accessibility">
      <div className="accessibility-view">
        <div className="accessibility-container">
          <h1>Accessibilité</h1>

          <section className="accessibility-section">
            <h2>Notre engagement pour l'accessibilité</h2>
            <p>
              Municip'All s'engage à rendre sa plateforme accessible à tous les utilisateurs, quels que soient leurs capacités ou handicaps. Nous suivons les normes WCAG 2.1 niveau AA pour garantir une accessibilité maximale.
            </p>
          </section>

          <section className="accessibility-section">
            <h2>Fonctionnalités d'accessibilité</h2>
            <ul>
              <li><strong>Navigation au clavier</strong> : Tous les éléments interactifs sont accessibles via le clavier</li>
              <li><strong>Lecteur d'écran</strong> : La plateforme est compatible avec les lecteurs d'écran courants (NVDA, JAWS, VoiceOver)</li>
              <li><strong>Contraste visuel</strong> : Nous utilisons des contrastes suffisants pour une meilleure lisibilité</li>
              <li><strong>Zoom et redimensionnement</strong> : Vous pouvez zoomer jusqu'à 200% sans perdre la fonctionnalité</li>
              <li><strong>Polices lisibles</strong> : Nous utilisons des polices sans-serif pour une meilleure lisibilité</li>
              <li><strong>Textes alternatifs</strong> : Toutes les images ont des descriptions textuelles</li>
              <li><strong>Mode sombre</strong> : Un mode sombre est disponible pour réduire la fatigue oculaire</li>
            </ul>
          </section>

          <section className="accessibility-section">
            <h2>Raccourcis clavier</h2>
            <dl className="keyboard-shortcuts">
              <dt>Tab</dt>
              <dd>Naviguer entre les éléments interactifs</dd>

              <dt>Entrée</dt>
              <dd>Activer les boutons et les liens</dd>

              <dt>Échap</dt>
              <dd>Fermer les panneaux et les modales</dd>

              <dt>Espace</dt>
              <dd>Basculer les cases à cocher</dd>
            </dl>
          </section>

          <section className="accessibility-section">
            <h2>Signaler un problème d'accessibilité</h2>
            <p>
              Si vous rencontrez des difficultés d'accessibilité sur notre plateforme, nous vous encourageons à nous le signaler. Vous pouvez nous contacter via la <a href="#contact">page de contact</a> avec une description du problème.
            </p>
          </section>

          <section className="accessibility-section">
            <h2>Ressources externes</h2>
            <ul>
              <li><a href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer">Web Accessibility Initiative (WAI)</a></li>
              <li><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer">Directives WCAG 2.1</a></li>
              <li><a href="https://www.accessibilite.numerique.gouv.fr/" target="_blank" rel="noopener noreferrer">Accessibilité numérique du gouvernement</a></li>
            </ul>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};
