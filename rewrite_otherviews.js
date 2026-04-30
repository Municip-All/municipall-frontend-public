const fs = require('fs');

let out = `import React, { useState } from 'react';
import { useApp } from './Appcontext';

export const DemandesView: React.FC = () => {
  const { showView, signalements } = useApp();
  const [tab, setTab] = useState<'encours'|'terminees'|'archives'>('encours');
  
  const encours = signalements.filter((s:any) => s.statut === 'attente' || s.statut === 'en-cours');
  const terminees = signalements.filter((s:any) => s.statut === 'resolu' || s.statut === 'rejete');

  return (
    <div className="view active" id="view-demandes">
      <div className="tabs">
        <button className={\`tab-btn \${tab==='encours'?'on':''}\`} onClick={() => setTab('encours')}>
          En cours <span style={{background: 'rgba(78,205,196,.15)', color: 'var(--accent)', padding: '.1rem .4rem', borderRadius: '20px', fontSize: '.65rem', marginLeft: '.2rem'}}>{encours.length}</span>
        </button>
        <button className={\`tab-btn \${tab==='terminees'?'on':''}\`} onClick={() => setTab('terminees')}>
          Terminées <span style={{background: 'rgba(82,214,138,.1)', color: 'var(--success)', padding: '.1rem .4rem', borderRadius: '20px', fontSize: '.65rem', marginLeft: '.2rem'}}>{terminees.length}</span>
        </button>
        <button className={\`tab-btn \${tab==='archives'?'on':''}\`} onClick={() => setTab('archives')}>Archives</button>
      </div>

      <div className={\`tab-panel \${tab==='encours'?'on':''}\`}>
        {encours.length === 0 ? (
          <div style={{padding: '3rem 1rem', textAlign: 'center', color: 'var(--muted)'}}>
            <div style={{fontSize: '2.5rem', marginBottom: '.8rem'}}>📋</div>
            <div style={{fontFamily: 'var(--fd)', fontWeight: 600, fontSize: '.9rem'}}>Aucune demande en cours</div>
          </div>
        ) : encours.map((s:any) => (
          <div className="ticket" key={s.id}>
            <div className="ticket-head">
              <div className="ticket-cat">
                <span className="ticket-cat-icon">🛠️</span>
                <div>
                  <div className="ticket-title">{s.categorie}</div>
                  <div className="ticket-id">{s.id}</div>
                </div>
              </div>
              <span className={\`status \${s.statut==='attente'?'status-wait':'status-prog'}\`}>{s.statut==='attente'?'En attente':'En cours'}</span>
            </div>
            <div className="ticket-loc">📍 {s.adresse} · {s.dateCreation}</div>
            <div className="ticket-footer">
              <span className="ticket-time">⏱ Délai estimé : 3j restants</span>
              <div className="ticket-actions">
                <button className="ta-btn chat">💬 Chatter</button>
                <button className="ta-btn">↗ Partager</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={\`tab-panel \${tab==='terminees'?'on':''}\`}>
        {terminees.length === 0 ? (
          <div style={{padding: '3rem 1rem', textAlign: 'center', color: 'var(--muted)'}}>
             <div style={{fontSize: '2.5rem', marginBottom: '.8rem'}}>✅</div>
             <div style={{fontFamily: 'var(--fd)', fontWeight: 600, fontSize: '.9rem'}}>Aucune demande terminée</div>
          </div>
        ) : terminees.map((s:any) => (
          <div className="ticket" key={s.id}>
             <div className="ticket-head">
              <div className="ticket-cat">
                <span className="ticket-cat-icon">✅</span>
                <div>
                  <div className="ticket-title">{s.categorie}</div>
                  <div className="ticket-id">{s.id}</div>
                </div>
              </div>
              <span className="status status-done">Résolu</span>
            </div>
            <div className="ticket-loc">📍 {s.adresse} · {s.dateCreation}</div>
             <div className="ticket-footer">
              <span className="ticket-time" style={{color:'var(--success)'}}>✓ Résolu</span>
              <div className="ticket-actions">
                <button className="ta-btn">⭐ Évaluer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={\`tab-panel \${tab==='archives'?'on':''}\`}>
          <div style={{padding: '3rem 1rem', textAlign: 'center', color: 'var(--muted)'}}>
            <div style={{fontSize: '2.5rem', marginBottom: '.8rem'}}>🗃️</div>
            <div style={{fontFamily: 'var(--fd)', fontWeight: 600, fontSize: '.9rem', marginBottom: '.4rem'}}>Aucune archive</div>
            <div style={{fontSize: '.8rem', lineHeight: 1.6}}>Vos demandes classées apparaîtront ici après 90 jours.</div>
          </div>
      </div>
    </div>
  );
};

export const FluxView: React.FC = () => {
  return (
    <div className="view active" id="view-flux">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.9rem 1rem .5rem' }}>
        <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: '1rem' }}>Flux en direct</div>
        <span className="live">Temps réel</span>
      </div>
      <div style={{ padding: '0 1rem .9rem' }}>
        <div className="weather-big">
          <div className="wb-left">
            <div className="wb-icon">🌤️</div>
            <div className="wb-temp">19°</div>
            <div className="wb-desc">Ciel dégagé<br/>Qualité air : Bonne</div>
          </div>
          <div className="wb-right">
            <div className="wb-item"><span>Humidité</span><span>42%</span></div>
            <div className="wb-item"><span>Vent</span><span>12 km/h</span></div>
            <div className="wb-item"><span>UV</span><span>Faible</span></div>
          </div>
        </div>
      </div>

      <div className="feed-list">
        <div className="feed-item urgent">
          <div className="fi-icon" style={{background: 'rgba(255,107,107,.15)'}}>⚠️</div>
          <div className="fi-content">
            <div className="fi-head"><span className="fi-title">Urgence Voirie</span><span className="fi-time">À l'instant</span></div>
            <div className="fi-desc">Fuite d'eau importante Route de Corbeil. Équipes sur place. Évitez le secteur.</div>
          </div>
        </div>
        <div className="feed-item">
          <div className="fi-icon" style={{background: 'rgba(78,205,196,.15)'}}>🚌</div>
          <div className="fi-content">
             <div className="fi-head"><span className="fi-title">Info Trafic</span><span className="fi-time">Il y a 12 min</span></div>
             <div className="fi-desc">Ligne 131 : Retours à la normale des horaires prévus d'ici 15 minutes.</div>
          </div>
        </div>
        <div className="feed-item">
          <div className="fi-icon" style={{background: 'rgba(82,214,138,.15)'}}>🌳</div>
          <div className="fi-content">
             <div className="fi-head"><span className="fi-title">Espaces Verts</span><span className="fi-time">Il y a 1h</span></div>
             <div className="fi-desc">Les parcs et jardins ferment exceptionnellement à 19h ce soir pour entretien.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AgendaView: React.FC = () => {
  return (
    <div className="view active" id="view-agenda">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.9rem 1rem .5rem' }}>
         <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: '1rem' }}>Agenda de la ville</div>
         <div className="icon-btn" style={{ width: 32, height: 32 }}>🔍</div>
      </div>

      <div className="chips-row">
        <span className="chip on">Ce week-end</span>
        <span className="chip">Culture</span>
        <span className="chip">Sport</span>
        <span className="chip">Famille</span>
      </div>

      <div style={{ padding: '0 1rem' }}>
        <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>3 événements à venir</p>
        
        <div className="event-card">
          <div className="ec-date"><div className="ec-day">24</div><div className="ec-month">AVR</div></div>
          <div className="ec-content">
            <div className="ec-title">Concert Jazz en plein air</div>
            <div className="ec-info">📍 Parc de la Méridienne · 20h00</div>
            <div className="ec-info">Gratuit · Restauration sur place</div>
          </div>
        </div>

        <div className="event-card">
          <div className="ec-date"><div className="ec-day">25</div><div className="ec-month">AVR</div></div>
          <div className="ec-content">
            <div className="ec-title">Brocante de Printemps</div>
             <div className="ec-info">📍 Centre-ville · 08h00 - 18h00</div>
             <div className="ec-info">Plus de 200 exposants attendus</div>
          </div>
        </div>

        <div className="event-card">
           <div className="ec-date"><div className="ec-day">27</div><div className="ec-month">AVR</div></div>
           <div className="ec-content">
             <div className="ec-title">Atelier numérique Senior</div>
             <div className="ec-info">📍 Médiathèque · 14h30</div>
             <div className="ec-info">Sur inscription (reste 3 places)</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export const ProfilView: React.FC = () => {
  const { user } = useApp();
  const [modal, setModal] = useState<string|null>(null);

  return (
    <div className="view active" id="view-profil">
      <div className="profil-head">
        <div className="ph-avatar">{user?.avatar || 'MB'}</div>
        <div className="ph-name">{user?.prenom} {user?.nom}</div>
        <div className="ph-email">{user?.email}</div>
      </div>
      
      <div className="settings-list">
        <div className="settings-section">Mon Compte</div>
        <div className="setting-row" onClick={() => setModal('identity')}>
          <div className="sr-left">
            <div className="sr-icon">👤</div>
            <div>
              <div className="sr-label">Informations personnelles</div>
              <div className="sr-sub">{user?.prenom} {user?.nom}</div>
            </div>
          </div>
          <div className="sr-right"><span style={{fontSize:'.7rem', color:'var(--accent)'}}>Modifier</span><span className="sr-chevron">›</span></div>
        </div>
        <div className="setting-row" onClick={() => setModal('address')}>
          <div className="sr-left">
             <div className="sr-icon">📍</div>
             <div>
               <div className="sr-label">Mon adresse</div>
               <div className="sr-sub">12 Rue Pasteur, {user?.ville}</div>
             </div>
          </div>
          <div className="sr-right"><span style={{fontSize:'.7rem', color:'var(--accent)'}}>Modifier</span><span className="sr-chevron">›</span></div>
        </div>
      </div>

       {modal === 'identity' && (
        <div className="modal-overlay" style={{opacity:1, pointerEvents:'auto'}} onClick={() => setModal(null)}>
          <div className="modal-sheet" style={{transform:'translateY(0)'}} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">✏️ Informations</div><div className="modal-close" onClick={() => setModal(null)}>✕</div></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Prénom</label><input className="form-input" value={user?.prenom} readOnly /></div>
              <div className="form-group"><label className="form-label">Nom</label><input className="form-input" value={user?.nom} readOnly /></div>
            </div>
             <button className="btn btn-accent btn-full" onClick={() => setModal(null)}>Enregistrer</button>
          </div>
        </div>
      )}

      {modal === 'address' && (
        <div className="modal-overlay" style={{opacity:1, pointerEvents:'auto'}} onClick={() => setModal(null)}>
          <div className="modal-sheet" style={{transform:'translateY(0)'}} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">📍 Mon adresse</div><div className="modal-close" onClick={() => setModal(null)}>✕</div></div>
            <div className="form-group"><label className="form-label">Adresse complète</label><input className="form-input" defaultValue={\`12 Rue Pasteur, \${user?.codePostal} \${user?.ville}\`} /></div>
            <button className="btn btn-accent btn-full" onClick={() => setModal(null)}>Enregistrer</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ASSOS = [
  {id:1,nom:"AS Villejuif Football",cat:"sport",icon:"⚽",color:"#52D68A",desc:"Club de football amateur fondé en 1932. Entraînements 3x/semaine.",lieu:"Stade de la Redoute"},
  {id:2,nom:"Harmonie Municipale",cat:"culture",icon:"🎺",color:"#9370DB",desc:"Orchestre d'harmonie fondé en 1948. Concerts tout au long de l'année.",lieu:"Conservatoire"},
  {id:3,nom:"Secours Populaire",cat:"social",icon:"🤝",color:"#FFB347",desc:"Distribution alimentaire, aide aux familles, permanences sociales.",lieu:"15 Rue Pasteur"},
  {id:4,nom:"Villejuif En Vert",cat:"environnement",icon:"🌿",color:"#52D68A",desc:"Jardins partagés, ateliers de compostage, biodiversité.",lieu:"Jardin des Cèdres"},
  {id:5,nom:"Danse Classique & Contemporaine",cat:"culture",icon:"🩰",color:"#9370DB",desc:"École de danse pour tous les âges.",lieu:"Maison des Associations"},
  {id:6,nom:"Club des Aînés Actifs",cat:"social",icon:"👴",color:"#FFB347",desc:"Sorties culturelles, activités pour seniors.",lieu:"Centre Social Paul Hochart"}
];

const ASSOS_FILTERS = [
  {id:'tout', label:'Toutes'},
  {id:'sport', label:'⚽ Sport'},
  {id:'culture', label:'🎨 Culture'},
  {id:'social', label:'🤝 Social'},
  {id:'environnement', label:'🌱 Écologie'}
];

export const AssosView: React.FC = () => {
  const [filter, setFilter] = useState('tout');
  const [search, setSearch] = useState('');

  const filtered = ASSOS.filter(a => {
    if (filter !== 'tout' && a.cat !== filter) return false;
    if (search && !a.nom.toLowerCase().includes(search.toLowerCase()) && !a.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="view active" id="view-assos">
      <div className="search-wrap">
        <div className="search">
          <span className="si">🔍</span>
          <input 
            type="text" 
            placeholder="Rechercher une association…" 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="si">🎯</span>
        </div>
      </div>

      <div className="chips-row">
        {ASSOS_FILTERS.map(f => (
          <span 
            key={f.id} 
            className={\`chip \${filter === f.id ? 'on' : ''}\`} 
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </span>
        ))}
      </div>

      <div style={{ padding: '0 1rem' }}>
        <div className="asso-grid">
           {filtered.map(a => (
             <div className="asso-card" key={a.id}>
               <div className="ac-head">
                 <div className="ac-icon" style={{background: \`\${a.color}22\`, color: a.color}}>{a.icon}</div>
                 <div><div className="ac-name">{a.nom}</div><div className="ac-lieu">📍 {a.lieu}</div></div>
               </div>
               <div className="ac-desc">{a.desc}</div>
               <div className="ac-footer">
                 <button className="btn btn-ghost btn-sm" style={{flex: 1}}>Contacter</button>
                 <button className="btn btn-primary btn-sm" style={{flex: 1}}>Rejoindre</button>
               </div>
             </div>
           ))}
           {filtered.length === 0 && (
             <div style={{textAlign:'center', padding:'2rem', color:'var(--muted)', gridColumn:'span 2'}}>Aucune association trouvée</div>
           )}
        </div>
      </div>
    </div>
  );
};
`
fs.writeFileSync('src/test/otherviews.tsx', out);
