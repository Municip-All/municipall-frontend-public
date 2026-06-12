export type Commune = 'Bouffémont' | 'Kremlin-Bicêtre' | 'Creil' | 'Saint-Maur-les-Fossés';

export type Quartier =
  | 'Centre-Ville'
  | 'Nord'
  | 'Sud'
  | 'Est'
  | 'Ouest'
  | 'Paul Hochart'
  | 'Rouget de Lisle'
  | 'Quartiers Sud'
  | 'Stade';

export interface User {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  rue: string;
  codePostal: string;
  ville: Commune;
  quartier: Quartier;
  complementAdresse?: string;
  avatar: string; // initials or emoji
}

export type ViewName = 'home' | 'sig' | 'evenement' | 'contact' | 'profil' | 'collecte' | 'travaux' | 'transports' | 'social';
export type AuthView = 'login' | 'register';

export type SignalementStatus = 'attente' | 'en-cours' | 'resolu';
export type SignalementCategory =
  | 'Voirie'
  | 'Éclairage'
  | 'Propreté'
  | 'Espaces verts'
  | 'Stationnement'
  | 'Bâtiment'
  | 'Nuisance'
  | 'Autre';

export interface Signalement {
  id: string;
  categorie: SignalementCategory;
  description: string;
  adresse: string;
  statut: SignalementStatus;
  dateCreation: string;
  urgent: boolean;
  progression?: number;
  agentNote?: string;
  delaiEstime?: string;
  serviceAssigne?: string;
}

export type AssoCategory = 'sport' | 'culture' | 'social' | 'environnement' | 'jeunesse' | 'sante';

export interface Association {
  id: number;
  nom: string;
  cat: AssoCategory;
  icon: string;
  color: string;
  desc: string;
  lieu: string;
  tel?: string;
  email?: string;
  site?: string;
  membres: number;
  horaires: string;
  actif: boolean;
}

export type AgendaTag = 'culture' | 'sport' | 'social' | 'marche' | 'info';

export interface Evenement {
  id: number;
  titre: string;
  tag: AgendaTag;
  jour: number;
  mois: string;
  heure: string;
  lieu: string;
  desc: string;
  accent?: boolean;
}

export interface NotifItem {
  id: number;
  read: boolean;
  icon: string;
  text: string;
  time: string;
}