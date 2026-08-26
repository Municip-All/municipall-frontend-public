import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../layout/PageLayout';
import { TAG_STYLE } from '../../utils/constants';
import './EventsView.scss';

export const EventsView: React.FC = () => {
  const { showView, events } = useApp();

  return (
    <PageLayout active="evenement">
      <section className="pl-hero">
        <div className="pl-hero-blob pl-hero-b1" style={{ background: 'rgba(147,112,219,.1)' }} />
        <div className="pl-hero-blob pl-hero-b2" style={{ background: 'rgba(224,123,32,.07)' }} />
        <div className="pl-hero-blob pl-hero-b3" style={{ background: 'rgba(59,85,143,.05)' }} />
        <div className="pl-hero-ghost">Agenda</div>
        <div className="pl-hero-left">
          <p className="pl-eyebrow">Agenda · Mai 2026</p>
          <h1 className="pl-h1">La vie de <em>la ville</em>.</h1>
          <p className="pl-sub">Concerts, marchés, réunions publiques, tournois — voici ce qui se passe près de chez vous.</p>
        </div>
        <div className="pl-hero-right">
          <div className="pl-hero-stats">
            <div className="pl-stat-block"><div className="pl-stat-num">{events.length}<em>+</em></div><div className="pl-stat-label">À venir</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: '#7B58B0' }}>3</div><div className="pl-stat-label">Gratuits</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-success)' }}>2</div><div className="pl-stat-label">Ce mois</div></div>
          </div>
        </div>
      </section>

      <div className="pl-content">
        <div className="pl-sec-head">
          <div><p className="pl-sec-label">Prochains rendez-vous</p><h2 className="pl-sec-title">Agenda <em>local</em>.</h2></div>
          <button className="pl-btn-ghost" onClick={() => showView('home')}>← Retour</button>
        </div>
        <div className="ev-grid">
          {events.map((ev, i) => {
            const ts = TAG_STYLE[ev.tag] ?? { bg: 'var(--color-neutral-100)', color: 'var(--color-ink)' };
            return (
              <div key={ev.id} className="pl-card ev-row" style={{ animationDelay: `${i * .09}s` }}>
                {ev.accent && <div className="ev-accent-strip" style={{ background: '#9370DB' }} />}
                <div className="ev-date-col" style={{ background: ts.bg }}>
                  <div className="ev-date-day" style={{ color: ts.color }}>{ev.jour}</div>
                  <div className="ev-date-mois" style={{ color: ts.color }}>{ev.mois}</div>
                </div>
                <div className="ev-card-inner">
                  <span className="ev-tag" style={{ background: ts.bg, color: ts.color }}>{ev.tag}</span>
                  <div className="ev-title">{ev.titre}</div>
                  <div className="ev-meta"><span>🕐 {ev.heure}</span><span>📍 {ev.lieu}</span></div>
                  {ev.desc && <div className="ev-desc">{ev.desc}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};
