import type {
  Association,
  AssoCategory,
  AgendaTag,
  Commune,
  Evenement,
  Quartier,
  Signalement,
  SignalementCategory,
  SignalementStatus,
  User,
} from '../types';
import type { ApiUser } from '../services/authService';
import type { ApiReport } from '../services/reportService';
import type { ApiEvent } from '../services/eventService';
import type { ApiConstructionWork } from '../services/constructionWorksService';
import type { TransportLineDisruption } from '../services/transportService';
import type { CityConfig } from '../services/cityService';
import type { PublicToilet } from '../services/openDataService';
import type { WeatherData } from '../services/weatherService';

const MONTHS_SHORT = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC'];
const DAY_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const WASTE_ICONS: Record<string, string> = {
  trash: '🗑️',
  recycle: '♻️',
  wine: '🧴',
};

const MODE_COLORS: Record<string, { bg: string; color: string }> = {
  metro: { bg: '#F08080', color: '#fff' },
  rer: { bg: '#005FA9', color: '#fff' },
  train: { bg: '#005FA9', color: '#fff' },
  tram: { bg: '#7B58B0', color: '#fff' },
  bus: { bg: '#E83E3E', color: '#fff' },
};

const ASSO_ICONS: Record<string, string> = {
  association: '🤝',
  'groupe-parole': '💬',
  autre: '🏛',
};

export function mapApiUserToUser(api: ApiUser, cityName?: string): User {
  const prenom = api.name || '';
  const nom = api.surname || '';
  return {
    prenom,
    nom,
    email: api.email,
    telephone: api.phone || '',
    dateNaissance: '',
    rue: '',
    codePostal: '',
    ville: (cityName || 'Kremlin-Bicêtre') as Commune,
    quartier: (api.neighborhood || 'Centre-Ville') as Quartier,
    avatar: `${prenom[0] || ''}${nom[0] || ''}`.toUpperCase() || 'C',
  };
}

export function mapReportStatus(status: string): SignalementStatus {
  const s = status.toLowerCase();
  if (s.includes('cours')) return 'en-cours';
  if (s.includes('résol') || s.includes('resol') || s.includes('clôtur') || s.includes('clotur')) return 'resolu';
  return 'attente';
}

export function mapReportToSignalement(r: ApiReport): Signalement {
  const statut = mapReportStatus(r.status);
  const progression =
    statut === 'resolu' ? 100 : statut === 'en-cours' ? 55 : statut === 'attente' ? 15 : 0;
  return {
    id: String(r.id ?? ''),
    categorie: (r.category || 'Autre') as SignalementCategory,
    description: r.description || r.category || 'Signalement',
    adresse: `${r.lat.toFixed(4)}, ${r.lon.toFixed(4)}`,
    statut,
    dateCreation: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString('fr-FR')
      : new Date().toLocaleDateString('fr-FR'),
    urgent: false,
    progression,
  };
}

export function mapEventToEvenement(e: ApiEvent): Evenement {
  const start = new Date(e.startDate);
  return {
    id: e.id,
    titre: e.title,
    tag: (e.category?.toLowerCase() || 'info') as AgendaTag,
    jour: start.getDate(),
    mois: MONTHS_SHORT[start.getMonth()] ?? '—',
    heure: start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    lieu: e.location,
    desc: e.description,
    accent: start.getTime() > Date.now(),
  };
}

export function mapAssociation(a: {
  id: string;
  name: string;
  category: string;
  description?: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
}): Association {
  const cat = a.category;
  const assoId = parseInt(a.id.replace(/\D/g, '').slice(0, 9), 10) || 0;
  return {
    id: assoId,
    nom: a.name,
    cat: (cat in ASSO_ICONS ? cat : 'social') as AssoCategory,
    icon: ASSO_ICONS[cat] ?? '🏛',
    color: '#3B558F',
    desc: a.description || '',
    lieu: a.address || '',
    tel: a.contactPhone,
    email: a.contactEmail,
    site: a.website,
    membres: 0,
    horaires: '',
    actif: true,
  };
}

function workProgress(start: Date, end: Date): number {
  const now = Date.now();
  if (now <= start.getTime()) return 0;
  if (now >= end.getTime()) return 100;
  return Math.round(((now - start.getTime()) / (end.getTime() - start.getTime())) * 100);
}

export type TravauxItem = {
  titre: string;
  addr: string;
  type: string;
  typeBg: string;
  typeColor: string;
  statut: 'en-cours' | 'planifie';
  prog: number;
  debut: string;
  fin: string;
  impact: string;
};

export function mapConstructionWork(w: ApiConstructionWork): TravauxItem {
  const start = new Date(w.startDate);
  const end = new Date(w.endDate);
  const enCours = w.status === 'En cours';
  return {
    titre: w.title,
    addr: w.locationName,
    type: w.impactType || 'Travaux',
    typeBg: 'rgba(59,85,143,.1)',
    typeColor: '#3B558F',
    statut: enCours ? 'en-cours' : 'planifie',
    prog: enCours ? workProgress(start, end) : 0,
    debut: start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    fin: end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    impact: w.impactType || w.description || '—',
  };
}

export type TransportLigne = {
  num: string;
  nom: string;
  type: string;
  bg: string;
  color: string;
  statut: 'perturbe' | 'normal' | 'planifie';
  freq?: string;
  alerte?: string;
};

export function mapTransportLine(line: TransportLineDisruption): TransportLigne {
  const disrupted = line.status === 'disrupted';
  const colors = MODE_COLORS[line.mode] ?? { bg: '#3B558F', color: '#fff' };
  return {
    num: line.lineName.split(' ')[0] || line.lineId,
    nom: line.lineName,
    type: line.mode.charAt(0).toUpperCase() + line.mode.slice(1),
    bg: colors.bg,
    color: colors.color,
    statut: disrupted ? 'perturbe' : 'normal',
    alerte: disrupted && line.messages.length ? line.messages.join(' ') : undefined,
  };
}

export type CollecteRow = {
  jour: string;
  type: string;
  heure: string;
  icon: string;
  bg: string;
  color: string;
};

export function mapWasteServices(config: CityConfig): CollecteRow[] {
  const services = config.wasteConfig?.services ?? [];
  const rows: CollecteRow[] = [];
  services.forEach((svc) => {
    svc.days.forEach((dayNum) => {
      const jour = DAY_SHORT[dayNum] ?? `J${dayNum}`;
      rows.push({
        jour,
        type: svc.type,
        heure: `À partir de ${svc.time}`,
        icon: WASTE_ICONS[svc.icon] ?? '🗑️',
        bg: `${svc.color}22`,
        color: svc.color,
      });
    });
  });
  return rows;
}

export type ToiletRow = { nom: string; adresse: string; ouvert: boolean };

export function mapToilet(t: PublicToilet, index: number): ToiletRow {
  return {
    nom: `Sanisette ${index + 1}`,
    adresse: t.adresse,
    ouvert: true,
  };
}

export type MapPoint = {
  type: 'toilet' | 'tri' | 'dechet';
  name: string;
  address: string;
  lat: number;
  lng: number;
  open?: boolean;
  hours?: string;
};

export function toiletsToMapPoints(toilets: PublicToilet[]): MapPoint[] {
  return toilets.map((t) => ({
    type: 'toilet' as const,
    name: 'Toilette publique',
    address: t.adresse,
    lat: t.lat,
    lng: t.lon,
    open: true,
  }));
}

export type HomeWeather = {
  temp: number;
  desc: string;
  icon: string;
  forecast: { day: string; icon: string; hi: number }[];
};

export function mapWeather(w: WeatherData): HomeWeather {
  return {
    temp: Math.round(w.temp),
    desc: w.description,
    icon: w.icon || '☀️',
    forecast: [],
  };
}

export type HomeEventPreview = { id: number | string; titre: string; date: string; lieu: string; emoji: string };

export function eventToHomePreview(e: Evenement): HomeEventPreview {
  const tagEmoji: Record<string, string> = {
    culture: '🎭',
    sport: '⚽',
    marche: '🛒',
    social: '🤝',
    info: '📢',
  };
  return {
    id: e.id,
    titre: e.titre ?? '',
    date: `${e.jour} ${e.mois}`,
    lieu: e.lieu ?? '',
    emoji: tagEmoji[e.tag ?? ''] ?? '📅',
  };
}

export type AlertTicker = { text: string; badge: 'urgent' | 'info'; city?: string };

export function transportToAlerts(lines: TransportLigne[]): AlertTicker[] {
  return lines
    .filter((l) => l.statut === 'perturbe' && l.alerte)
    .map((l) => ({
      text: `${l.num} — ${l.alerte}`,
      badge: 'urgent' as const,
    }));
}

/** Parse "Lun–Ven 8h30–12h30" style opening hours into grid rows */
export function parseOpeningHours(raw?: string): { j: string; h: string }[] {
  if (!raw) {
    return [
      { j: 'Lundi', h: '8h30 – 17h00' },
      { j: 'Mardi', h: '8h30 – 17h00' },
      { j: 'Mercredi', h: '8h30 – 17h00' },
      { j: 'Jeudi', h: '8h30 – 17h00' },
      { j: 'Vendredi', h: '8h30 – 17h00' },
      { j: 'Samedi', h: 'Fermé' },
    ];
  }
  return [{ j: 'Horaires', h: raw }];
}
