export type ViewName = string;
export type AuthView = 'login' | 'register';
export type SignalementCategory = 'voirie' | 'eclairage' | 'proprete' | 'espaces-verts' | 'autre' | string;

export interface Signalement {
  id: string;
  titre?: string;
  description: string;
  category?: SignalementCategory;
  categorie?: SignalementCategory;
  statut: 'en-cours' | 'attente' | 'resolu' | 'rejete' | string;
  date?: string;
  dateCreation?: string;
  adresse?: string;
  urgent?: boolean;
  progression?: number;
  serviceAssigne?: string;
  delaiEstime?: string;
  agentNote?: string;
}
export type Commune = string;
export interface User {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  commune?: Commune;
  quartier?: string;
  dateNaissance?: string;
  rue?: string;
  codePostal?: string;
  ville?: string;
  complementAdresse?: string;
  avatar?: string;
}
export interface Association { 
  id: number | string; 
  nom?: string;
  cat?: string;
  icon?: string;
  color?: string;
  desc?: string;
  lieu?: string;
  tel?: string;
  email?: string;
  site?: string;
  membres?: number;
  horaires?: string;
  actif?: boolean;
}
export interface Evenement { 
  id: number | string;
  titre?: string;
  tag?: string;
  jour?: number;
  mois?: string;
  heure?: string;
  lieu?: string;
  desc?: string;
  accent?: boolean;
}
export interface NotifItem { 
  id: number | string; 
  text: string;
  read?: boolean;
  icon?: string;
  time?: string;
}
