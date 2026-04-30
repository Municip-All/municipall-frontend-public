import React, { useState } from 'react';
import { useApp } from './Appcontext';

const FILTERS = ['tout', 'travaux', 'transport', 'evenements', 'urgences', 'associations'] as const;
type Filter = typeof FILTERS[number];

const FILTER_LABELS: Record<Filter, string> = {
  tout: 'Tout', travaux: '🚧 Travaux', transport: '🚌 Transport',
  evenements: '📅 Événements', urgences: '⚠️ Urgences', associations: '🏆 Associations',
};

const CARD_TAGS: Record<string, Filter[]> = {
  weather: ['transport'],
  bus: ['transport'],
  travaux: ['travaux', 'urgences'],
  demandes: ['evenements'],
  agenda: ['evenements'],
  assos: ['associations'],
  satisfaction: ['tout'],
};

export const HomeView: React.FC = () => {
  const { showView, signalements, user } = useApp();
  const [activeFilter, setActiveFilter] = useState<Filter>('tout');
  const [search, setSearch] = useState('');

  const enCours = signalements.filter((s: any) => s.statut === 'attente' || s.statut === 'en-cours');

  const isVisible = (card: string): boolean => {
    if (activeFilter === 'tout') return true;
    return CARD_TAGS[card]?.includes(activeFilter) ?? false;
  };

  const someVisible = ['weather','bus','travaux','demandes','agenda','assos'].some(isVisible);

  return (
    <div className="view active" id="view-home">
      <div className="search-wrap">
        <div className="search">
          <span className="si">🔍</span>
          <input 
            type="text" 
            placeholder="Rue, service, événement…" id="searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="mic">🎤</button>
        </div>
      </div>

      <div className="chips-row" id="homeChips">
        {FILTERS.map(f => (
          <span 
            key={f} 
            className={`chip ${activeFilter === f ? 'on' : ''}`} 
            onClick={() => setActiveFilter(f)}
          >
            {FILTER_LABELS[f]}
          </span>
        ))}
      </div>

      {(['tout','transport','urgences'].includes(activeFilter)) && (
        <div 
          className="filterable-section" 
          style={{
            margin:'.3rem 1rem .5rem', padding:'.6rem .85rem',
            borderRadius:'var(--rm)', background:'rgba(255,179,71,.07)',
            border:'1px solid rgba(255,179,71,.2)', display:'flex',
            alignItems:'center', gap:'.6rem', fontSize:'.75rem', color:'var(--warn)'
          }}
        >
          ⚠️ <span><strong>Perturbation :</strong> Ligne 131 déviée jusqu\'à 18h30 · 
          <span style={{textDecoration:'underline', cursor:'pointer'}} onClick={() => showView('flux')}>Voir détails</span></span>
        </div>
      )}

      <div className="bento">
        {isVisible('weather') && (
          <div className="bc g-blue filterable-section" onClick={() => showView('flux')}>
            <div className="bc__icon">🌤️</div>
            <div className="bc__tag">Météo</div>
            <div className="bc__val">19°C</div>
            <div className="bc__sub">Ensoleillé<br/>Vent 12 km/h</div>
            <div className="bc__arrow">→</div>
          </div>
        )}

        {isVisible('bus') && (
          <div className="bc g-teal filterable-section" onClick={() => showView('flux')}>
            <div className="bc__icon">🚌</div>
            <div className="bc__tag"><span className="live">Live</span></div>
            <div className="bus-rows">
              <div className="bus-r"><span className="bus-num">131</span><span className="bus-d">→ Créteil</span><span className="bus-t">2\'</span></div>
              <div className="bus-r"><span className="bus-num">172</span><span className="bus-d">→ Rungis</span><span className="bus-t">7\'</span></div>
              <div className="bus-r"><span className="bus-num" style={{background:'var(--darker)',fontSize:'.6rem'}}>M7</span><span className="bus-d">Mairie d\'Ivry</span><span className="bus-t">4\'</span></div>
            </div>
          </div>
        )}

        {isVisible('travaux') && (
          <div className="bc wide g-warn filterable-section" onClick={() => showView('flux')}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div><div className="bc__icon" style={{display:'inline'}}>🚧</div><span className="bc__tag" style={{display:'inline',marginLeft:'.4rem'}}>Travaux actifs</span></div>
              <span style={{padding:'.2rem .55rem',borderRadius:'var(--rx)',background:'rgba(255,179,71,.15)',color:'var(--warn)',fontSize:'.65rem',fontFamily:'var(--fd)',fontWeight:700}}>3 chantiers</span>
            </div>
            <div className="bc__val" style={{margin:'.3rem 0 .15rem',fontSize:'1rem'}}>Rue Victor Hugo · Avenue de la Paix · <span style={{color:'var(--muted)'}}>+1</span></div>
            <div className="bc__sub">Chantier principal : 45% terminé</div>
            <div className="trav-bar"><div className="trav-fill" style={{width:'45%'}}></div></div>
            <div className="bc__arrow">→</div>
          </div>
        )}

        {isVisible('demandes') && (
          <div className="bc g-blue filterable-section" onClick={() => showView('demandes')}>
            <div className="bc__icon">📋</div>
            <div className="bc__tag">Mes demandes</div>
            <div className="bc__val">{enCours.length}</div>
            <div className="bc__sub"><span className="status status-prog" style={{fontSize:'.6rem'}}>En cours</span></div>
            <div className="bc__arrow">→</div>
          </div>
        )}

        {isVisible('agenda') && (
          <div className="bc g-teal filterable-section" onClick={() => showView('agenda')}>
            <div className="bc__icon">📅</div>
            <div className="bc__tag">Agenda</div>
            <div className="bc__val">3</div>
            <div className="bc__sub">Événements<br/>cette semaine</div>
            <div className="bc__arrow">→</div>
          </div>
        )}

        {isVisible('assos') && (
          <div className="bc filterable-section" style={{background:'linear-gradient(135deg,rgba(82,214,138,.08),var(--card))',borderColor:'rgba(82,214,138,.15)'}} onClick={() => showView('assos')}>
            <div className="bc__icon">🤝</div>
            <div className="bc__tag">Associations</div>
            <div className="bc__val">12</div>
            <div className="bc__sub">À {user?.ville || 'Villejuif'}</div>
            <div className="bc__arrow">→</div>
          </div>
        )}

        {(activeFilter === 'tout') && (
          <div className="bc wide filterable-section" style={{background:'linear-gradient(135deg,rgba(82,214,138,.08),var(--card))',borderColor:'rgba(82,214,138,.15)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div className="bc__tag">Satisfaction commune</div>
                <div className="bc__val" style={{color:'var(--success)'}}>76/100</div>
                <div className="bc__sub">↑ +4 pts ce mois-ci</div>
              </div>
              <div style={{width:'64px',height:'64px',position:'relative',flexShrink:0}}>
                <svg viewBox="0 0 36 36" style={{width:'100%',height:'100%',transform:'rotate(-90deg)'}}>
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="3"/>
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--success)" strokeWidth="3" strokeDasharray="71 94" strokeLinecap="round"/>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--fd)',fontWeight:800,fontSize:'.7rem',color:'var(--success)'}}>76%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!someVisible && activeFilter !== 'tout' && (
        <div id="home-empty" style={{textAlign:'center',padding:'3rem 1rem',color:'var(--muted)'}}>
          <div style={{fontSize:'2rem',marginBottom:'.6rem'}}>🔍</div>
          <div style={{fontFamily:'var(--fd)',fontWeight:600,fontSize:'.9rem'}}>Aucun résultat pour ce filtre</div>
        </div>
      )}

      {(activeFilter === 'tout') && (
        <>
          <div className="sec-head"><div className="sec-title">🔗 Intégration widget</div></div>
          <div className="widget-promo">
            <div className="wp-title">Widget Municip\'All intégré à votre site</div>
            <div className="wp-desc">Une ligne de code pour intégrer tous les modules directement sur le site de votre mairie.</div>
            <div className="wp-code">&lt;script src="https://cdn.municipall.fr/widget.js" data-commune="{user?.ville?.toLowerCase() || 'villejuif'}"&gt;&lt;/script&gt;</div>
            <button className="btn btn-ghost" style={{width:'100%',fontSize:'.78rem'}} onClick={() => {
              if (navigator.clipboard) navigator.clipboard.writeText('<script src="https://cdn.municipall.fr/widget.js"></script>');
            }}>📋 Copier le code →</button>
          </div>
        </>
      )}
    </div>
  );
};
