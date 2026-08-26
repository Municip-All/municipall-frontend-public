import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewName } from '../../types';
import { MapModal } from '../map/MapView';
import { Badge, Button } from '../../components';
import { CAT_STYLE, STATUS_COLOR } from '../../utils/constants';
import './HomeView.scss';

const WEATHER_DATA: Record<string, { temp: number; desc: string; icon: string; forecast: Array<{ day: string; icon: string; hi: number }> }> = {
  'Kremlin-Bicêtre': { temp: 19, desc: 'Couvert', icon: '☁️', forecast: [{ day: 'Jeu', icon: '⛅', hi: 20 }, { day: 'Ven', icon: '🌦️', hi: 17 }, { day: 'Sam', icon: '☀️', hi: 24 }, { day: 'Dim', icon: '⛅', hi: 22 }] },
  'Bouffémont': { temp: 17, desc: 'Nuageux', icon: '⛅', forecast: [{ day: 'Jeu', icon: '🌧️', hi: 16 }, { day: 'Ven', icon: '⛅', hi: 18 }, { day: 'Sam', icon: '☀️', hi: 22 }, { day: 'Dim', icon: '☀️', hi: 23 }] },
  'Creil': { temp: 16, desc: 'Pluvieux', icon: '🌧️', forecast: [{ day: 'Jeu', icon: '🌦️', hi: 17 }, { day: 'Ven', icon: '⛅', hi: 19 }, { day: 'Sam', icon: '☀️', hi: 23 }, { day: 'Dim', icon: '🌤️', hi: 21 }] },
  'Saint-Maur-les-Fossés': { temp: 20, desc: 'Partiellement ensoleillé', icon: '⛅', forecast: [{ day: 'Jeu', icon: '☀️', hi: 22 }, { day: 'Ven', icon: '⛅', hi: 20 }, { day: 'Sam', icon: '☀️', hi: 25 }, { day: 'Dim', icon: '🌤️', hi: 24 }] },
};

const ALERTS = [
  { text: 'Fermeture route de la Libération — chantier eau potable jusqu\'au 28 juin', badge: 'urgent' as const, city: 'Kremlin-Bicêtre' },
  { text: 'Marché estival : place du Général-de-Gaulle — tous les samedis 8h–13h', badge: 'info' as const, city: 'Général' },
  { text: 'Collecte supplémentaire encombrants prévue le 18 juin dans le quartier Centre', badge: 'info' as const, city: null },
  { text: 'Alerte canicule : brumisateurs ouverts au parc Henri-Barbusse de 10h à 20h', badge: 'urgent' as const, city: null },
];

const SERVICES: Array<{ key: ViewName; num: string; title: string; desc: string; bg: string; color: string; accentColor: string; icon: React.ReactNode }> = [
  { key: 'sig', num: '01', title: 'Signalements', desc: 'Déclarez un incident et suivez son avancement en temps réel.', bg: 'var(--color-primary-bg)', color: 'var(--color-primary-light)', accentColor: 'var(--color-primary-light)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { key: 'collecte', num: '02', title: 'Déchets & Toilettes', desc: 'Points de collecte et sanitaires publics géolocalisés.', bg: 'var(--color-success-bg)', color: 'var(--color-success)', accentColor: 'var(--color-success)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> },
  { key: 'travaux', num: '03', title: 'Travaux', desc: 'Chantiers en cours et planifiés dans votre quartier.', bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', accentColor: 'var(--color-warning)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-1-1a1 1 0 010-1.4l8-8a1 1 0 011.4 0l1 1z"/><path d="M16 2l4 4-1.5 1.5L14.5 3.5z"/><path d="M2 22l1.5-5.5 3.5 3.5z"/></svg> },
  { key: 'transports', num: '04', title: 'Transports', desc: 'Horaires et perturbations en temps réel.', bg: 'var(--color-primary-bg)', color: 'var(--color-primary)', accentColor: 'var(--color-primary)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="21" x2="8" y2="17"/><line x1="16" y1="21" x2="16" y2="17"/><line x1="5" y1="21" x2="19" y2="21"/></svg> },
  { key: 'social', num: '05', title: 'Social & Asso.', desc: 'Associations, groupes citoyens et initiatives locales.', bg: 'var(--color-secondary-bg)', color: 'var(--color-secondary)', accentColor: 'var(--color-secondary)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
];

const DEMO_EVENTS = [
  { id: 1, titre: 'Conseil de quartier', date: '14 juin', lieu: 'Salle des fêtes', emoji: '🏛️' },
  { id: 2, titre: 'Marché bio', date: '15 juin', lieu: 'Place du marché', emoji: '🌿' },
  { id: 3, titre: 'Fête de la musique', date: '21 juin', lieu: 'Esplanade', emoji: '🎵' },
];

export const HomeView: React.FC = () => {
  const { user, signalements, showView, toggleNotif, toggleBot, botOpen, weather: apiWeather, homeEventPreviews, alerts: apiAlerts, cityConfig } = useApp();
  const [showMap, setShowMap] = useState(false);

  const now = new Date();
  const dayName = now.toLocaleDateString('fr-FR', { weekday: 'long' });
  const dateStr = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const ville = user?.ville ?? cityConfig?.officialName ?? cityConfig?.name ?? 'Kremlin-Bicêtre';
  const weather = apiWeather ?? WEATHER_DATA[ville] ?? WEATHER_DATA['Kremlin-Bicêtre'];
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const activeSigs = signalements.filter(s => s.statut !== 'resolu');
  const initials = user ? (user.prenom[0] ?? '') + (user.nom[0] ?? '') : 'M';
  const tickerAlerts = apiAlerts.length ? apiAlerts : ALERTS;
  const allAlerts = [...tickerAlerts, ...tickerAlerts];

  return (
    <div className="home">
      <nav className="home__nav">
        <button type="button" className="home__nav-logo" onClick={() => showView('home')}>Municip<span>'All</span></button>
        <ul className="home__nav-links">
          <li><button type="button" className="home__nav-link home__nav-link--active">Accueil</button></li>
          <li><button type="button" className="home__nav-link" onClick={() => showView('sig')}>Signalements</button></li>
          <li><button type="button" className="home__nav-link" onClick={() => showView('evenement')}>Évènements</button></li>
          <li><button type="button" className="home__nav-link" onClick={() => showView('contact')}>Contact</button></li>
        </ul>
        <div className="home__nav-right">
          <button type="button" className={`home__nav-icon${botOpen ? ' home__nav-icon--on' : ''}`} onClick={toggleBot} title="Assistant MuniBot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></button>
          <button type="button" className="home__nav-icon" onClick={toggleNotif} title="Notifications"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg><span className="home__nav-dot" /></button>
          <button type="button" className="home__nav-avatar" title="Mon profil" onClick={() => showView('profil')}>{initials.toUpperCase()}</button>
        </div>
      </nav>

      <section className="home__hero">
        <div className="home__hero-blobs"><div className="home__hero-blob home__hero-blob--1" /><div className="home__hero-blob home__hero-blob--2" /><div className="home__hero-blob home__hero-blob--3" /></div>
        <div className="home__hero-ghost">{ville.split('-')[0].split(' ')[0]}</div>
        <div className="home__hero-left">
          <p className="home__hero-eyebrow"><span className="home__hero-dot" />{dayName.charAt(0).toUpperCase() + dayName.slice(1)} · {dateStr}</p>
          <h1 className="home__hero-greeting">{greeting},<br /><em>{user?.prenom ?? 'Citoyen'}</em></h1>
          <p className="home__hero-sub">{ville}{user?.quartier ? ` · Quartier ${user.quartier}` : ''} — votre espace municipal</p>
          <div className="home__hero-ctas">
            <Button variant="primary" onClick={() => showView('sig')}>Signaler un problème</Button>
            <Button variant="secondary" onClick={() => setShowMap(true)}>Voir la carte</Button>
          </div>
        </div>
        <div className="home__weather">
          <div className="home__weather-label">Météo · {ville}</div>
          <div className="home__weather-temp">{weather.temp}°</div>
          <div className="home__weather-desc">{weather.desc}</div>
          <div className="home__weather-forecast">
            {weather.forecast.map(f => (
              <div key={f.day} className="home__weather-day">
                <span className="home__weather-day-icon">{f.icon}</span>
                <span className="home__weather-day-temp">{f.hi}°</span>
                <div className="home__weather-day-name">{f.day}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="home__stats-strip">
        <div className="home__stat"><div className="home__stat-num">{signalements.length}</div><div className="home__stat-label">Signalements</div></div>
        <div className="home__stat"><div className="home__stat-num" style={{ color: 'var(--color-primary-lighter)' }}>{activeSigs.length}</div><div className="home__stat-label">En cours</div></div>
        <div className="home__stat"><div className="home__stat-num" style={{ color: 'var(--color-success-light)' }}>{signalements.filter(s => s.statut === 'resolu').length}</div><div className="home__stat-label">Résolus</div></div>
      </div>

      <div className="home__ticker" role="marquee" aria-label="Alertes en direct">
        <div className="home__ticker-track">
          {allAlerts.map((a, i) => (
            <div key={i} className="home__ticker-item">
              <span className={`home__ticker-badge ${a.badge}`}>{a.badge === 'urgent' ? '⚠ Urgent' : '✓ Info'}</span>
              {a.text}
              <span className="home__ticker-dot" />
            </div>
          ))}
        </div>
      </div>

      <div className="home__content">
        <div className="home__section-head">
          <div>
            <p className="home__section-label">Services municipaux</p>
            <h2 className="home__section-title">Tout ce dont vous avez <em>besoin</em>.</h2>
          </div>
        </div>
        <div className="home__services-grid">
          {SERVICES.map((s, i) => (
            <div key={s.key} className="home__service-card" style={{ '--accent-color': s.accentColor, '--accent-text': s.color, animationDelay: `${.7 + i * .14}s` } as React.CSSProperties} onClick={() => showView(s.key)}>
              <div className="home__service-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <h3 className="home__service-title">{s.title}</h3>
              <p className="home__service-desc">{s.desc}</p>
              <span className="home__service-arrow" style={{ color: s.color }}>Accéder →</span>
            </div>
          ))}
        </div>

        <div className="home__section-head" style={{ marginTop: '3.5rem' }}>
          <div><p className="home__section-label">À venir</p><h2 className="home__section-title">Prochains <em>évènements</em>.</h2></div>
          <span className="home__section-link" onClick={() => showView('evenement')}>Tout l'agenda →</span>
        </div>
        <div className="home__events-row">
          {(homeEventPreviews.length ? homeEventPreviews : DEMO_EVENTS).map((ev) => (
            <div key={ev.id} className="home__event-card" onClick={() => showView('evenement')}>
              <div className="home__event-date-tag">📅 {ev.date}</div>
              <div className="home__event-title">{ev.emoji} {ev.titre}</div>
              <div className="home__event-meta">📍 {ev.lieu}</div>
            </div>
          ))}
        </div>

        <div className="home__lower">
          <div>
            <div className="home__section-head"><div><p className="home__section-label">Suivi citoyen</p><h2 className="home__section-title">Mes signalements <em>actifs</em>.</h2></div><span className="home__section-link" onClick={() => showView('sig')}>Tout voir →</span></div>
            <div className="home__sig-list">
              {activeSigs.length === 0 ? (
                <p className="home__empty">Aucun signalement actif pour le moment.</p>
              ) : (
                activeSigs.map((sig) => {
                  const cat = CAT_STYLE[sig.categorie as string] ?? { bg: 'var(--color-primary-bg)', color: 'var(--color-primary-light)', icon: '📍' };
                  const statusColor = STATUS_COLOR[sig.statut] ?? 'var(--color-primary-light)';
                  return (
                    <div key={sig.id} className="home__sig-card" style={{ '--sig-color': statusColor } as React.CSSProperties} onClick={() => showView('sig')}>
                      <div className="home__sig-cat" style={{ background: cat.bg }}>{cat.icon}</div>
                      <div className="home__sig-body">
                        <div className="home__sig-title">{sig.description}</div>
                        {sig.adresse && <div className="home__sig-addr">📍 {sig.adresse}</div>}
                        <div className="home__sig-foot">
                          <Badge variant={sig.statut === 'en-cours' ? 'en-cours' : sig.statut === 'attente' ? 'attente' : 'resolu'} />
                          {sig.dateCreation && <span className="home__sig-date">{sig.dateCreation}</span>}
                          {sig.progression != null && <div className="home__sig-progress"><div className="home__sig-progress-fill" style={{ width: `${sig.progression}%` }} /></div>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <Button variant="secondary" fullWidth onClick={() => showView('sig')}>Voir tous mes signalements →</Button>
            </div>
          </div>
          <div>
            <div className="home__aside-card">
              <div className="home__aside-top">
                <div className="home__aside-avatar-row"><div className="home__aside-avatar">{initials.toUpperCase()}</div><div><div className="home__aside-name">{user?.prenom} {user?.nom}</div><div className="home__aside-role">Citoyen · {ville}</div></div></div>
                <div className="home__aside-stats">
                  <div className="home__aside-stat-box"><div className="home__aside-stat-num">{signalements.length}</div><div className="home__aside-stat-lbl">Signalements</div></div>
                  <div className="home__aside-stat-box"><div className="home__aside-stat-num">{activeSigs.length}</div><div className="home__aside-stat-lbl">En cours</div></div>
                </div>
              </div>
              <div className="home__aside-body">
                <div className="home__aside-row"><span className="home__aside-row-label">📍 Quartier</span><span className="home__aside-row-val">{user?.quartier ?? '—'}</span></div>
                <div className="home__aside-row"><span className="home__aside-row-label">📧 Email</span><span className="home__aside-row-val">{user?.email ?? '—'}</span></div>
                <div className="home__aside-row"><span className="home__aside-row-label">✅ Résolus</span><span className="home__aside-row-val" style={{ color: 'var(--color-success)' }}>{signalements.filter(s => s.statut === 'resolu').length}</span></div>
              </div>
              <button className="home__aside-cta" onClick={() => showView('profil')}>Mon profil →</button>
            </div>
          </div>
        </div>
      </div>

      <button className="home__map-fab" aria-label="Ouvrir la carte" onClick={() => setShowMap(true)}>
        <div className="home__map-fab-tip">Carte interactive</div>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
      </button>

      {showMap && <MapModal onClose={() => setShowMap(false)} />}
    </div>
  );
};
