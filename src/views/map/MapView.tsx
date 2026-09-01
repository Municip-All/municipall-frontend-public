import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';
import { mergeMapPoints, type MapPoint } from '../../lib/mappers';
import { ThemeToggle } from '../../components';
import './MapView.scss';

type PointType = MapPoint['type'];

const MAP_POINTS: Record<string, MapPoint[]> = {
  'Kremlin-Bicêtre': [
    { type: 'toilet', name: 'Place du Marché', address: 'Place centrale', lat: 48.8141, lng: 2.3620, open: true, hours: '7h – 22h' },
    { type: 'toilet', name: 'Parc Central — Entrée Est', address: 'Allée des Platanes', lat: 48.8162, lng: 2.3595, open: true, hours: '8h – 20h' },
    { type: 'toilet', name: 'Gare routière', address: 'Av. du Général Leclerc', lat: 48.8125, lng: 2.3640, open: true, hours: '6h – 23h' },
    { type: 'toilet', name: 'Médiathèque', address: '14 Rue de la Bibliothèque', lat: 48.8150, lng: 2.3605, open: true, hours: '9h – 18h' },
    { type: 'toilet', name: 'Stade Municipal', address: 'Rue des Sports', lat: 48.8110, lng: 2.3560, open: false, hours: 'Jours de match' },
    { type: 'tri', name: 'Point tri — Rue Victor Hugo', address: '12 Rue Victor Hugo', lat: 48.8145, lng: 2.3625 },
    { type: 'tri', name: 'Point tri — Place République', address: 'Place de la République', lat: 48.8138, lng: 2.3618 },
    { type: 'tri', name: 'Conteneurs verre — Parc', address: 'Entrée parc, Allée des Platanes', lat: 48.8163, lng: 2.3592 },
    { type: 'tri', name: 'Point tri — Av. Clemenceau', address: '45 Avenue Clemenceau', lat: 48.8132, lng: 2.3605 },
    { type: 'tri', name: 'Conteneurs — Quartier Sud', address: 'Rue Paul Vaillant-Couturier', lat: 48.8118, lng: 2.3598 },
    { type: 'dechet', name: 'Déchetterie Municipale', address: 'Zone industrielle, Rue des Ateliers', lat: 48.8108, lng: 2.3578, open: true, hours: 'Mar–Sam 9h–18h' },
    { type: 'eau', name: 'Fontaine — Place du Marché', address: 'Place centrale', lat: 48.8139, lng: 2.3615, open: true },
    { type: 'eau', name: 'Fontaine — Parc Central', address: 'Allée des Platanes', lat: 48.8158, lng: 2.3590, open: true },
    { type: 'eau', name: 'Brumisateur — Parc Henri-Barbusse', address: 'Parc Henri-Barbusse', lat: 48.8120, lng: 2.3570, open: true, hours: '10h – 20h (été)' },
  ],
  'Bouffémont': [
    { type: 'toilet', name: 'Mairie — Toilettes publiques', address: 'Place de la Mairie', lat: 49.0814, lng: 2.3556, open: true, hours: '8h30 – 17h' },
    { type: 'toilet', name: 'Parc Municipal', address: 'Allée du Parc', lat: 49.0825, lng: 2.3540, open: true, hours: '8h – 19h' },
    { type: 'toilet', name: 'Salle des fêtes', address: 'Rue de la Forge', lat: 49.0808, lng: 2.3570, open: false, hours: 'Événements uniquement' },
    { type: 'tri', name: 'Point tri Centre-ville', address: 'Place du Marché', lat: 49.0812, lng: 2.3562 },
    { type: 'tri', name: 'Conteneurs verre — Parc', address: 'Entrée Parc Municipal', lat: 49.0823, lng: 2.3548 },
    { type: 'tri', name: 'Point tri — Quartier Nord', address: 'Rue de la Croix Blanche', lat: 49.0828, lng: 2.3538 },
    { type: 'dechet', name: 'Déchetterie de Bouffémont', address: 'Route de Domont', lat: 49.0798, lng: 2.3528, open: true, hours: 'Mer, Sam 9h–12h30' },
  ],
  'Creil': [
    { type: 'toilet', name: 'Place de la Gare', address: 'Parvis de la Gare SNCF', lat: 49.2596, lng: 2.4839, open: true, hours: '6h – 22h' },
    { type: 'toilet', name: 'Marché couvert', address: 'Rue du Marché', lat: 49.2610, lng: 2.4855, open: true, hours: '8h – 13h (mar, jeu, sam)' },
    { type: 'toilet', name: 'Parc Urbain — Centre', address: 'Boulevard Gambetta', lat: 49.2580, lng: 2.4820, open: true, hours: '8h – 20h' },
    { type: 'toilet', name: 'Centre commercial', address: 'Avenue Jean Jaurès', lat: 49.2602, lng: 2.4845, open: true, hours: '9h30 – 20h' },
    { type: 'tri', name: 'Point tri Gare', address: 'Place de la Gare', lat: 49.2594, lng: 2.4836 },
    { type: 'tri', name: 'Conteneurs — Bd Gambetta', address: '78 Boulevard Gambetta', lat: 49.2585, lng: 2.4828 },
    { type: 'tri', name: 'Point tri Saint-Médard', address: 'Rue de Saint-Médard', lat: 49.2615, lng: 2.4830 },
    { type: 'tri', name: 'Conteneurs verre — Plateau', address: 'Quartier du Plateau', lat: 49.2570, lng: 2.4862 },
    { type: 'dechet', name: 'Déchetterie de Creil', address: 'Route de Verberie', lat: 49.2558, lng: 2.4798, open: true, hours: 'Lun–Sam 9h–18h' },
    { type: 'dechet', name: 'Déchetterie Moulin', address: 'Quartier du Moulin', lat: 49.2568, lng: 2.4810, open: false, hours: 'Fermée — travaux' },
  ],
  'Saint-Maur-les-Fossés': [
    { type: 'toilet', name: 'La Varenne — Gare', address: 'Parvis de la gare La Varenne', lat: 48.8005, lng: 2.4925, open: true, hours: '7h – 21h' },
    { type: 'toilet', name: 'Centre-ville', address: 'Place des Marronniers', lat: 48.7994, lng: 2.4914, open: true, hours: '7h – 22h' },
    { type: 'toilet', name: 'Parc Bonneuil', address: 'Chemin des Bords de Marne', lat: 48.7980, lng: 2.4900, open: true, hours: '8h – 20h' },
    { type: 'toilet', name: 'Adamville', address: 'Rue d\'Adamville', lat: 48.8010, lng: 2.4895, open: false, hours: 'En cours de rénovation' },
    { type: 'tri', name: 'Point apport — La Varenne', address: 'Rue de la Varenne', lat: 48.8003, lng: 2.4930 },
    { type: 'tri', name: 'Conteneurs — Centre', address: 'Avenue de la Résistance', lat: 48.7996, lng: 2.4920 },
    { type: 'tri', name: 'Point tri — Champigny', address: 'Avenue de Champigny', lat: 48.7970, lng: 2.4935 },
    { type: 'tri', name: 'Conteneurs verre — Parc', address: 'Allée du Parc Bonneuil', lat: 48.7983, lng: 2.4892 },
    { type: 'dechet', name: 'Déchetterie Saint-Maur', address: '2 Avenue du Parc', lat: 48.7958, lng: 2.4875, open: true, hours: 'Mar–Sam 9h–12h / 14h–17h30' },
  ],
};

function makeIcon(type: PointType, visible: boolean): L.DivIcon {
  const cfg: Record<PointType, { bg: string; border: string; emoji: string }> = {
    toilet: { bg: '#8FCB86', border: '#3F6B3A', emoji: '🚻' },
    tri: { bg: '#5A8A52', border: '#2E4A28', emoji: '♻️' },
    dechet: { bg: '#D9A441', border: '#9D7228', emoji: '🗑️' },
    eau: { bg: '#7B8FCC', border: '#4E5FA0', emoji: '💧' },
  };
  const c = cfg[type];
  const html = visible
    ? `<div style="width:38px;height:38px;background:${c.bg};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid #F8F3E7;box-shadow:0 3px 14px rgba(0,0,0,.5);transition:transform .18s">${c.emoji}</div>`
    : '<span></span>';
  return L.divIcon({ html, className: '', iconSize: [38, 38], iconAnchor: [19, 19], popupAnchor: [0, -22] });
}

function pointColor(type: PointType) {
  if (type === 'toilet') return { bg: 'rgba(143,203,134,.16)', color: '#8FCB86' };
  if (type === 'tri') return { bg: 'rgba(90,138,82,.20)', color: '#A9D89E' };
  if (type === 'eau') return { bg: 'rgba(123,143,204,.18)', color: '#93A6E0' };
  return { bg: 'rgba(217,164,65,.18)', color: '#E8C173' };
}
function typeLabel(type: PointType) {
  if (type === 'toilet') return 'Toilette publique';
  if (type === 'tri') return 'Point de tri';
  if (type === 'eau') return "Point d'eau";
  return 'Déchetterie';
}

interface MapModalProps {
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({ onClose }) => {
  const { user, mapCenter, mapPoints, cityConfig } = useApp();
  const commune = user?.ville ?? cityConfig?.officialName ?? cityConfig?.name ?? 'Kremlin-Bicêtre';
  const center = mapCenter;
  const points = mergeMapPoints(mapPoints, MAP_POINTS[commune] ?? []);

  const [active, setActive] = useState<Set<PointType>>(new Set<PointType>(['toilet', 'tri', 'dechet', 'eau']));

  const toggle = useCallback((t: PointType) => {
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(t)) { next.delete(t); } else { next.add(t); }
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const count = (t: PointType) => points.filter(p => p.type === t).length;
  const visible = points.filter(p => active.has(p.type));

  return (
    <div className="mm-overlay">
      <div className="mm-topbar">
        <button className="mm-back" onClick={onClose} title="Fermer (Echap)">✕</button>
        <div className="mm-title">Carte <em>{commune}</em></div>
        <div className="mm-filters">
          <button className={`mm-filter${active.has('toilet') ? ' on toilet' : ''}`} onClick={() => toggle('toilet')}>🚻 Toilettes <span className="mm-count">{count('toilet')}</span></button>
          <button className={`mm-filter${active.has('tri') ? ' on tri' : ''}`} onClick={() => toggle('tri')}>♻️ Points de tri <span className="mm-count">{count('tri')}</span></button>
          <button className={`mm-filter${active.has('dechet') ? ' on dechet' : ''}`} onClick={() => toggle('dechet')}>🗑️ Déchetteries <span className="mm-count">{count('dechet')}</span></button>
          <button className={`mm-filter${active.has('eau') ? ' on eau' : ''}`} onClick={() => toggle('eau')}>💧 Points d'eau <span className="mm-count">{count('eau')}</span></button>
        </div>
        <ThemeToggle />
      </div>
      <div className="mm-map-wrap">
        <MapContainer center={center} zoom={15} style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <ZoomControl position="bottomright" />
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
                      {(pt.type === 'toilet' || pt.type === 'eau') && (<span className="mm-popup-badge" style={pt.open ? { background: 'rgba(143,203,134,.18)', color: '#8FCB86' } : { background: 'rgba(224,120,95,.18)', color: '#E0785F' }}>{pt.open ? 'Ouvert' : 'Fermé'}</span>)}
                      {pt.hours && <span className="mm-popup-hours">🕐 {pt.hours}</span>}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        <div className="mm-legend">
          <div className="mm-legend-label">Légende</div>
          <div className="mm-legend-row"><div className="mm-legend-dot" style={{ background: '#8FCB86' }} />Toilettes publiques</div>
          <div className="mm-legend-row"><div className="mm-legend-dot" style={{ background: '#5A8A52' }} />Points de tri</div>
          <div className="mm-legend-row"><div className="mm-legend-dot" style={{ background: '#D9A441' }} />Déchetteries</div>
          <div className="mm-legend-row"><div className="mm-legend-dot" style={{ background: '#7B8FCC' }} />Points d'eau</div>
        </div>
      </div>
    </div>
  );
};
