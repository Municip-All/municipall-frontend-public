import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../layout/PageLayout';
import { Badge } from '../../components';
import { CAT_STYLE, STATUS_COLOR } from '../../utils/constants';
import './ReportsView.scss';

type Filter = 'tous' | 'en-cours' | 'attente' | 'resolu';

export const ReportsView: React.FC = () => {
  const { signalements } = useApp();
  const [filter, setFilter] = useState<Filter>('tous');

  const filtered = filter === 'tous' ? signalements : signalements.filter(s => s.statut === filter);
  const total = signalements.length;
  const enCours = signalements.filter(s => s.statut === 'en-cours').length;
  const resolus = signalements.filter(s => s.statut === 'resolu').length;
  const attente = total - enCours - resolus;

  const FILTERS: Array<{ key: Filter; label: string }> = [
    { key: 'tous', label: `Tous (${total})` },
    { key: 'en-cours', label: `En cours (${enCours})` },
    { key: 'attente', label: `En attente (${attente})` },
    { key: 'resolu', label: `Résolus (${resolus})` },
  ];

  return (
    <PageLayout active="sig">
      <section className="pl-hero">
        <div className="pl-hero-blob pl-hero-b1" style={{ background: 'rgba(59,85,143,.09)' }} />
        <div className="pl-hero-blob pl-hero-b2" style={{ background: 'rgba(123,143,204,.07)' }} />
        <div className="pl-hero-blob pl-hero-b3" style={{ background: 'rgba(157,110,70,.05)' }} />
        <div className="pl-hero-ghost">Suivi</div>
        <div className="pl-hero-left">
          <p className="pl-eyebrow">Espace citoyen · Suivi</p>
          <h1 className="pl-h1">Mes <em>signalements</em>.</h1>
          <p className="pl-sub">Retrouvez ici tous les signalements effectués depuis l'application mobile. Chaque déclaration est traitée et mise à jour en temps réel.</p>
        </div>
        <div className="pl-hero-right">
          <div className="pl-hero-stats">
            <div className="pl-stat-block"><div className="pl-stat-num">{total}<em>+</em></div><div className="pl-stat-label">Total</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-primary-light)' }}>{enCours}</div><div className="pl-stat-label">En cours</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-success)' }}>{resolus}</div><div className="pl-stat-label">Résolus</div></div>
          </div>
        </div>
      </section>

      <div className="pl-content">
        <div className="sv-mobile-banner">
          <div className="sv-mobile-banner-icon">📱</div>
          <div className="sv-mobile-banner-body">
            <div className="sv-mobile-banner-title">Nouveau signalement ? Utilisez l'application mobile</div>
            <div className="sv-mobile-banner-sub">Les signalements se font exclusivement depuis l'app Municip'All — disponible sur iOS &amp; Android avec votre compte.</div>
          </div>
          <div className="sv-mobile-badge">📲 App mobile</div>
        </div>

        <div className="pl-sec-head"><div><p className="pl-sec-label">Historique</p><h2 className="pl-sec-title">Mes <em>déclarations</em>.</h2></div></div>

        <div className="pl-chips">
          {FILTERS.map(f => (
            <button key={f.key} className={`pl-chip${filter === f.key ? ' on' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>

        <div className="sv-list">
          {filtered.length === 0 ? (
            <div className="pl-card sv-empty">
              <div className="sv-empty-icon">📋</div>
              <div className="sv-empty-title">Aucun signalement</div>
              <div className="sv-empty-sub">{filter === 'tous' ? 'Vous n\'avez pas encore effectué de signalement. Utilisez l\'application mobile pour en créer un.' : 'Aucun signalement dans cette catégorie pour le moment.'}</div>
            </div>
          ) : (
            filtered.map((sig, i) => {
              const style = CAT_STYLE[sig.categorie as string] ?? { bg: 'var(--color-neutral-100)', color: 'var(--color-ink)', icon: '📍' };
              const statusColor = STATUS_COLOR[sig.statut] ?? 'var(--color-primary-light)';
              return (
                <div key={sig.id} className="pl-card sv-card" style={{ animationDelay: `${i * .06}s`, '--sv-color': statusColor } as React.CSSProperties}>
                  <div className="sv-cat-icon" style={{ background: style.bg }}>{style.icon}</div>
                  <div className="sv-card-body">
                    <div className="sv-card-id">{sig.id}</div>
                    <div className="sv-card-title">{sig.description}</div>
                    {sig.adresse && <div className="sv-card-addr">📍 {sig.adresse}</div>}
                    <div className="sv-card-foot">
                      <Badge variant={sig.statut === 'en-cours' ? 'en-cours' : sig.statut === 'attente' ? 'attente' : 'resolu'} />
                      {sig.dateCreation && <span className="sv-card-date">{sig.dateCreation}</span>}
                      {sig.progression != null && <div className="sv-progress"><div className="sv-progress-fill" style={{ width: `${sig.progression}%` }} /></div>}
                    </div>
                    {sig.serviceAssigne && <div className="sv-service">{sig.serviceAssigne}{sig.delaiEstime ? ` · ${sig.delaiEstime}` : ''}</div>}
                    {sig.agentNote && <div className="sv-agent-note"><strong>Note agent :</strong> {sig.agentNote}</div>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageLayout>
  );
};
