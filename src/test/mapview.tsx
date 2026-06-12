import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from './Appcontext';

/* ── CSS ───────────────────────────────────── */
const css = `
@keyframes mm-in {
  from { opacity: 0; transform: scale(.97); }
  to   { opacity: 1; transform: scale(1); }
}

.mm-overlay {
  position: fixed; inset: 0; z-index: 200;
  display: flex; flex-direction: column;
  animation: mm-in .22s cubic-bezier(.22,1,.36,1);
  font-family: 'Inter', sans-serif;
}

.mm-topbar {
  height: 66px; flex-shrink: 0;
  background: rgba(250,250,248,.97);
  border-bottom: 1px solid rgba(15,15,14,.09);
  display: flex; align-items: center; gap: 1.25rem;
  padding: 0 1.75rem;
  box-shadow: 0 2px 20px rgba(15,15,14,.08);
  z-index: 201;
}

.mm-back {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(15,15,14,.07); border: 1px solid rgba(15,15,14,.1);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: .9rem; flex-shrink: 0; transition: background .18s; color: #0F0F0E;
  font-family: 'Inter', sans-serif;
}
.mm-back:hover { background: rgba(15,15,14,.14); }

.mm-title {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 1.15rem; letter-spacing: -.4px; color: #0F0F0E;
  flex: 1;
}
.mm-title em { font-style: italic; color: #3B558F; }

.mm-filters { display: flex; gap: .5rem; }

.mm-filter {
  display: flex; align-items: center; gap: .4rem;
  padding: .42rem 1rem; border-radius: 2rem;
  border: 1.5px solid rgba(15,15,14,.14); background: transparent;
  font-family: 'Inter', sans-serif; font-size: .8rem; font-weight: 500;
  cursor: pointer; transition: all .18s; color: rgba(15,15,14,.55);
  white-space: nowrap;
}
.mm-filter:hover { border-color: rgba(15,15,14,.3); color: #0F0F0E; }
.mm-filter.on.toilet  { background: #186D10; border-color: #186D10; color: #fff; }
.mm-filter.on.tri     { background: #3B558F; border-color: #3B558F; color: #fff; }
.mm-filter.on.dechet  { background: #E07B20; border-color: #E07B20; color: #fff; }

.mm-count {
  font-size: .68rem; font-weight: 700; padding: .1rem .45rem;
  border-radius: 1rem; background: rgba(255,255,255,.25);
}
.mm-filter:not(.on) .mm-count { background: rgba(15,15,14,.07); color: rgba(15,15,14,.45); }

.mm-map-wrap { flex: 1; position: relative; }
.mm-map-wrap .leaflet-container { width: 100%; height: 100%; }

/* Popup overrides */
.leaflet-popup-content-wrapper {
  border-radius: 12px !important;
  border: 1px solid rgba(15,15,14,.1) !important;
  box-shadow: 0 8px 32px rgba(15,15,14,.14) !important;
  padding: 0 !important;
  overflow: hidden;
}
.leaflet-popup-content { margin: 0 !important; }
.leaflet-popup-tip { background: #FAFAF8 !important; }
.leaflet-popup-close-button { top: 8px !important; right: 8px !important; color: rgba(15,15,14,.35) !important; font-size: 1rem !important; }

.mm-popup {
  background: #FAFAF8; padding: .95rem 1.15rem; min-width: 200px;
}
.mm-popup-type {
  font-size: .62rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  margin-bottom: .3rem;
}
.mm-popup-name { font-weight: 700; font-size: .94rem; color: #0F0F0E; margin-bottom: .18rem; }
.mm-popup-addr { font-size: .77rem; color: rgba(15,15,14,.4); margin-bottom: .55rem; }
.mm-popup-foot { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
.mm-popup-badge {
  font-size: .62rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  padding: .22rem .65rem; border-radius: 1rem;
}
.mm-popup-hours { font-size: .72rem; color: rgba(15,15,14,.35); }

/* Legend */
.mm-legend {
  position: absolute; bottom: 1.5rem; left: 1.5rem; z-index: 1000;
  background: rgba(250,250,248,.96); backdrop-filter: blur(12px);
  border: 1px solid rgba(15,15,14,.1); border-radius: 12px;
  padding: .85rem 1.1rem; display: flex; flex-direction: column; gap: .5rem;
  box-shadow: 0 4px 20px rgba(15,15,14,.1); pointer-events: none;
}
.mm-legend-label {
  font-size: .6rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
  color: rgba(15,15,14,.28); margin-bottom: .1rem;
}
.mm-legend-row { display: flex; align-items: center; gap: .6rem; font-size: .78rem; color: rgba(15,15,14,.65); }
.mm-legend-dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.18); }

/* Attribution tuck */
.leaflet-bottom.leaflet-right { bottom: 1.5rem; right: 1.5rem; }
`;

/* ── Data ──────────────────────────────────── */
type PointType = 'toilet' | 'tri' | 'dechet';

interface MapPoint {
  type: PointType;
  name: string;
  address: string;
  lat: number;
  lng: number;
  open?: boolean;
  hours?: string;
}

const MAP_POINTS: Record<string, MapPoint[]> = {
  'Kremlin-Bicêtre': [
    { type: 'toilet', name: 'Place du Marché',            address: 'Place centrale',                    lat: 48.8141, lng: 2.3620, open: true,  hours: '7h – 22h' },
    { type: 'toilet', name: 'Parc Central — Entrée Est',  address: 'Allée des Platanes',               lat: 48.8162, lng: 2.3595, open: true,  hours: '8h – 20h' },
    { type: 'toilet', name: 'Gare routière',              address: 'Av. du Général Leclerc',           lat: 48.8125, lng: 2.3640, open: true,  hours: '6h – 23h' },
    { type: 'toilet', name: 'Médiathèque',                address: '14 Rue de la Bibliothèque',        lat: 48.8150, lng: 2.3605, open: true,  hours: '9h – 18h' },
    { type: 'toilet', name: 'Stade Municipal',            address: 'Rue des Sports',                   lat: 48.8110, lng: 2.3560, open: false, hours: 'Jours de match' },
    { type: 'tri',    name: 'Point tri — Rue Victor Hugo',address: '12 Rue Victor Hugo',               lat: 48.8145, lng: 2.3625 },
    { type: 'tri',    name: 'Point tri — Place République',address: 'Place de la République',          lat: 48.8138, lng: 2.3618 },
    { type: 'tri',    name: 'Conteneurs verre — Parc',    address: 'Entrée parc, Allée des Platanes',  lat: 48.8163, lng: 2.3592 },
    { type: 'tri',    name: 'Point tri — Av. Clemenceau', address: '45 Avenue Clemenceau',             lat: 48.8132, lng: 2.3605 },
    { type: 'tri',    name: 'Conteneurs — Quartier Sud',  address: 'Rue Paul Vaillant-Couturier',      lat: 48.8118, lng: 2.3598 },
    { type: 'dechet', name: 'Déchetterie Municipale',     address: 'Zone industrielle, Rue des Ateliers', lat: 48.8108, lng: 2.3578, open: true, hours: 'Mar–Sam 9h–18h' },
  ],
  'Bouffémont': [
    { type: 'toilet', name: 'Mairie — Toilettes publiques', address: 'Place de la Mairie',         lat: 49.0814, lng: 2.3556, open: true,  hours: '8h30 – 17h' },
    { type: 'toilet', name: 'Parc Municipal',               address: 'Allée du Parc',              lat: 49.0825, lng: 2.3540, open: true,  hours: '8h – 19h' },
    { type: 'toilet', name: 'Salle des fêtes',              address: 'Rue de la Forge',            lat: 49.0808, lng: 2.3570, open: false, hours: 'Événements uniquement' },
    { type: 'tri',    name: 'Point tri Centre-ville',       address: 'Place du Marché',            lat: 49.0812, lng: 2.3562 },
    { type: 'tri',    name: 'Conteneurs verre — Parc',      address: 'Entrée Parc Municipal',      lat: 49.0823, lng: 2.3548 },
    { type: 'tri',    name: 'Point tri — Quartier Nord',    address: 'Rue de la Croix Blanche',    lat: 49.0828, lng: 2.3538 },
    { type: 'dechet', name: 'Déchetterie de Bouffémont',    address: 'Route de Domont',            lat: 49.0798, lng: 2.3528, open: true, hours: 'Mer, Sam 9h–12h30' },
  ],
  'Creil': [
    { type: 'toilet', name: 'Place de la Gare',           address: 'Parvis de la Gare SNCF',      lat: 49.2596, lng: 2.4839, open: true,  hours: '6h – 22h' },
    { type: 'toilet', name: 'Marché couvert',             address: 'Rue du Marché',               lat: 49.2610, lng: 2.4855, open: true,  hours: '8h – 13h (mar, jeu, sam)' },
    { type: 'toilet', name: 'Parc Urbain — Centre',       address: 'Boulevard Gambetta',          lat: 49.2580, lng: 2.4820, open: true,  hours: '8h – 20h' },
    { type: 'toilet', name: 'Centre commercial',          address: 'Avenue Jean Jaurès',          lat: 49.2602, lng: 2.4845, open: true,  hours: '9h30 – 20h' },
    { type: 'tri',    name: 'Point tri Gare',             address: 'Place de la Gare',            lat: 49.2594, lng: 2.4836 },
    { type: 'tri',    name: 'Conteneurs — Bd Gambetta',   address: '78 Boulevard Gambetta',       lat: 49.2585, lng: 2.4828 },
    { type: 'tri',    name: 'Point tri Saint-Médard',     address: 'Rue de Saint-Médard',         lat: 49.2615, lng: 2.4830 },
    { type: 'tri',    name: 'Conteneurs verre — Plateau', address: 'Quartier du Plateau',         lat: 49.2570, lng: 2.4862 },
    { type: 'dechet', name: 'Déchetterie de Creil',       address: 'Route de Verberie',           lat: 49.2558, lng: 2.4798, open: true, hours: 'Lun–Sam 9h–18h' },
    { type: 'dechet', name: 'Déchetterie Moulin',         address: 'Quartier du Moulin',          lat: 49.2568, lng: 2.4810, open: false, hours: 'Fermée — travaux' },
  ],
  'Saint-Maur-les-Fossés': [
    { type: 'toilet', name: 'La Varenne — Gare',         address: 'Parvis de la gare La Varenne', lat: 48.8005, lng: 2.4925, open: true,  hours: '7h – 21h' },
    { type: 'toilet', name: 'Centre-ville',              address: 'Place des Marronniers',        lat: 48.7994, lng: 2.4914, open: true,  hours: '7h – 22h' },
    { type: 'toilet', name: 'Parc Bonneuil',             address: 'Chemin des Bords de Marne',   lat: 48.7980, lng: 2.4900, open: true,  hours: '8h – 20h' },
    { type: 'toilet', name: 'Adamville',                 address: 'Rue d\'Adamville',             lat: 48.8010, lng: 2.4895, open: false, hours: 'En cours de rénovation' },
    { type: 'tri',    name: 'Point apport — La Varenne', address: 'Rue de la Varenne',            lat: 48.8003, lng: 2.4930 },
    { type: 'tri',    name: 'Conteneurs — Centre',       address: 'Avenue de la Résistance',      lat: 48.7996, lng: 2.4920 },
    { type: 'tri',    name: 'Point tri — Champigny',     address: 'Avenue de Champigny',          lat: 48.7970, lng: 2.4935 },
    { type: 'tri',    name: 'Conteneurs verre — Parc',   address: 'Allée du Parc Bonneuil',       lat: 48.7983, lng: 2.4892 },
    { type: 'dechet', name: 'Déchetterie Saint-Maur',    address: '2 Avenue du Parc',             lat: 48.7958, lng: 2.4875, open: true, hours: 'Mar–Sam 9h–12h / 14h–17h30' },
  ],
};

/* ── Icon factory ──────────────────────────── */
function makeIcon(type: PointType, visible: boolean): L.DivIcon {
  const cfg: Record<PointType, { bg: string; border: string; emoji: string }> = {
    toilet: { bg: '#186D10', border: '#0d4a0a', emoji: '🚻' },
    tri:    { bg: '#3B558F', border: '#283c6a', emoji: '♻️' },
    dechet: { bg: '#E07B20', border: '#a85a12', emoji: '🗑️' },
  };
  const c = cfg[type];
  const html = visible
    ? `<div style="width:38px;height:38px;background:${c.bg};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 3px 14px rgba(0,0,0,.28);transition:transform .18s">${c.emoji}</div>`
    : '<span></span>';
  return L.divIcon({ html, className: '', iconSize: [38, 38], iconAnchor: [19, 19], popupAnchor: [0, -22] });
}

/* ── Popup ─────────────────────────────────── */
function pointColor(type: PointType) {
  if (type === 'toilet') return { bg: 'rgba(24,109,16,.1)', color: '#186D10' };
  if (type === 'tri')    return { bg: 'rgba(59,85,143,.1)',  color: '#3B558F' };
  return                        { bg: 'rgba(224,123,32,.1)', color: '#E07B20' };
}
function typeLabel(type: PointType) {
  if (type === 'toilet') return 'Toilette publique';
  if (type === 'tri')    return 'Point de tri';
  return 'Déchetterie';
}

/* ── MapModal component ────────────────────── */
interface MapModalProps {
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({ onClose }) => {
  const { user, mapCenter, mapPoints, cityConfig } = useApp();
  const commune = user?.ville ?? cityConfig?.officialName ?? cityConfig?.name ?? 'Kremlin-Bicêtre';
  const center  = mapCenter;
  const points  = mapPoints.length ? mapPoints : (MAP_POINTS[commune] ?? []);

  const [active, setActive] = useState<Set<PointType>>(new Set<PointType>(['toilet', 'tri', 'dechet']));

  const toggle = useCallback((t: PointType) => {
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(t)) { next.delete(t); } else { next.add(t); }
      return next;
    });
  }, []);

  useEffect(() => {
    const id = 'municipall-map-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = css;
      document.head.appendChild(s);
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const count = (t: PointType) => points.filter(p => p.type === t).length;

  const visible = points.filter(p => active.has(p.type));

  return (
    <div className="mm-overlay">
      {/* Top bar */}
      <div className="mm-topbar">
        <button className="mm-back" onClick={onClose} title="Fermer (Echap)">✕</button>
        <div className="mm-title">Carte <em>{commune}</em></div>

        <div className="mm-filters">
          <button
            className={`mm-filter${active.has('toilet') ? ' on toilet' : ''}`}
            onClick={() => toggle('toilet')}
          >
            🚻 Toilettes <span className="mm-count">{count('toilet')}</span>
          </button>
          <button
            className={`mm-filter${active.has('tri') ? ' on tri' : ''}`}
            onClick={() => toggle('tri')}
          >
            ♻️ Points de tri <span className="mm-count">{count('tri')}</span>
          </button>
          <button
            className={`mm-filter${active.has('dechet') ? ' on dechet' : ''}`}
            onClick={() => toggle('dechet')}
          >
            🗑️ Déchetteries <span className="mm-count">{count('dechet')}</span>
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="mm-map-wrap">
        <MapContainer
          center={center}
          zoom={15}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {visible.map((pt, i) => {
            const col = pointColor(pt.type);
            return (
              <Marker key={i} position={[pt.lat, pt.lng]} icon={makeIcon(pt.type, true)}>
                <Popup>
                  <div className="mm-popup">
                    <div className="mm-popup-type" style={{ color: col.color }}>{typeLabel(pt.type)}</div>
                    <div className="mm-popup-name">{pt.name}</div>
                    <div className="mm-popup-addr">{pt.address}</div>
                    <div className="mm-popup-foot">
                      {pt.type === 'toilet' && (
                        <span
                          className="mm-popup-badge"
                          style={pt.open
                            ? { background: 'rgba(24,109,16,.12)', color: '#186D10' }
                            : { background: 'rgba(198,40,40,.1)',  color: '#C62828' }
                          }
                        >
                          {pt.open ? 'Ouvert' : 'Fermé'}
                        </span>
                      )}
                      {pt.hours && (
                        <span className="mm-popup-hours">🕐 {pt.hours}</span>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="mm-legend">
          <div className="mm-legend-label">Légende</div>
          <div className="mm-legend-row">
            <div className="mm-legend-dot" style={{ background: '#186D10' }} />
            Toilettes publiques
          </div>
          <div className="mm-legend-row">
            <div className="mm-legend-dot" style={{ background: '#3B558F' }} />
            Points de tri
          </div>
          <div className="mm-legend-row">
            <div className="mm-legend-dot" style={{ background: '#E07B20' }} />
            Déchetteries
          </div>
        </div>
      </div>
    </div>
  );
};
