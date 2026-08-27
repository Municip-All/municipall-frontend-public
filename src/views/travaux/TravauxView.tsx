import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../layout/PageLayout';
import { Badge } from '../../components';
import './TravauxView.scss';

export const TravauxView: React.FC = () => {
  const { showView, travaux } = useApp();
  const enCours = travaux.filter(t => t.statut === 'en-cours').length;
  const planifie = travaux.filter(t => t.statut === 'planifie').length;

  return (
    <PageLayout active="home">
      <section className="pl-hero">
        <div className="pl-hero-blob pl-hero-b1" style={{ background: 'rgba(217,164,65,.1)' }} />
        <div className="pl-hero-blob pl-hero-b2" style={{ background: 'rgba(138,106,59,.07)' }} />
        <div className="pl-hero-blob pl-hero-b3" style={{ background: 'rgba(122,155,109,.06)' }} />
        <div className="pl-hero-ghost">Travaux</div>
        <div className="pl-hero-left">
          <p className="pl-eyebrow">Infrastructure · Chantiers</p>
          <h1 className="pl-h1">Travaux <em>en cours</em>.</h1>
          <p className="pl-sub">Restez informé des chantiers en cours et planifiés dans votre commune. Accès, délais et impacts sur la circulation.</p>
        </div>
        <div className="pl-hero-right">
          <div className="pl-hero-stats">
            <div className="pl-stat-block"><div className="pl-stat-num">{travaux.length}</div><div className="pl-stat-label">Total chantiers</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-warning)' }}>{enCours}</div><div className="pl-stat-label">En cours</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-primary-light)' }}>{planifie}</div><div className="pl-stat-label">Planifiés</div></div>
          </div>
        </div>
      </section>
      <div className="pl-content">
        <div className="pl-sec-head"><div><p className="pl-sec-label">Chantiers actifs</p><h2 className="pl-sec-title">État <em>des travaux</em>.</h2></div><button className="pl-btn-ghost" onClick={() => showView('home')}>← Retour</button></div>
        <div className="pl-two-col">
          {travaux.map((t, i) => (
            <div key={i} className="pl-card tv-card" style={{ animationDelay: `${i * .08}s` }}>
              <div className="tv-header"><div className="tv-title">{t.titre}</div><span className="tv-type" style={{ background: t.typeBg, color: t.typeColor }}>{t.type}</span></div>
              <div className="tv-addr">📍 {t.addr}</div>
              {t.prog > 0 && <div className="tv-progress"><div className="tv-progress-fill" style={{ width: `${t.prog}%`, background: t.typeColor }} /></div>}
              <div className="tv-foot">
                <Badge variant={t.statut === 'en-cours' ? 'en-cours' : 'planifie'}>{t.statut === 'en-cours' ? 'En cours' : 'Planifié'}</Badge>
                <span className="tv-date">{t.debut} → {t.fin}</span>
                {t.prog > 0 && <span className="tv-date">{t.prog}%</span>}
                <span className="tv-impact">⚠️ {t.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
