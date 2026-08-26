import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../layout/PageLayout';
import { CAT_COLOR } from '../../utils/constants';
import './SocialView.scss';

const CAT_FILTERS = [
  { key: 'tous', label: 'Tous' },
  { key: 'sport', label: '⚽ Sport' },
  { key: 'culture', label: '🎭 Culture' },
  { key: 'social', label: '🤝 Social' },
  { key: 'environnement', label: '🌿 Environnement' },
  { key: 'jeunesse', label: '🔬 Jeunesse' },
  { key: 'sante', label: '🏥 Santé' },
];

export const SocialView: React.FC = () => {
  const [activeFilter, setFilter] = useState('tous');
  const { showView, associations } = useApp();
  const filtered = activeFilter === 'tous' ? associations : associations.filter(a => a.cat === activeFilter);

  return (
    <PageLayout active="home">
      <section className="pl-hero">
        <div className="pl-hero-blob pl-hero-b1" style={{ background: 'rgba(82,214,138,.1)' }} />
        <div className="pl-hero-blob pl-hero-b2" style={{ background: 'rgba(147,112,219,.07)' }} />
        <div className="pl-hero-blob pl-hero-b3" style={{ background: 'rgba(255,179,71,.05)' }} />
        <div className="pl-hero-ghost">Associations</div>
        <div className="pl-hero-left">
          <p className="pl-eyebrow">Vie locale · Associations</p>
          <h1 className="pl-h1">La vie <em>sociale</em>.</h1>
          <p className="pl-sub">Clubs sportifs, associations culturelles, entraide et bénévolat — rejoignez la communauté locale.</p>
        </div>
        <div className="pl-hero-right">
          <div className="pl-hero-stats">
            <div className="pl-stat-block"><div className="pl-stat-num">{associations.length}<em>+</em></div><div className="pl-stat-label">Associations</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: '#52D68A' }}>{associations.length}</div><div className="pl-stat-label">Membres</div></div>
          </div>
        </div>
      </section>
      <div className="pl-content">
        <div className="pl-sec-head"><div><p className="pl-sec-label">Annuaire</p><h2 className="pl-sec-title">Toutes les <em>associations</em>.</h2></div><button className="pl-btn-ghost" onClick={() => showView('home')}>← Retour</button></div>
        <div className="pl-chips" style={{ marginBottom: '1.75rem' }}>
          {CAT_FILTERS.map(f => (<button key={f.key} className={`pl-chip${activeFilter === f.key ? ' on' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>))}
        </div>
        <div className="pl-three-col">
          {filtered.map((a, i) => {
            const c = CAT_COLOR[a.cat] ?? '#888';
            return (
              <div key={a.id} className="pl-card soc-card" style={{ animationDelay: `${i * .06}s` }}>
                <div className="soc-header"><div className="soc-icon" style={{ background: `${c}22` }}>{a.icon}</div><div><div className="soc-name">{a.nom}</div><div className="soc-cat" style={{ color: c }}>{a.cat}</div></div></div>
                <div className="soc-desc">{a.desc}</div>
                <div className="soc-foot">
                  {a.membres && <span className="soc-meta">👥 {a.membres} membres</span>}
                  {a.lieu && <span className="soc-meta">📍 {a.lieu}</span>}
                  {a.horaires && <span className="soc-meta">🕐 {a.horaires}</span>}
                </div>
                {a.tel && <div style={{ marginTop: '.6rem', fontSize: '.76rem', color: 'var(--color-neutral-400)' }}>📞 {a.tel}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};
