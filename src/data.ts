import { Association, Evenement, NotifItem, Signalement } from './types';

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

export const ASSOS: Association[] = [
  { id:1, nom:'AS Football Local', cat:'sport', icon:'⚽', color:'#52D68A', desc:'Club de football amateur. Sections jeunes, seniors et vétérans. Entraînements 3x/semaine.', lieu:'Stade Municipal', tel:'01 47 26 31 00', email:'contact@asfootball.fr', site:'asfootball.fr', membres:320, horaires:'Lun, Mer, Ven 18h–20h', actif:true },
  { id:2, nom:'Harmonie Municipale', cat:'culture', icon:'🎺', color:'#9370DB', desc:'Orchestre d\'harmonie fondé en 1948. Répétitions hebdomadaires, concerts tout au long de l\'année.', lieu:'Conservatoire Municipal', tel:'01 49 58 62 00', email:'harmonie@mairie.fr', membres:85, horaires:'Mardi 20h30', actif:true },
  { id:3, nom:'Secours Populaire', cat:'social', icon:'🤝', color:'#FFB347', desc:'Distribution alimentaire, aide aux familles en difficulté, collectes, permanences sociales.', lieu:'15 Rue Pasteur', tel:'01 47 26 20 20', email:'local@secourspopulaire.fr', site:'secourspopulaire.fr', membres:140, horaires:'Lun–Sam 9h–12h', actif:true },
  { id:4, nom:'Ville En Vert', cat:'environnement', icon:'🌿', color:'#52D68A', desc:'Jardins partagés, ateliers de compostage, sensibilisation à la biodiversité urbaine. Zéro déchet.', lieu:'Jardin des Cèdres', tel:'06 78 90 12 34', email:'villeenvert@gmail.com', membres:62, horaires:'Week-ends 10h–13h', actif:true },
  { id:5, nom:'Danse Classique & Contemporaine', cat:'culture', icon:'🩰', color:'#9370DB', desc:'École de danse pour tous les âges. Cours de classique, contemporain, hip-hop et jazz.', lieu:'Maison des Associations', tel:'01 47 26 45 67', email:'danse@gmail.com', membres:180, horaires:'Mar–Sam 14h–20h', actif:true },
  { id:6, nom:'Club des Aînés Actifs', cat:'social', icon:'👴', color:'#FFB347', desc:'Sorties culturelles, ateliers numériques, après-midis dansants et activités de bien-être pour les seniors.', lieu:'Centre Social', tel:'01 47 26 55 00', email:'aines@mairie.fr', membres:230, horaires:'Lun–Ven 14h–18h', actif:true },
  { id:7, nom:'Taekwondo Club', cat:'sport', icon:'🥋', color:'#52D68A', desc:'Club de taekwondo agréé. Compétition nationale. Cours enfants dès 5 ans, adultes toutes saisons.', lieu:'Gymnase Municipal', tel:'06 23 45 67 89', email:'tkd@gmail.com', membres:95, horaires:'Mer 17h, Sam 10h', actif:true },
  { id:8, nom:'Les Petits Débrouillards', cat:'jeunesse', icon:'🔬', color:'#4ECDC4', desc:'Ateliers scientifiques et technologiques pour les 8–15 ans. Robotique, chimie, astronomie.', lieu:'Médiathèque', tel:'01 49 58 70 00', email:'pdb@debrouillards.fr', membres:75, horaires:'Mer & Sam 14h–17h', actif:true },
  { id:9, nom:'Croix-Rouge Locale', cat:'sante', icon:'🏥', color:'#FF6B6B', desc:'Premiers secours, maraudes sociales, collectes de sang, formation aux gestes qui sauvent.', lieu:'27 Avenue Condorcet', tel:'01 47 26 10 00', email:'local@croix-rouge.fr', site:'croix-rouge.fr', membres:110, horaires:'Lun–Ven 9h–17h', actif:true },
  { id:10, nom:'Photo Club', cat:'culture', icon:'📷', color:'#9370DB', desc:'Partage de techniques photo, sorties en ville, expositions annuelles. Tous niveaux bienvenus.', lieu:'Maison des Associations', email:'photoclub@gmail.com', membres:45, horaires:'Jeu 19h–21h', actif:true },
  { id:11, nom:'Basket Club', cat:'sport', icon:'🏀', color:'#52D68A', desc:'Club phare de la ville. Équipes masculines et féminines, plateau jeunes. Championnat régional.', lieu:'Palais des Sports', tel:'01 47 26 88 00', email:'basket@mairie.fr', membres:280, horaires:'Tous les jours', actif:true },
  { id:12, nom:'Jardiniers du Parc', cat:'environnement', icon:'🌻', color:'#52D68A', desc:'Entretien des jardins partagés. Potagers collectifs, plantation d\'arbres fruitiers.', lieu:'Parc Central', tel:'06 34 56 78 90', email:'jardiniers@gmail.com', membres:38, horaires:'Week-ends 9h–12h', actif:true },
];

export const EVENEMENTS: Evenement[] = [
  { id:1, titre:'Concert Jazz · Parc Central', tag:'culture', jour:30, mois:'avr', heure:'20h00', lieu:'Parc central', desc:'Entrée libre · Prévoir une chaise', accent:true },
  { id:2, titre:'Marché de Printemps', tag:'marche', jour:2, mois:'mai', heure:'8h – 13h', lieu:'Place du Marché', desc:'Producteurs locaux, artisanat' },
  { id:3, titre:'Tournoi de pétanque inter-quartiers', tag:'sport', jour:3, mois:'mai', heure:'14h00', lieu:'Boulodrome municipal', desc:'Inscription gratuite · Ouvert à tous' },
  { id:4, titre:'Réunion publique — Budget participatif', tag:'info', jour:10, mois:'mai', heure:'18h30', lieu:'Salle des fêtes', desc:'100 000€ à allouer aux projets citoyens' },
  { id:5, titre:'Atelier vélo · Entretien & sécurité', tag:'social', jour:17, mois:'mai', heure:'10h00', lieu:'Maison des Associations', desc:'Gratuit · Amenez votre vélo' },
];

export const NOTIFICATIONS: NotifItem[] = [
  { id:1, read:false, icon:'✅', text:'Votre signalement <strong>#MA-2026-04847</strong> a été pris en charge par le Service Voirie.', time:'Il y a 23 min' },
  { id:2, read:false, icon:'🚌', text:'Perturbation Ligne 131 — Bus dévié jusqu\'à 18h30.', time:'Il y a 1h' },
  { id:3, read:true, icon:'📅', text:'Concert Jazz · Parc Central · Demain 20h', time:'Hier' },
];

export const DEMO_SIGNALEMENTS: Signalement[] = [
  { id:'#MA-2026-04847', categorie:'Voirie', description:'Nid-de-poule dangereux', adresse:'Rue Victor Hugo', statut:'en-cours', dateCreation:'Il y a 2 jours', urgent:false, progression:35, serviceAssigne:'Service Voirie', delaiEstime:'3j restants' },
  { id:'#MA-2026-04812', categorie:'Éclairage', description:'Éclairage public défaillant', adresse:'Avenue de la République', statut:'attente', dateCreation:'Il y a 5 jours', urgent:false },
  { id:'#MA-2026-04756', categorie:'Propreté', description:'Poubelle débordante', adresse:'Parc de la Méridienne', statut:'resolu', dateCreation:'Il y a 12 jours', urgent:false, agentNote:'"Intervention effectuée le 17/04. Zone nettoyée et bac remplacé." — Agent Dubois' },
  { id:'#MA-2026-04701', categorie:'Espaces verts', description:'Branche d\'arbre dangereuse', adresse:'Rue Paul Vaillant-Couturier', statut:'resolu', dateCreation:'Il y a 18 jours', urgent:false },
];

export const CAT_ICONS: Record<string, string> = {
  'Voirie':'🛣️', 'Éclairage':'💡', 'Propreté':'🗑️', 'Espaces verts':'🌳',
  'Stationnement':'🚗', 'Bâtiment':'🏚️', 'Nuisance':'🔊', 'Autre':'➕',
};

export const BOT_RESPONSES: Record<string, string> = {
  'signaler': 'Pour signaler un problème, appuyez sur le bouton <strong>+</strong> ou "Nouveau signalement" dans la sidebar 🛣️',
  'horaires': '🏛️ Mairie :\n<strong>Lun–Ven 8h30–17h00</strong>\nMercredi jusqu\'à 19h30\nTél : 01 49 58 60 00',
  'vélo': '🚲 Aide à l\'achat de vélo électrique jusqu\'à <strong>300€</strong>. Demande à la Maison des Services.',
  'demande': '📋 Vous avez des demandes en cours. Rendez-vous dans l\'onglet Demandes pour les détails.',
  'bonjour': 'Bonjour ! 😊 Je peux vous aider à signaler un problème, trouver les horaires, les associations ou suivre vos demandes.',
  'association': 'Découvrez toutes les associations locales dans l\'onglet 🤝 Associations !',
  'default': 'Je comprends votre demande. N\'hésitez pas à utiliser le formulaire de signalement ou consulter l\'agenda 🗺️',
};