import { NotifItem } from './types';

export const COMMUNES = ['Bouffémont', 'Kremlin-Bicêtre', 'Creil', 'Saint-Maur-les-Fossés'] as const;

export const QUARTIERS_BY_COMMUNE: Record<string, string[]> = {
  'Bouffémont': ['Centre-Ville', 'Nord', 'Sud', 'Est', 'Ouest'],
  'Kremlin-Bicêtre': ['Centre-Ville', 'Paul Hochart', 'Rouget de Lisle', 'Quartiers Sud', 'Stade'],
  'Creil': ['Centre-Ville', 'Rurai', 'Plateau', 'Saint-Médard', 'Moulin'],
  'Saint-Maur-les-Fossés': ['Centre', 'La Varenne', 'Adamville', 'Champigny', 'Le Parc'],
};

export const CP_BY_COMMUNE: Record<string, string> = {
  'Bouffémont': '95570',
  'Kremlin-Bicêtre': '94270',
  'Creil': '60100',
  'Saint-Maur-les-Fossés': '94100',
};

export const NOTIFICATIONS: NotifItem[] = [
  { id:1, read:false, icon:'✅', text:'Votre signalement <strong>#MA-2026-04847</strong> a été pris en charge par le Service Voirie.', time:'Il y a 23 min' },
  { id:2, read:false, icon:'🚌', text:'Perturbation Ligne 131 — Bus dévié jusqu\'à 18h30.', time:'Il y a 1h' },
  { id:3, read:true, icon:'📅', text:'Concert Jazz · Parc Central · Demain 20h', time:'Hier' },
];

export const BOT_RESPONSES: Record<string, string> = {
  'signaler': 'Pour signaler un problème, appuyez sur le bouton <strong>+</strong> ou "Nouveau signalement" dans la sidebar 🛣️',
  'horaires': '🏛️ Mairie :\n<strong>Lun–Ven 8h30–17h00</strong>\nMercredi jusqu\'à 19h30\nTél : 01 49 58 60 00',
  'vélo': '🚲 Aide à l\'achat de vélo électrique jusqu\'à <strong>300€</strong>. Demande à la Maison des Services.',
  'demande': '📋 Vous avez des demandes en cours. Rendez-vous dans l\'onglet Demandes pour les détails.',
  'bonjour': 'Bonjour ! 😊 Je peux vous aider à signaler un problème, trouver les horaires, les associations ou suivre vos demandes.',
  'association': 'Découvrez toutes les associations locales dans l\'onglet 🤝 Associations !',
  'default': 'Je comprends votre demande. N\'hésitez pas à utiliser le formulaire de signalement ou consulter l\'agenda 🗺️',
};