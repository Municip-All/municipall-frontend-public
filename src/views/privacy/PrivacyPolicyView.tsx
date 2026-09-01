import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../layout/PageLayout';
import './PrivacyPolicyView.scss';

export const PrivacyPolicyView: React.FC = () => {
  const { showView } = useApp();

  return (
    <PageLayout active="privacy">
      <section className="privacy-container">
        <div className="privacy-header">
          <h1><em>Politique de Confidentialité</em></h1>
          <p className="privacy-subtitle">Réglement Général sur la Protection des Données (RGPD)</p>
          <p className="privacy-date">Dernière mise à jour : Septembre 2026</p>
        </div>

        <div className="privacy-content">
          {/* 1. Responsable du traitement */}
          <section className="privacy-section">
            <h2>1. Responsable du traitement des données</h2>
            <p>
              La mairie de votre commune (« <strong>Nous</strong> » ou « <strong>le Responsable</strong> ») est responsable du traitement de vos données personnelles via la plateforme Municip'All.
            </p>
            <p>
              Pour toute question concernant la protection de vos données, vous pouvez nous contacter :
            </p>
            <ul>
              <li><strong>Par courrier</strong> : À l'adresse de votre mairie</li>
              <li><strong>Par email</strong> : contact@municipalité.fr</li>
              <li><strong>Par téléphone</strong> : Depuis votre espace utilisateur</li>
            </ul>
          </section>

          {/* 2. Types de données collectées */}
          <section className="privacy-section">
            <h2>2. Données personnelles collectées</h2>
            <p>Nous collectons les données suivantes lors de votre inscription et utilisation :</p>

            <h3>Données d'inscription :</h3>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Date de naissance</li>
              <li>Adresse postale complète (rue, code postal, ville, quartier)</li>
              <li>Avatar/Photo de profil</li>
            </ul>

            <h3>Données d'utilisation :</h3>
            <ul>
              <li>Signalements et réclamations soumis</li>
              <li>Messages de contact envoyés à la mairie</li>
              <li>Notifications reçues et lues</li>
              <li>Événements et associations consultés</li>
              <li>Données de géolocalisation (optionnelles)</li>
              <li>Préférences de thème (clair/sombre)</li>
            </ul>

            <h3>Données techniques :</h3>
            <ul>
              <li>Adresse IP</li>
              <li>Type de navigateur et appareil</li>
              <li>Pages visitées et durée des sessions</li>
              <li>Cookies et données de suivi</li>
            </ul>
          </section>

          {/* 3. Base juridique */}
          <section className="privacy-section">
            <h2>3. Base juridique du traitement</h2>
            <p>Nous traitons vos données personnelles sur les bases juridiques suivantes :</p>
            <ul>
              <li><strong>Exécution d'un contrat</strong> : Pour créer et gérer votre compte utilisateur</li>
              <li><strong>Obligation légale</strong> : Pour respecter les lois et réglementations applicables</li>
              <li><strong>Intérêt légitime</strong> : Pour améliorer nos services et la sécurité de la plateforme</li>
              <li><strong>Consentement</strong> : Pour les données optionnelles et marketing</li>
            </ul>
          </section>

          {/* 4. Finalités du traitement */}
          <section className="privacy-section">
            <h2>4. Finalités du traitement</h2>
            <p>Nous utilisons vos données pour :</p>
            <ul>
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Traiter vos signalements et réclamations</li>
              <li>Vous envoyer des notifications municipales</li>
              <li>Répondre à vos demandes de contact</li>
              <li>Vous informer des événements locaux</li>
              <li>Améliorer et optimiser nos services</li>
              <li>Assurer la sécurité et la fraude de la plateforme</li>
              <li>Respecter nos obligations légales</li>
              <li>Générer des statistiques anonymisées</li>
            </ul>
          </section>

          {/* 5. Durée de conservation */}
          <section className="privacy-section">
            <h2>5. Durée de conservation des données</h2>
            <p>Nous conservons vos données personnelles :</p>
            <ul>
              <li><strong>Données de compte</strong> : Pendant la durée de votre compte, puis 3 ans après suppression pour conformité légale</li>
              <li><strong>Signalements</strong> : 5 ans pour suivi administratif et légal</li>
              <li><strong>Messages de contact</strong> : 2 ans pour traçabilité et contentieux</li>
              <li><strong>Logs de sécurité</strong> : 1 an pour détection des fraudes</li>
              <li><strong>Données de suivi</strong> : 13 mois (recommandation CNIL)</li>
            </ul>
          </section>

          {/* 6. Partage des données */}
          <section className="privacy-section">
            <h2>6. Partage et destinataires des données</h2>
            <p>Vos données peuvent être partagées avec :</p>
            <ul>
              <li><strong>Services municipaux</strong> : Pour traiter vos signalements et demandes</li>
              <li><strong>Prestataires techniques</strong> : Hébergeurs, supporteurs IT (sous contrats de traitement de données)</li>
              <li><strong>Autorités publiques</strong> : Si obligatoire par la loi</li>
              <li><strong>Partenaires municipaux</strong> : Associations, événements locaux (avec votre consentement)</li>
            </ul>
            <p>
              <strong>Vos données ne sont jamais vendues à des tiers commerciaux.</strong>
            </p>
          </section>

          {/* 7. Sécurité des données */}
          <section className="privacy-section">
            <h2>7. Sécurité des données</h2>
            <p>Nous mettons en place des mesures de sécurité appropriées :</p>
            <ul>
              <li>Chiffrement SSL/TLS de vos données en transit</li>
              <li>Hachage des mots de passe</li>
              <li>Contrôles d'accès et authentification</li>
              <li>Audits de sécurité réguliers</li>
              <li>Formation du personnel sur la protection des données</li>
              <li>Plans de réponse aux incidents de sécurité</li>
            </ul>
            <p>
              Bien que nous prenions tous les précautions possibles, aucune transmission de données sur Internet ne peut être garantie à 100% sécurisée.
            </p>
          </section>

          {/* 8. Vos droits */}
          <section className="privacy-section">
            <h2>8. Vos droits RGPD</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>

            <h3>Droit d'accès</h3>
            <p>Vous pouvez demander l'accès à vos données personnelles et recevoir une copie en format lisible.</p>

            <h3>Droit de rectification</h3>
            <p>Vous pouvez corriger vos données incomplètes ou inexactes dans votre espace profil.</p>

            <h3>Droit à l'oubli</h3>
            <p>Vous pouvez demander la suppression de vos données, sauf si nous avons des obligations légales de conservation.</p>

            <h3>Droit à la limitation du traitement</h3>
            <p>Vous pouvez demander à limiter le traitement de vos données.</p>

            <h3>Droit à la portabilité</h3>
            <p>Vous pouvez demander vos données dans un format structuré et transférable.</p>

            <h3>Droit d'opposition</h3>
            <p>Vous pouvez vous opposer à certains traitements, notamment les communications marketing.</p>

            <h3>Droit à ne pas être soumis à une décision automatisée</h3>
            <p>Vous pouvez demander une intervention humaine pour les décisions importantes.</p>

            <p className="privacy-contact-rights">
              <strong>Pour exercer vos droits</strong>, veuillez nous contacter via le formulaire de contact ou à contact@municipalité.fr. Nous traiterons votre demande dans un délai de <strong>30 jours</strong>.
            </p>
          </section>

          {/* 9. Cookies et suivi */}
          <section className="privacy-section">
            <h2>9. Cookies et technologies de suivi</h2>
            <p>Nous utilisons les cookies pour :</p>
            <ul>
              <li><strong>Cookies essentiels</strong> : Maintenir votre session et sécurité</li>
              <li><strong>Cookies de préférence</strong> : Mémoriser vos paramètres (thème, langue)</li>
              <li><strong>Cookies analytiques</strong> : Comprendre l'utilisation du site (Google Analytics)</li>
              <li><strong>Cookies marketing</strong> : Personnaliser votre expérience (optionnels)</li>
            </ul>
            <p>
              Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur. Le refus de certains cookies ne vous empêchera pas d'utiliser les services essentiels.
            </p>
          </section>

          {/* 10. Transferts de données internationales */}
          <section className="privacy-section">
            <h2>10. Transferts de données internationales</h2>
            <p>
              Vos données sont principalement stockées au sein de l'Union Européenne. Si un transfert vers un pays tiers était nécessaire, nous nous assurerions qu'il bénéficie de garanties appropriées (clauses contractuelles types, adéquation CNIL, etc.).
            </p>
          </section>

          {/* 11. Autorité de contrôle */}
          <section className="privacy-section">
            <h2>11. Autorité de contrôle et réclamations</h2>
            <p>
              Si vous considérez que nous ne respectons pas le RGPD, vous pouvez déposer une plainte auprès de l'autorité compétente :
            </p>
            <p>
              <strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong><br />
              3 Place de Fontenoy<br />
              75007 Paris, France<br />
              Téléphone : +33 1 53 73 22 22<br />
              Site : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            </p>
          </section>

          {/* 12. Modifications */}
          <section className="privacy-section">
            <h2>12. Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité à tout moment. Nous vous informerons des changements importants par email ou via un avis sur la plateforme. Votre utilisation continue de Municip'All après les modifications constitue votre acceptation des nouvelles conditions.
            </p>
          </section>

          {/* 13. Données spéciales */}
          <section className="privacy-section">
            <h2>13. Données sensibles et catégories spéciales</h2>
            <p>
              Nous ne collectons pas intentionnellement de données sensibles (données médicales, origine ethnique, opinions politiques, etc.), sauf si vous les fournissez volontairement dans un signalement ou message. Ces données sont traitées avec un niveau de confidentialité renforcé.
            </p>
          </section>

          {/* 14. Contact DPO */}
          <section className="privacy-section">
            <h2>14. Délégué à la Protection des Données (DPO)</h2>
            <p>
              Si votre commune a désigné un Délégué à la Protection des Données, vous pouvez le contacter pour toute question relative à la protection de vos données :
            </p>
            <p>
              <strong>Email DPO</strong> : dpo@municipalité.fr<br />
              <strong>Courrier</strong> : Service DPO - Mairie
            </p>
          </section>

          {/* Footer avec boutons */}
          <div className="privacy-footer">
            <p className="privacy-footer-text">
              En utilisant Municip'All, vous acceptez les termes de cette politique de confidentialité.
            </p>
            <button
              className="privacy-back-btn"
              onClick={() => showView('home')}
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
