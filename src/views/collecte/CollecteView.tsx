import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../layout/PageLayout';
import { Badge } from '../../components';
import './CollecteView.scss';

export const CollecteView: React.FC = () => {
  const { showView, collecteSchedule, toilets } = useApp();

  return (
    <PageLayout active="home">
      <section className="pl-hero">
        <div className="pl-hero-blob pl-hero-b1" style={{ background: 'rgba(74,103,65,.1)' }} />
        <div className="pl-hero-blob pl-hero-b2" style={{ background: 'rgba(94,116,205,.09)' }} />
        <div className="pl-hero-blob pl-hero-b3" style={{ background: 'rgba(217,164,65,.05)' }} />
        <div className="pl-hero-ghost">Déchets</div>
        <div className="pl-hero-left">
          <p className="pl-eyebrow">Services · Propreté urbaine</p>
          <h1 className="pl-h1"><em>Collecte</em> & toilettes.</h1>
          <p className="pl-sub">Calendrier des collectes de déchets et localisation des toilettes publiques les plus proches.</p>
        </div>
        <div className="pl-hero-right">
          <div className="pl-hero-stats">
            <div className="pl-stat-block"><div className="pl-stat-num">{collecteSchedule.length}</div><div className="pl-stat-label">Collectes/sem.</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-success)' }}>{toilets.filter(t => t.ouvert).length}</div><div className="pl-stat-label">Toilettes ouvertes</div></div>
          </div>
        </div>
      </section>
      <div className="pl-content">
        <div className="pl-two-col">
          <div>
            <div className="pl-sec-head"><div><p className="pl-sec-label">Planning</p><h2 className="pl-sec-title">Calendrier <em>collecte</em>.</h2></div><button className="pl-btn-ghost" onClick={() => showView('home')}>← Retour</button></div>
            <div className="col-schedule">{collecteSchedule.map((c, i) => (<div key={i} className="pl-card col-day-row" style={{ animationDelay: `${i * .08}s` }}><div className="col-day-pill" style={{ background: c.bg, color: c.color }}>{c.jour}</div><span className="col-day-icon">{c.icon}</span><div className="col-day-info"><div className="col-day-type">{c.type}</div><div className="col-day-time">{c.heure}</div></div></div>))}</div>
          </div>
          <div>
            <div className="pl-sec-head" style={{ marginTop: '3.25rem' }}><div><p className="pl-sec-label">Localisation</p><h2 className="pl-sec-title">Toilettes <em>publiques</em>.</h2></div></div>
            <div className="col-toilet-grid">{toilets.map((t, i) => (<div key={i} className="pl-card col-toilet-row" style={{ animationDelay: `${i * .07}s` }}><span className="col-toilet-icon">🚻</span><div><div className="col-toilet-name">{t.nom}</div><div className="col-toilet-addr">{t.adresse}</div></div><div className="col-toilet-status"><Badge variant={t.ouvert ? 'ouvert' : 'ferme'}>{t.ouvert ? 'Ouvert' : 'Fermé'}</Badge></div></div>))}</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
