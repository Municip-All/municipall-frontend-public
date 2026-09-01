import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../layout/PageLayout';
import { Badge } from '../../components';
import './TransportsView.scss';

export const TransportsView: React.FC = () => {
  const { showView, transportLines } = useApp();
  const perturbees = transportLines.filter(l => l.statut === 'perturbe').length;

  return (
    <PageLayout active="home">
      <section className="pl-hero">
        <div className="pl-hero-blob pl-hero-b1" style={{ background: 'rgba(94,116,205,.12)' }} />
        <div className="pl-hero-blob pl-hero-b2" style={{ background: 'rgba(122,155,109,.07)' }} />
        <div className="pl-hero-blob pl-hero-b3" style={{ background: 'rgba(198,93,78,.05)' }} />
        <div className="pl-hero-ghost">Lignes</div>
        <div className="pl-hero-left">
          <p className="pl-eyebrow">Mobilité · Réseau local</p>
          <h1 className="pl-h1"><em>Transports</em> en commun.</h1>
          <p className="pl-sub">État du réseau, perturbations et fréquences de passage pour les lignes desservant votre commune.</p>
        </div>
        <div className="pl-hero-right">
          <div className="pl-hero-stats">
            <div className="pl-stat-block"><div className="pl-stat-num">{transportLines.length}</div><div className="pl-stat-label">Lignes</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-danger)' }}>{perturbees}</div><div className="pl-stat-label">Perturbées</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-success)' }}>{transportLines.length - perturbees}</div><div className="pl-stat-label">Normales</div></div>
          </div>
        </div>
      </section>
      <div className="pl-content">
        <div className="pl-sec-head"><div><p className="pl-sec-label">État du réseau</p><h2 className="pl-sec-title">Lignes & <em>perturbations</em>.</h2></div><button className="pl-btn-ghost" onClick={() => showView('home')}>← Retour</button></div>
        <div className="pl-two-col">
          {transportLines.map((l, i) => (
            <div key={i} className="pl-card tr-card" style={{ animationDelay: `${i * .08}s` }}>
              <div className="tr-header"><div className="tr-line-badge" style={{ background: l.bg, color: l.color }}>{l.num}</div><div><div className="tr-line-name">{l.nom}</div><div className="tr-line-type">{l.type}</div></div></div>
              <div className="tr-status-row">
                <Badge variant={l.statut === 'perturbe' ? 'perturbe' : l.statut === 'planifie' ? 'planifie' : 'normal'}>{l.statut === 'perturbe' ? 'Perturbé' : l.statut === 'planifie' ? 'Travaux planifiés' : 'Normal'}</Badge>
                {l.freq && <span className="tr-freq">🕐 {l.freq}</span>}
              </div>
              {l.alerte && (<div className="tr-alert" style={{ background: l.statut === 'planifie' ? 'var(--color-primary-bg)' : 'var(--color-danger-bg)', border: `1px solid ${l.statut === 'planifie' ? 'var(--color-primary-border)' : 'var(--color-danger-border)'}` }}><span className="tr-alert-icon">{l.statut === 'planifie' ? '🔧' : '⚠️'}</span><span style={{ color: l.statut === 'planifie' ? 'var(--color-primary-light)' : 'var(--color-danger)' }}>{l.alerte}</span></div>)}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
