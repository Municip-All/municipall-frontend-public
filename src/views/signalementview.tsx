import React, { useEffect, useState } from 'react';
import { useApp } from './Appcontext';
import { TopNav } from './layout';

const css = `
/* ── Cards ─────────────────────────────────────── */
.sv-list { display: flex; flex-direction: column; gap: .9rem; }

.sv-card {
  padding: 1.3rem 1.5rem; display: flex; gap: 1.1rem; align-items: flex-start;
  cursor: default; animation: ma-up .55s cubic-bezier(.22,1,.36,1) both;
  border-left: 3px solid var(--sv-color, rgba(15,15,14,.1));
}
.sv-cat-icon {
  width: 44px; height: 44px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.sv-card-body { flex: 1; min-width: 0; }
.sv-card-id {
  font-size: .65rem; color: rgba(15,15,14,.22); margin-bottom: .2rem;
  font-variant-numeric: tabular-nums; letter-spacing: .04em; font-weight: 500;
}
.sv-card-title { font-weight: 600; font-size: .95rem; color: #0F0F0E; margin-bottom: .22rem; }
.sv-card-addr { font-size: .78rem; color: rgba(15,15,14,.38); margin-bottom: .55rem; display: flex; align-items: center; gap: .3rem; }
.sv-card-foot { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
.sv-card-date { font-size: .7rem; color: rgba(15,15,14,.28); }
.sv-progress {
  flex: 1; min-width: 50px; height: 2px;
  background: rgba(15,15,14,.08); border-radius: 1px; overflow: hidden;
}
.sv-progress-fill {
  height: 100%; background: var(--sv-color, #3B558F); border-radius: 1px;
  transition: width 1.1s cubic-bezier(.25,.46,.45,.94);
}
.sv-service {
  font-size: .72rem; color: rgba(15,15,14,.35); margin-top: .35rem;
  display: flex; align-items: center; gap: .4rem;
}
.sv-service::before {
  content: ''; width: 4px; height: 4px; border-radius: 50%;
  background: rgba(15,15,14,.2); flex-shrink: 0;
}
.sv-agent-note {
  margin-top: .7rem; padding: .65rem .95rem;
  background: rgba(24,109,16,.05); border: 1px solid rgba(24,109,16,.12);
  border-radius: 8px; font-size: .76rem; color: rgba(15,15,14,.55); line-height: 1.55;
}
.sv-agent-note strong { color: #186D10; }

/* ── Mobile info banner ─────────────────────────── */
.sv-mobile-banner {
  display: flex; align-items: center; gap: 1rem;
  padding: 1rem 1.4rem; border-radius: 12px;
  background: linear-gradient(135deg, rgba(59,85,143,.06), rgba(83,74,183,.06));
  border: 1px solid rgba(59,85,143,.14);
  margin-bottom: 2rem; animation: ma-up .6s cubic-bezier(.22,1,.36,1) .25s both;
}
.sv-mobile-banner-icon {
  width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, #1A3A8F, #3B558F);
  display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
}
.sv-mobile-banner-body { flex: 1; min-width: 0; }
.sv-mobile-banner-title {
  font-weight: 600; font-size: .88rem; color: #0F0F0E; margin-bottom: .18rem;
}
.sv-mobile-banner-sub {
  font-size: .76rem; color: rgba(15,15,14,.45); line-height: 1.5;
}
.sv-mobile-badge {
  display: inline-flex; align-items: center; gap: .35rem;
  padding: .3rem .8rem; border-radius: 2rem; flex-shrink: 0;
  background: #0F0F0E; color: #FAFAF8;
  font-size: .7rem; font-weight: 600; letter-spacing: .04em;
  white-space: nowrap;
}

/* ── Empty state ────────────────────────────────── */
.sv-empty {
  padding: 3rem 2rem; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: .9rem;
}
.sv-empty-icon { font-size: 2.4rem; opacity: .35; }
.sv-empty-title {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 1.2rem; letter-spacing: -.4px; color: #0F0F0E;
}
.sv-empty-sub { font-size: .84rem; color: rgba(15,15,14,.4); line-height: 1.6; max-width: 320px; }
`;

const CAT_STYLE: Record<string, { bg: string; color: string; icon: string }> = {
  'Voirie':        { bg: 'rgba(59,85,143,.12)',  color: '#3B558F', icon: '🛣️' },
  'Éclairage':     { bg: 'rgba(224,123,32,.12)', color: '#E07B20', icon: '💡' },
  'Propreté':      { bg: 'rgba(24,109,16,.12)',  color: '#186D10', icon: '🗑️' },
  'Espaces verts': { bg: 'rgba(24,109,16,.12)',  color: '#186D10', icon: '🌳' },
  'Stationnement': { bg: 'rgba(83,74,183,.12)',  color: '#534AB7', icon: '🚗' },
  'Bâtiment':      { bg: 'rgba(157,110,70,.12)', color: '#9D6E46', icon: '🏚️' },
  'Nuisance':      { bg: 'rgba(198,40,40,.1)',   color: '#C62828', icon: '🔊' },
  'Autre':         { bg: 'rgba(15,15,14,.07)',   color: '#0F0F0E', icon: '📍' },
};

const STATUS_COLOR: Record<string, string> = {
  'en-cours': '#3B558F',
  'attente':  '#E07B20',
  'resolu':   '#186D10',
};

type Filter = 'tous' | 'en-cours' | 'attente' | 'resolu';

export const SignalementView: React.FC = () => {
  const { signalements } = useApp();
  const [filter, setFilter] = useState<Filter>('tous');

  useEffect(() => {
    const id = 'municipall-sig-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = css;
      document.head.appendChild(s);
    }
  }, []);

  const filtered = filter === 'tous'
    ? signalements
    : signalements.filter(s => s.statut === filter);

  const total   = signalements.length;
  const enCours = signalements.filter(s => s.statut === 'en-cours').length;
  const resolus = signalements.filter(s => s.statut === 'resolu').length;
  const attente = total - enCours - resolus;

  const FILTERS: Array<{ key: Filter; label: string }> = [
    { key: 'tous',     label: `Tous (${total})` },
    { key: 'en-cours', label: `En cours (${enCours})` },
    { key: 'attente',  label: `En attente (${attente})` },
    { key: 'resolu',   label: `Résolus (${resolus})` },
  ];

  return (
    <div className="ma-root">
      <TopNav active="sig" />

      <section className="ma-hero">
        <div className="ma-hero-blob ma-hero-b1" style={{ background: 'rgba(59,85,143,.09)' }} />
        <div className="ma-hero-blob ma-hero-b2" style={{ background: 'rgba(123,143,204,.07)' }} />
        <div className="ma-hero-blob ma-hero-b3" style={{ background: 'rgba(157,110,70,.05)' }} />
        <div className="ma-hero-ghost">Suivi</div>

        <div className="ma-hero-left">
          <p className="ma-eyebrow">Espace citoyen · Suivi</p>
          <h1 className="ma-h1">Mes <em>signalements</em>.</h1>
          <p className="ma-sub">
            Retrouvez ici tous les signalements effectués depuis l'application mobile.
            Chaque déclaration est traitée et mise à jour en temps réel.
          </p>
        </div>

        <div className="ma-hero-right">
          <div className="ma-hero-stats">
            <div className="ma-stat-block">
              <div className="ma-stat-num">{total}<em>+</em></div>
              <div className="ma-stat-label">Total</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#3B558F' }}>{enCours}</div>
              <div className="ma-stat-label">En cours</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#186D10' }}>{resolus}</div>
              <div className="ma-stat-label">Résolus</div>
            </div>
          </div>
        </div>
      </section>

      <div className="ma-content">

        {/* Bannière app mobile */}
        <div className="sv-mobile-banner">
          <div className="sv-mobile-banner-icon">📱</div>
          <div className="sv-mobile-banner-body">
            <div className="sv-mobile-banner-title">Nouveau signalement ? Utilisez l'application mobile</div>
            <div className="sv-mobile-banner-sub">
              Les signalements se font exclusivement depuis l'app Municip'All — disponible sur iOS &amp; Android avec votre compte.
            </div>
          </div>
          <div className="sv-mobile-badge">📲 App mobile</div>
        </div>

        {/* Filtres */}
        <div className="ma-sec-head">
          <div>
            <p className="ma-sec-label">Historique</p>
            <h2 className="ma-sec-title">Mes <em>déclarations</em>.</h2>
          </div>
        </div>

        <div className="ma-chips">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`ma-chip${filter === f.key ? ' on' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Liste */}
        <div className="sv-list">
          {filtered.length === 0 ? (
            <div className="ma-card sv-empty">
              <div className="sv-empty-icon">📋</div>
              <div className="sv-empty-title">Aucun signalement</div>
              <div className="sv-empty-sub">
                {filter === 'tous'
                  ? 'Vous n\'avez pas encore effectué de signalement. Utilisez l\'application mobile pour en créer un.'
                  : 'Aucun signalement dans cette catégorie pour le moment.'}
              </div>
            </div>
          ) : (
            filtered.map((sig, i) => {
              const style = CAT_STYLE[sig.categorie as string]
                         ?? { bg: 'rgba(15,15,14,.07)', color: '#0F0F0E', icon: '📍' };
              const statusColor = STATUS_COLOR[sig.statut] ?? '#3B558F';
              return (
                <div
                  key={sig.id}
                  className="ma-card sv-card"
                  style={{
                    animationDelay: `${i * .06}s`,
                    '--sv-color': statusColor,
                  } as React.CSSProperties}
                >
                  <div className="sv-cat-icon" style={{ background: style.bg }}>
                    {style.icon}
                  </div>
                  <div className="sv-card-body">
                    <div className="sv-card-id">{sig.id}</div>
                    <div className="sv-card-title">{sig.description}</div>
                    {sig.adresse && (
                      <div className="sv-card-addr">📍 {sig.adresse}</div>
                    )}
                    <div className="sv-card-foot">
                      <span className={`ma-badge ${sig.statut}`}>
                        {sig.statut === 'en-cours' ? 'En cours'
                          : sig.statut === 'attente' ? 'En attente'
                          : 'Résolu'}
                      </span>
                      {sig.dateCreation && (
                        <span className="sv-card-date">{sig.dateCreation}</span>
                      )}
                      {sig.progression != null && (
                        <div className="sv-progress">
                          <div className="sv-progress-fill" style={{ width: `${sig.progression}%` }} />
                        </div>
                      )}
                    </div>
                    {sig.serviceAssigne && (
                      <div className="sv-service">
                        {sig.serviceAssigne}
                        {sig.delaiEstime ? ` · ${sig.delaiEstime}` : ''}
                      </div>
                    )}
                    {sig.agentNote && (
                      <div className="sv-agent-note">
                        <strong>Note agent :</strong> {sig.agentNote}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
