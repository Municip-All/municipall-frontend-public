import React from 'react';
import { PageLayout } from '../layout/PageLayout';
import './Conditions.scss';

export const Conditions: React.FC = () => {
  return (
    <PageLayout active="conditions">
      <div className="conditions-view">
        <div className="conditions-container">
          <h1>Conditions d'utilisation</h1>

          <section className="conditions-section">
            <h2>1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant cette plateforme municipale Municip'All, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le site.
            </p>
          </section>

          <section className="conditions-section">
            <h2>2. Utilisation autorisée</h2>
            <p>
              Vous acceptez d'utiliser cette plateforme exclusivement à des fins légitimes et conformément à toutes les lois et réglementations applicables. Vous ne devez pas :
            </p>
            <ul>
              <li>Utiliser la plateforme de manière abusive ou frauduleuse</li>
              <li>Contourner les mesures de sécurité</li>
              <li>Transmettre des virus ou des codes malveillants</li>
              <li>Harceler ou menacer d'autres utilisateurs</li>
              <li>Utiliser des robots ou des scripts d'automatisation</li>
            </ul>
          </section>

          <section className="conditions-section">
            <h2>3. Propriété intellectuelle</h2>
            <p>
              Tout le contenu de cette plateforme, y compris les textes, les images, les logos et les éléments interactifs, est la propriété de la municipalité ou de ses partenaires et est protégé par les lois sur la propriété intellectuelle.
            </p>
          </section>

          <section className="conditions-section">
            <h2>4. Limitation de responsabilité</h2>
            <p>
              La plateforme est fournie "telle quelle" sans aucune garantie. La municipalité ne sera pas responsable des dommages indirects, accessoires ou consécutifs résultant de l'utilisation de ce site.
            </p>
          </section>

          <section className="conditions-section">
            <h2>5. Modifications des conditions</h2>
            <p>
              La municipalité se réserve le droit de modifier ces conditions à tout moment. Les modifications seront affichées sur cette page. Votre utilisation continue du site implique votre acceptation des conditions modifiées.
            </p>
          </section>

          <section className="conditions-section">
            <h2>6. Droit applicable</h2>
            <p>
              Ces conditions sont régies par la loi française. Tout litige sera soumis à la juridiction compétente du tribunal de la commune.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};
