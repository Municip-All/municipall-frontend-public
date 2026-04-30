import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useApp } from './Appcontext';

const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(tab => (tab as HTMLElement).classList.remove('on'));
  panels.forEach(panel => (panel as HTMLElement).classList.remove('on'));
  e.currentTarget.classList.add('on');
  const index = Array.from(tabs).indexOf(e.currentTarget as Element);
  if (panels[index]) (panels[index] as HTMLElement).classList.add('on');
};

export const DemandesView: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await api.get('/reports');
        if (data && Array.isArray(data)) setReports(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchReports();
  }, []);

  const inProgress = reports.filter(r => r.status !== 'Terminé' && r.status !== 'Résolu');
  const finished = reports.filter(r => r.status === 'Terminé' || r.status === 'Résolu');

  return (
    <div className="view active" id="view-demandes">
      <div className="tabs">
        <button className="tab-btn on" onClick={handleTabClick}>En cours <span style={{'background': 'rgba(78,205,196,.15)', 'color': 'var(--accent)', 'padding': '.1rem .4rem', 'borderRadius': '20px', 'fontSize': '.65rem', 'marginLeft': '.2rem'}}>{inProgress.length}</span></button>
        <button className="tab-btn" onClick={handleTabClick}>Terminées <span style={{'background': 'rgba(82,214,138,.1)', 'color': 'var(--success)', 'padding': '.1rem .4rem', 'borderRadius': '20px', 'fontSize': '.65rem', 'marginLeft': '.2rem'}}>{finished.length}</span></button>
        <button className="tab-btn" onClick={handleTabClick}>Archives</button>
      </div>
      <div className="tab-panel on" id="tab-encours">
        {loading ? <div style={{'padding': '2rem', 'textAlign': 'center'}}>Chargement...</div> : 
         inProgress.length === 0 ? <div style={{'padding': '2rem', 'textAlign': 'center', 'color': 'var(--muted)'}}>Aucune demande en cours</div> :
         inProgress.map((report, idx) => (
          <div key={idx} className="ticket">
            <div className="ticket-head">
              <div className="ticket-cat">
                <span className="ticket-cat-icon">📍</span>
                <div>
                  <div className="ticket-title">{report.title || report.category}</div>
                  <div className="ticket-id">#{report.id}</div>
                </div>
              </div>
              <span className={`status ${report.status === 'En cours' ? 'status-prog' : 'status-wait'}`}>{report.status}</span>
            </div>
            <div className="ticket-loc">📍 {report.address || report.locationName} · Il y a {new Date(report.createdAt).toLocaleDateString()}</div>
            <div className="ticket-footer">
              <span className="ticket-time">⏱ Traitement en cours</span>
              <div className="ticket-actions">
                <button className="ta-btn chat">💬 Chatter</button>
                <button className="ta-btn">↗ Partager</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="tab-panel" id="tab-terminees">
        {finished.length === 0 ? <div style={{'padding': '2rem', 'textAlign': 'center', 'color': 'var(--muted)'}}>Aucune demande terminée</div> :
         finished.map((report, idx) => (
          <div key={idx} className="ticket">
            <div className="ticket-head">
              <div className="ticket-cat">
                <span className="ticket-cat-icon">📍</span>
                <div>
                  <div className="ticket-title">{report.title || report.category}</div>
                  <div className="ticket-id">#{report.id}</div>
                </div>
              </div>
              <span className="status status-done">Résolu</span>
            </div>
            <div className="ticket-loc">📍 {report.address || report.locationName}</div>
            <div className="ticket-footer">
              <span className="ticket-time" style={{'color': 'var(--success)'}}>✓ Résolu</span>
            </div>
          </div>
        ))}
      </div>
      <div className="tab-panel" id="tab-archives">
        <div style={{'padding': '3rem 1rem', 'textAlign': 'center', 'color': 'var(--muted)'}}><div style={{'fontSize': '2.5rem', 'marginBottom': '.8rem'}}>🗃️</div><div style={{'fontFamily': 'var(--fd)', 'fontWeight': '600', 'fontSize': '.9rem', 'marginBottom': '.4rem'}}>Aucune archive</div></div>
      </div>
    </div>
  );
};

export const FluxView: React.FC = () => {
  return (
    <div className="view active" id="view-flux">

      <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'padding': '.9rem 1rem .5rem'}}><div style={{'fontFamily': 'var(--fd)', 'fontWeight': '800', 'fontSize': '1rem'}}>Flux en direct</div><span className="live">Temps réel</span></div>
      <div style={{'padding': '0 1rem .9rem'}}>
        <div className="weather-big">
          <div className="weather-main"><div className="weather-icon">🌤️</div><div><div className="weather-temp">19°<span style={{'fontSize': '1.2rem'}}>C</span></div><div className="weather-cond">Ensoleillé · Villejuif</div></div></div>
          <div className="weather-stats"><div className="weather-stat">💨 <strong>12 km/h</strong></div><div className="weather-stat">💧 <strong>45%</strong></div><div className="weather-stat">👁️ <strong>10 km</strong></div><div style={{'marginTop': '.4rem', 'fontSize': '.68rem', 'color': 'var(--muted)'}}>Demain : 17°C 🌦️</div></div>
        </div>
      </div>
      <div className="flux-section">
        <div className="flux-section-head"><div className="flux-section-title">🚌 Transports <span className="live" style={{'marginLeft': '.4rem'}}>Live</span></div></div>
        <div className="flux-card" style={{'borderLeft': '3px solid var(--warn)'}}><div className="fc-icon">⚠️</div><div className="fc-body"><div className="fc-title">Ligne 131 — PERTURBÉE</div><div className="fc-sub">Bus dévié via Avenue de Paris · Jusqu'à 18h30</div></div><div className="fc-right"><span style={{'fontSize': '.65rem', 'color': 'var(--warn)', 'background': 'rgba(255,179,71,.1)', 'padding': '.2rem .5rem', 'borderRadius': '20px', 'fontFamily': 'var(--fd)', 'fontWeight': '700'}}>Dévié</span></div></div>
        <div className="flux-card"><div className="fc-icon">🚌</div><div className="fc-body"><div className="fc-title">Ligne 131 · Direction Créteil</div><div className="fc-sub">Arrêt : Hôtel de Ville</div></div><div className="fc-right"><div className="fc-time">2'</div><div className="fc-unit">prochain bus</div></div></div>
        <div className="flux-card"><div className="fc-icon">🚌</div><div className="fc-body"><div className="fc-title">Ligne 172 · Direction Rungis</div><div className="fc-sub">Arrêt : Hôtel de Ville</div></div><div className="fc-right"><div className="fc-time">7'</div><div className="fc-unit">prochain bus</div></div></div>
        <div className="flux-card"><div className="fc-icon">🚇</div><div className="fc-body"><div className="fc-title">Métro 7 · Trafic normal</div><div className="fc-sub">Mairie d'Ivry ↔ La Courneuve</div></div><div className="fc-right"><div className="fc-time">4'</div><div className="fc-unit">prochain train</div></div></div>
      </div>
      <div className="flux-section">
        <div className="flux-section-head"><div className="flux-section-title">🚧 Travaux en cours</div></div>
        <ConstructionWorksList />
      </div>
      <div className="flux-section">
        <div className="flux-section-head"><div className="flux-section-title">⚠️ Alertes municipales</div></div>
        <div className="flux-card" style={{'background': 'rgba(255,107,107,.05)', 'borderColor': 'rgba(255,107,107,.2)'}}><div className="fc-icon">🔴</div><div className="fc-body"><div className="fc-title" style={{'color': 'var(--danger)'}}>Perturbation réseau bus</div><div className="fc-sub">Ligne 131 déviée — Prévoir +10 min de trajet</div></div></div>
      </div>
    </div>
  );
};

const ConstructionWorksList: React.FC = () => {
  const [works, setWorks] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const data = await api.get('/construction-works');
        if (data && Array.isArray(data)) setWorks(data);
      } catch (e) { console.error(e); }
    };
    fetchWorks();
  }, []);

  if (works.length === 0) return <div style={{'padding': '1rem', 'textAlign': 'center', 'fontSize': '.8rem', 'color': 'var(--muted)'}}>Aucun travail signalé</div>;

  return (
    <>
      {works.map((work, idx) => (
        <div key={idx} className="flux-card" style={{'borderLeft': `3px solid ${work.status === 'En cours' ? 'var(--warn)' : 'var(--blue-l)'}`}}>
          <div className="fc-icon">🚧</div>
          <div className="fc-body">
            <div className="fc-title">{work.locationName}</div>
            <div className="fc-sub">{work.title} · {work.impactType}</div>
            <div style={{'marginTop': '.3rem', 'height': '2px', 'background': 'var(--border)', 'borderRadius': '2px', 'overflow': 'hidden'}}>
              <div style={{'width': work.status === 'En cours' ? '45%' : '10%', 'height': '100%', 'background': work.status === 'En cours' ? 'var(--warn)' : 'var(--blue-l)'}}></div>
            </div>
            <div style={{'fontSize': '.62rem', 'color': 'var(--muted)', 'marginTop': '.2rem'}}>Fin prévue : {new Date(work.endDate).toLocaleDateString()}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export const AgendaView: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('Tout');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.get('/events');
        if (data && Array.isArray(data)) setEvents(data);
      } catch (e) { console.error(e); }
    };
    fetchEvents();
  }, []);

  const handleAgendaFilter = (category: string) => {
    setFilter(category);
  };

  const filteredEvents = filter === 'Tout' 
    ? events 
    : events.filter(e => e.category === filter || e.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="view active" id="view-agenda">
      <div className="search-wrap"><div className="search"><span className="si">🔍</span><input type="text" placeholder="Rechercher un événement…" /><span className="si">🎯</span></div></div>
      <div className="agenda-cats">
        {['Tout', 'Culture', 'Sport', 'Social', 'Marché', 'Info'].map(cat => (
          <span key={cat} className={`chip ${filter === cat ? 'on' : ''}`} onClick={() => handleAgendaFilter(cat)}>
            {cat === 'Culture' ? '🎵 ' : cat === 'Sport' ? '🏆 ' : cat === 'Social' ? '🤝 ' : cat === 'Marché' ? '🛒 ' : cat === 'Info' ? 'ℹ️ ' : ''}{cat}
          </span>
        ))}
      </div>
      
      <div className="sec-head"><div className="sec-title">Prochainement</div></div>
      
      {filteredEvents.length === 0 ? (
        <div style={{'padding': '2rem', 'textAlign': 'center', 'color': 'var(--muted)'}}>Aucun événement trouvé</div>
      ) : (
        filteredEvents.map((event, idx) => {
          const date = new Date(event.startDate);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' });
          return (
            <div key={idx} className="event-card" data-tag={event.category.toLowerCase()}>
              <div className="event-date-col">
                <div className="ev-day" style={{'color': 'var(--accent)'}}>{day}</div>
                <div className="ev-month">{month}</div>
              </div>
              <div className="event-body">
                <div className="event-title">{event.title} · {event.location}</div>
                <div className="event-meta">
                  <span>🕗 {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={`event-tag tag-${event.category.toLowerCase()}`}>{event.category}</span>
                </div>
                <div style={{'marginTop': '.4rem', 'fontSize': '.72rem', 'color': 'var(--muted)'}}>{event.description}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export const ProfilView: React.FC = () => {
  const { user, updateUser, logout: logoutApp } = useApp();
  
  const [userInfo, setUserInfo] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    tel: user?.telephone || '',
    dob: user?.dateNaissance || ''
  });

  const [address, setAddress] = useState({
    rue: user?.rue || '',
    cp: user?.codePostal || '',
    ville: user?.ville || '',
    quartier: user?.quartier || '',
    comp: ''
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        tel: user.telephone || '',
        dob: user.dateNaissance || ''
      });
      setAddress({
        rue: user.rue || '',
        cp: user.codePostal || '',
        ville: user.ville || '',
        quartier: user.quartier || '',
        comp: ''
      });
    }
  }, [user]);

  const [notifications, setNotifications] = useState({
    demandes: true,
    alertes: true,
    evenements: false
  });

  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('fr');
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [pwData, setPwData] = useState({ old: '', new: '', confirm: '' });
  const [avatar, setAvatar] = useState('MB');

  const openModal = (modal: string) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  const handleLogout = () => {
    alert('Déconnexion... À bientôt!');
    // Redirection vers la page de login
  };

  const handleToggle = (setting: string) => {
    if (setting === 'demandes') setNotifications({...notifications, demandes: !notifications.demandes});
    else if (setting === 'alertes') setNotifications({...notifications, alertes: !notifications.alertes});
    else if (setting === 'evenements') setNotifications({...notifications, evenements: !notifications.evenements});
    else if (setting === 'dark') setDarkMode(!darkMode);
  };

  const handleCopyCode = () => {
    const code = '<script src="https://cdn.municipall.fr/widget.js" data-commune="villejuif"></script>';
    navigator.clipboard.writeText(code);
    alert('Code copié!');
  };

  const updateProfile = async () => {
    await updateUser({
      prenom: userInfo.prenom,
      nom: userInfo.nom,
      telephone: userInfo.tel,
      dateNaissance: userInfo.dob,
      rue: address.rue,
      codePostal: address.cp,
      ville: address.ville as any,
      quartier: address.quartier as any
    });
    closeModal();
    alert('✅ Profil mis à jour!');
  };

  const updatePassword = () => {
    if (pwData.new !== pwData.confirm) {
      alert('⚠️ Les mots de passe ne correspondent pas!');
      return;
    }
    alert('✅ Mot de passe changé!');
    setPwData({old: '', new: '', confirm: ''});
    closeModal();
  };

  return (
    <div className="view active" id="view-profil">

      <div className="profil-hero">
        <div className="profil-avatar-wrap">
          <div className="profil-avatar" id="profilAvatar" onClick={() => openModal('avatar')} style={{'cursor': 'pointer'}}>{avatar}</div>
          <div className="profil-avatar-edit" title="Modifier la photo" onClick={() => openModal('avatar')} style={{'cursor': 'pointer'}}>✏️</div>
        </div>
        <div className="profil-name" id="profilName">{userInfo.prenom} {userInfo.nom}</div>
        <div className="profil-commune">📍 Villejuif · Quartier {address.quartier === 'paul-hochart' ? 'Paul Hochart' : address.quartier}</div>
      </div>
      <div className="profil-stats">
        <div className="ps-card"><div className="ps-val">5</div><div className="ps-lbl">Signalements</div></div>
        <div className="ps-card"><div className="ps-val" style={{'color': 'var(--success)'}}>3</div><div className="ps-lbl">Résolus</div></div>
        <div className="ps-card"><div className="ps-val" style={{'color': 'var(--warn)'}}>12</div><div className="ps-lbl">Jours moy.</div></div>
      </div>

      <div className="settings-section">
        <div className="settings-title">Mon compte</div>
        <div className="setting-row" style={{'cursor': 'pointer'}} onClick={(e) => {e.preventDefault(); openModal('identity');}}>
          <div className="sr-left"><div className="sr-icon">👤</div><div><div className="sr-label">Informations personnelles</div><div className="sr-sub" id="sr-sub-email">{userInfo.email}</div></div></div>
          <div className="sr-right"><span style={{'fontSize': '.7rem', 'color': 'var(--accent)', 'cursor': 'pointer'}} onClick={(e) => {e.stopPropagation(); openModal('identity');}}>Modifier</span><span className="sr-chevron">›</span></div>
        </div>
        <div className="setting-row" style={{'cursor': 'pointer'}} onClick={(e) => {e.preventDefault(); openModal('address');}}>
          <div className="sr-left"><div className="sr-icon">📍</div><div><div className="sr-label">Mon adresse</div><div className="sr-sub" id="sr-sub-address">{address.rue}, {address.cp}</div></div></div>
          <div className="sr-right"><span style={{'fontSize': '.7rem', 'color': 'var(--accent)', 'cursor': 'pointer'}} onClick={(e) => {e.stopPropagation(); openModal('address');}}>Modifier</span><span className="sr-chevron">›</span></div>
        </div>
        <div className="setting-row" style={{'cursor': 'pointer'}} onClick={(e) => {e.preventDefault(); openModal('password');}}>
          <div className="sr-left"><div className="sr-icon">🔑</div><div><div className="sr-label">Mot de passe</div><div className="sr-sub">Dernière modification : il y a 3 mois</div></div></div>
          <div className="sr-right"><span style={{'fontSize': '.7rem', 'color': 'var(--accent)', 'cursor': 'pointer'}} onClick={(e) => {e.stopPropagation(); openModal('password');}}>Modifier</span><span className="sr-chevron">›</span></div>
        </div>
        <div className="setting-row">
          <div className="sr-left"><div className="sr-icon">📄</div><div><div className="sr-label">Mes documents</div><div className="sr-sub">Attestations, courriers</div></div></div>
          <span className="sr-chevron">›</span>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-title">Notifications</div>
        <div className="setting-row"><div className="sr-left"><div className="sr-icon">🔔</div><div className="sr-label">Mises à jour de mes demandes</div></div><div className={'toggle' + (notifications.demandes ? ' on' : '')} onClick={() => handleToggle('demandes')} style={{'cursor': 'pointer'}}></div></div>
        <div className="setting-row"><div className="sr-left"><div className="sr-icon">📢</div><div className="sr-label">Alertes de la commune</div></div><div className={'toggle' + (notifications.alertes ? ' on' : '')} onClick={() => handleToggle('alertes')} style={{'cursor': 'pointer'}}></div></div>
        <div className="setting-row"><div className="sr-left"><div className="sr-icon">📅</div><div className="sr-label">Rappels événements</div></div><div className={'toggle' + (notifications.evenements ? ' on' : '')} onClick={() => handleToggle('evenements')} style={{'cursor': 'pointer'}}></div></div>
      </div>

      <div className="settings-section">
        <div className="settings-title">Intégration Commune</div>
        <div style={{'padding': '.4rem 0 .8rem'}}>
          <div className="wp-code">&lt;script src="https://cdn.municipall.fr/widget.js" data-commune="villejuif"&gt;&lt;/script&gt;</div>
          <button className="btn btn-ghost" style={{'width': '100%', 'marginTop': '.5rem', 'fontSize': '.78rem'}} onClick={handleCopyCode}>📋 Copier le code d'intégration</button>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-title">Application</div>
        <div className="setting-row"><div className="sr-left"><div className="sr-icon">🌙</div><div className="sr-label">Mode sombre</div></div><div className={'toggle' + (darkMode ? ' on' : '')} onClick={() => handleToggle('dark')} style={{'cursor': 'pointer'}}></div></div>
        <div className="setting-row" style={{'cursor': 'pointer'}} onClick={(e) => {e.preventDefault(); openModal('lang');}}><div className="sr-left"><div className="sr-icon">🗣️</div><div className="sr-label">Langue</div></div><div className="sr-right"><span style={{'cursor': 'pointer'}}>{language === 'fr' ? 'Français' : language === 'en' ? 'English' : 'العربية'}</span><span className="sr-chevron" style={{'cursor': 'pointer'}}>›</span></div></div>
        <div className="setting-row" style={{'color': 'var(--danger)', 'cursor': 'pointer'}} onClick={handleLogout}><div className="sr-left"><div className="sr-icon" style={{'borderColor': 'rgba(255,107,107,.2)'}}>🚪</div><div className="sr-label" style={{'color': 'var(--danger)'}}>Se déconnecter</div></div></div>
      </div>
      <div style={{'textAlign': 'center', 'padding': '.8rem', 'fontSize': '.68rem', 'color': 'var(--dim)'}}>Municip'All v2.2.0 · Données RGPD · Politique de confidentialité</div>

      {/* MODALS */}
      {activeModal === 'identity' && (
        <div className="modal-overlay open" onClick={closeModal}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">✏️ Informations personnelles</div><div className="modal-close" onClick={closeModal}>✕</div></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Prénom</label><input className="form-input" value={userInfo.prenom} onChange={(e) => setUserInfo({...userInfo, prenom: e.target.value})} placeholder="Prénom" /></div>
              <div className="form-group"><label className="form-label">Nom</label><input className="form-input" value={userInfo.nom} onChange={(e) => setUserInfo({...userInfo, nom: e.target.value})} placeholder="Nom" /></div>
            </div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={userInfo.email} onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} placeholder="email@example.fr" /></div>
            <div className="form-group"><label className="form-label">Téléphone</label><input className="form-input" type="tel" value={userInfo.tel} onChange={(e) => setUserInfo({...userInfo, tel: e.target.value})} placeholder="06 XX XX XX XX" /></div>
            <div className="form-group"><label className="form-label">Date de naissance</label><input className="form-input" type="date" value={userInfo.dob} onChange={(e) => setUserInfo({...userInfo, dob: e.target.value})} /></div>
            <div className="save-bar"><button className="btn btn-ghost" style={{'flex': '1'}} onClick={closeModal}>Annuler</button><button className="btn btn-accent" style={{'flex': '2'}} onClick={updateProfile}>💾 Enregistrer</button></div>
          </div>
        </div>
      )}

      {activeModal === 'address' && (
        <div className="modal-overlay open" onClick={closeModal}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">📍 Mon adresse</div><div className="modal-close" onClick={closeModal}>✕</div></div>
            <div className="form-group"><label className="form-label">Adresse</label><input className="form-input" value={address.rue} onChange={(e) => setAddress({...address, rue: e.target.value})} placeholder="Numéro et rue" /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Code postal</label><input className="form-input" value={address.cp} onChange={(e) => setAddress({...address, cp: e.target.value})} placeholder="94800" /></div>
              <div className="form-group"><label className="form-label">Ville</label><input className="form-input" value={address.ville} onChange={(e) => setAddress({...address, ville: e.target.value})} placeholder="Villejuif" /></div>
            </div>
            <div className="form-group"><label className="form-label">Quartier</label>
              <select className="form-input" value={address.quartier} onChange={(e) => setAddress({...address, quartier: e.target.value})} style={{'cursor': 'pointer'}}>
                <option value="paul-hochart">Paul Hochart</option>
                <option value="centre-ville">Centre-Ville</option>
                <option value="rouget-de-lisle">Rouget de Lisle</option>
                <option value="quartiers-sud">Quartiers Sud</option>
                <option value="stade">Stade</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Complément d'adresse</label><input className="form-input" value={address.comp} onChange={(e) => setAddress({...address, comp: e.target.value})} placeholder="Bât, étage, code…" /></div>
            <div className="save-bar"><button className="btn btn-ghost" style={{'flex': '1'}} onClick={closeModal}>Annuler</button><button className="btn btn-accent" style={{'flex': '2'}} onClick={updateProfile}>💾 Enregistrer</button></div>
          </div>
        </div>
      )}

      {activeModal === 'password' && (
        <div className="modal-overlay open" onClick={closeModal}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">🔑 Changer le mot de passe</div><div className="modal-close" onClick={closeModal}>✕</div></div>
            <div className="form-group"><label className="form-label">Mot de passe actuel</label><input className="form-input" type="password" value={pwData.old} onChange={(e) => setPwData({...pwData, old: e.target.value})} placeholder="••••••••" /></div>
            <div className="form-group"><label className="form-label">Nouveau mot de passe</label><input className="form-input" type="password" value={pwData.new} onChange={(e) => setPwData({...pwData, new: e.target.value})} placeholder="••••••••" /></div>
            <div className="form-group"><label className="form-label">Confirmer</label><input className="form-input" type="password" value={pwData.confirm} onChange={(e) => setPwData({...pwData, confirm: e.target.value})} placeholder="••••••••" /></div>
            <div className="save-bar"><button className="btn btn-ghost" style={{'flex': '1'}} onClick={closeModal}>Annuler</button><button className="btn btn-accent" style={{'flex': '2'}} onClick={updatePassword}>💾 Enregistrer</button></div>
          </div>
        </div>
      )}

      {activeModal === 'avatar' && (
        <div className="modal-overlay open" onClick={closeModal}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">🖼️ Photo de profil</div><div className="modal-close" onClick={closeModal}>✕</div></div>
            <div style={{'display': 'grid', 'gridTemplateColumns': 'repeat(5,1fr)', 'gap': '.6rem', 'marginBottom': '1rem'}}>
              <div onClick={() => {setAvatar('MB'); closeModal();}} style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'linear-gradient(135deg,var(--blue),var(--accent))', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontFamily': 'var(--fd)', 'fontWeight': '800', 'fontSize': '.85rem', 'cursor': 'pointer', 'border': '2px solid var(--border-a)'}}>MB</div>
              <div onClick={() => {setAvatar('😊'); closeModal();}} style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>😊</div>
              <div onClick={() => {setAvatar('🦁'); closeModal();}} style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🦁</div>
              <div onClick={() => {setAvatar('🌸'); closeModal();}} style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🌸</div>
              <div onClick={() => {setAvatar('🎯'); closeModal();}} style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🎯</div>
              <div onClick={() => {setAvatar('⚡'); closeModal();}} style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>⚡</div>
              <div onClick={() => {setAvatar('🎨'); closeModal();}} style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🎨</div>
              <div onClick={() => {setAvatar('🏄'); closeModal();}} style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🏄</div>
              <div onClick={() => {setAvatar('🌍'); closeModal();}} style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🌍</div>
              <div onClick={() => {setAvatar('🎸'); closeModal();}} style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🎸</div>
            </div>
            <div className="save-bar"><button className="btn btn-ghost" style={{'flex': '1'}} onClick={closeModal}>Annuler</button></div>
          </div>
        </div>
      )}

      {activeModal === 'lang' && (
        <div className="modal-overlay open" onClick={closeModal}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">🗣️ Langue</div><div className="modal-close" onClick={closeModal}>✕</div></div>
            <div style={{'display': 'flex', 'flexDirection': 'column', 'gap': '.3rem'}}>
              <div onClick={() => {setLanguage('fr'); closeModal();}} style={{'padding': '.75rem 1rem', 'borderRadius': 'var(--rm)', 'background': language === 'fr' ? 'rgba(78,205,196,.1)' : 'var(--surface)', 'border': language === 'fr' ? '1px solid var(--border-a)' : '1px solid var(--border)', 'cursor': 'pointer', 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'fontSize': '.88rem', 'fontFamily': 'var(--fd)', 'fontWeight': language === 'fr' ? '600' : '500', 'color': language === 'fr' ? 'var(--accent)' : 'inherit'}}>🇫🇷 Français {language === 'fr' && <span>✓</span>}</div>
              <div onClick={() => {setLanguage('en'); closeModal();}} style={{'padding': '.75rem 1rem', 'borderRadius': 'var(--rm)', 'background': language === 'en' ? 'rgba(78,205,196,.1)' : 'var(--surface)', 'border': language === 'en' ? '1px solid var(--border-a)' : '1px solid var(--border)', 'cursor': 'pointer', 'fontSize': '.88rem', 'fontFamily': 'var(--fd)', 'fontWeight': language === 'en' ? '600' : '500', 'color': language === 'en' ? 'var(--accent)' : 'inherit'}}>🇬🇧 English {language === 'en' && <span>✓</span>}</div>
              <div onClick={() => {setLanguage('ar'); closeModal();}} style={{'padding': '.75rem 1rem', 'borderRadius': 'var(--rm)', 'background': language === 'ar' ? 'rgba(78,205,196,.1)' : 'var(--surface)', 'border': language === 'ar' ? '1px solid var(--border-a)' : '1px solid var(--border)', 'cursor': 'pointer', 'fontSize': '.88rem', 'fontFamily': 'var(--fd)', 'fontWeight': language === 'ar' ? '600' : '500', 'color': language === 'ar' ? 'var(--accent)' : 'inherit'}}>🇲🇦 العربية {language === 'ar' && <span>✓</span>}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AssosView: React.FC = () => {
  const [, setFilter] = useState<string>('');

  const associations = [
    { name: 'FC Villejuif United', category: 'sport', members: 145, icon: '⚽' },
    { name: 'Villejuif Jazz Society', category: 'culture', members: 87, icon: '🎵' },
    { name: 'Les Amis de la Nature', category: 'environnement', members: 234, icon: '🌿' },
    { name: 'Villejuif Social', category: 'social', members: 156, icon: '🤝' },
    { name: 'Jeunes Talents', category: 'jeunesse', members: 203, icon: '👦' },
    { name: 'Cœur de Villejuif', category: 'sante', members: 98, icon: '❤️' },
    { name: 'Arts & Création', category: 'culture', members: 112, icon: '🎭' },
    { name: 'Club de Badminton', category: 'sport', members: 67, icon: '🏸' },
    { name: 'Villejuif Verte', category: 'environnement', members: 189, icon: '♻️' },
    { name: 'Aide Alimentaire', category: 'social', members: 245, icon: '🍲' },
    { name: 'École de Musique', category: 'jeunesse', members: 178, icon: '🎹' },
    { name: 'Prévention Santé', category: 'sante', members: 64, icon: '🏥' },
  ];

  const handleAssoFilter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const chips = document.querySelectorAll('.asso-filter-row .chip');
    chips.forEach(chip => (chip as HTMLElement).classList.remove('on'));
    (e.currentTarget as HTMLElement).classList.add('on');
    
    const text = e.currentTarget.textContent || '';
    const category = text === 'Toutes' ? '' : text.toLowerCase().replace(/^[^a-z]*/, '');
    setFilter(category);

    const cards = document.querySelectorAll('.asso-card');
    let visible = 0;
    cards.forEach(card => {
      if (!category) {
        (card as HTMLElement).style.display = 'block';
        visible++;
      } else {
        const assoCategory = card.getAttribute('data-category') || '';
        if (assoCategory.includes(category)) {
          (card as HTMLElement).style.display = 'block';
          visible++;
        } else {
          (card as HTMLElement).style.display = 'none';
        }
      }
    });
    
    const count = document.getElementById('assoCount');
    if (count) count.textContent = visible.toString();
  };

  return (
    <div className="view active" id="view-assos">

      <div className="search-wrap"><div className="search"><span className="si">🔍</span><input type="text" placeholder="Rechercher une association…" /><span className="si">🎯</span></div></div>
      <div className="asso-filter-row" id="assoChips">
        <span className="chip on" onClick={handleAssoFilter}>Toutes</span>
        <span className="chip" onClick={handleAssoFilter}>🏆 Sport</span>
        <span className="chip" onClick={handleAssoFilter}>🎭 Culture</span>
        <span className="chip" onClick={handleAssoFilter}>🤝 Social</span>
        <span className="chip" onClick={handleAssoFilter}>🌿 Environnement</span>
        <span className="chip" onClick={handleAssoFilter}>👦 Jeunesse</span>
        <span className="chip" onClick={handleAssoFilter}>❤️ Santé</span>
      </div>
      <div style={{'padding': '0 1rem .5rem', 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center'}}>
        <div style={{'fontFamily': 'var(--fd)', 'fontWeight': '700', 'fontSize': '.82rem'}}><span id="assoCount">{associations.length}</span> associations</div>
        <span className="live">À jour</span>
      </div>
      <div className="asso-grid" id="assoGrid" style={{'display': 'grid', 'gridTemplateColumns': 'repeat(auto-fill, minmax(150px, 1fr))', 'gap': '.8rem', 'padding': '0 1rem 1rem'}}>
        {associations.map((asso, idx) => (
          <div key={idx} className="asso-card" data-category={asso.category} style={{'padding': '.8rem', 'borderRadius': 'var(--rm)', 'background': 'var(--surface)', 'border': '1px solid var(--border)', 'cursor': 'pointer', 'transition': '.2s', 'textAlign': 'center'}}>
            <div style={{'fontSize': '2rem', 'marginBottom': '.4rem'}}>{asso.icon}</div>
            <div style={{'fontFamily': 'var(--fd)', 'fontWeight': '600', 'fontSize': '.8rem', 'marginBottom': '.3rem'}}>{asso.name}</div>
            <div style={{'fontSize': '.7rem', 'color': 'var(--muted)', 'marginBottom': '.3rem'}}>{asso.members} membres</div>
            <button style={{'width': '100%', 'padding': '.4rem', 'borderRadius': '.3rem', 'background': 'var(--accent)', 'color': 'white', 'border': 'none', 'cursor': 'pointer', 'fontSize': '.7rem', 'fontWeight': '600'}}>Voir</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Modals and Bot - return as JSX fragment
export const ModalsAndBot: React.FC = () => {
  return (
    <>
      {/* ══════════ MODALS ══════════ */}

      {/* Identity modal */}
<div className="modal-overlay" id="modal-identity" >
  <div className="modal-sheet">
    <div className="modal-header"><div className="modal-title">✏️ Informations personnelles</div><div className="modal-close" >✕</div></div>
    <div className="form-row">
      <div className="form-group"><label className="form-label">Prénom</label><input className="form-input" id="inp-prenom" value="Marie" placeholder="Prénom" /></div>
      <div className="form-group"><label className="form-label">Nom</label><input className="form-input" id="inp-nom" value="Beaumont" placeholder="Nom" /></div>
    </div>
    <div className="form-group"><label className="form-label">Email</label><input className="form-input" id="inp-email" type="email" value="marie.beaumont@email.fr" placeholder="email@example.fr" /></div>
    <div className="form-group"><label className="form-label">Téléphone</label><input className="form-input" id="inp-tel" type="tel" value="06 12 34 56 78" placeholder="06 XX XX XX XX" /></div>
    <div className="form-group"><label className="form-label">Date de naissance</label><input className="form-input" id="inp-dob" type="date" value="1985-06-14" /></div>
    <div className="save-bar"><button className="btn btn-ghost" style={{'flex': '1'}} >Annuler</button><button className="btn btn-accent" style={{'flex': '2'}} >💾 Enregistrer</button></div>
  </div>
</div>

{/* Address modal */}
<div className="modal-overlay" id="modal-address" >
  <div className="modal-sheet">
    <div className="modal-header"><div className="modal-title">📍 Mon adresse</div><div className="modal-close" >✕</div></div>
    <div className="form-group"><label className="form-label">Adresse</label><input className="form-input" id="inp-rue" value="12 Rue Pasteur" placeholder="Numéro et rue" /></div>
    <div className="form-row">
      <div className="form-group"><label className="form-label">Code postal</label><input className="form-input" id="inp-cp" value="94800" placeholder="94800" /></div>
      <div className="form-group"><label className="form-label">Ville</label><input className="form-input" id="inp-ville" value="Villejuif" placeholder="Villejuif" /></div>
    </div>
    <div className="form-group"><label className="form-label">Quartier</label>
      <select className="form-input" id="inp-quartier" style={{'cursor': 'pointer'}}>
        <option value="paul-hochart" selected>Paul Hochart</option>
        <option value="centre-ville">Centre-Ville</option>
        <option value="rouget-de-lisle">Rouget de Lisle</option>
        <option value="quartiers-sud">Quartiers Sud</option>
        <option value="stade">Stade</option>
      </select>
    </div>
    <div className="form-group"><label className="form-label">Complément d'adresse</label><input className="form-input" id="inp-comp" placeholder="Bât, étage, code…" /></div>
    <div className="save-bar"><button className="btn btn-ghost" style={{'flex': '1'}} >Annuler</button><button className="btn btn-accent" style={{'flex': '2'}} >💾 Enregistrer</button></div>
  </div>
</div>

{/* Password modal */}
<div className="modal-overlay" id="modal-password" >
  <div className="modal-sheet">
    <div className="modal-header"><div className="modal-title">🔑 Changer le mot de passe</div><div className="modal-close" >✕</div></div>
    <div className="form-group"><label className="form-label">Mot de passe actuel</label><input className="form-input" type="password" id="inp-pw-old" placeholder="••••••••" /></div>
    <div className="form-group"><label className="form-label">Nuovo mot de passe</label><input className="form-input" type="password" id="inp-pw-new" placeholder="••••••••" /></div>
    <div id="pw-strength-bar" style={{'height': '3px', 'borderRadius': '3px', 'background': 'var(--border)', 'marginBottom': '.8rem', 'overflow': 'hidden'}}><div id="pw-strength-fill" style={{'height': '100%', 'width': '0%', 'borderRadius': '3px', 'transition': '.3s'}}></div></div>
    <div style={{'fontSize': '.7rem', 'color': 'var(--muted)', 'marginBottom': '.8rem'}} id="pw-strength-label"></div>
    <div className="form-group"><label className="form-label">Confirmer</label><input className="form-input" type="password" id="inp-pw-confirm" placeholder="••••••••" /></div>
    <div className="save-bar"><button className="btn btn-ghost" style={{'flex': '1'}} >Annuler</button><button className="btn btn-accent" style={{'flex': '2'}} >💾 Enregistrer</button></div>
  </div>
</div>

{/* Avatar modal */}
<div className="modal-overlay" id="modal-avatar" >
  <div className="modal-sheet">
    <div className="modal-header"><div className="modal-title">🖼️ Photo de profil</div><div className="modal-close" >✕</div></div>
    <div style={{'display': 'grid', 'gridTemplateColumns': 'repeat(5,1fr)', 'gap': '.6rem', 'marginBottom': '1rem'}}>
      <div  data-init="MB" style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'linear-gradient(135deg,var(--blue),var(--accent))', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontFamily': 'var(--fd)', 'fontWeight': '800', 'fontSize': '.85rem', 'cursor': 'pointer', 'border': '2px solid var(--border-a)'}}>MB</div>
      <div  style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>😊</div>
      <div  style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🦁</div>
      <div  style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🌸</div>
      <div  style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🎯</div>
      <div  style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>⚡</div>
      <div  style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🎨</div>
      <div  style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🏄</div>
      <div  style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🌍</div>
      <div  style={{'width': '48px', 'height': '48px', 'borderRadius': '50%', 'background': 'var(--surface)', 'border': '2px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '1.6rem', 'cursor': 'pointer'}}>🎸</div>
    </div>
    <div className="save-bar"><button className="btn btn-ghost" style={{'flex': '1'}} >Annuler</button><button className="btn btn-accent" style={{'flex': '2'}} >💾 Enregistrer</button></div>
  </div>
</div>

{/* Lang modal */}
<div className="modal-overlay" id="modal-lang" >
  <div className="modal-sheet">
    <div className="modal-header"><div className="modal-title">🗣️ Langue</div><div className="modal-close" >✕</div></div>
    <div style={{'display': 'flex', 'flexDirection': 'column', 'gap': '.3rem'}}>
      <div  style={{'padding': '.75rem 1rem', 'borderRadius': 'var(--rm)', 'background': 'rgba(78,205,196,.1)', 'border': '1px solid var(--border-a)', 'cursor': 'pointer', 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'fontSize': '.88rem', 'fontFamily': 'var(--fd)', 'fontWeight': '600', 'color': 'var(--accent)'}}>🇫🇷 Français <span>✓</span></div>
      <div  style={{'padding': '.75rem 1rem', 'borderRadius': 'var(--rm)', 'background': 'var(--surface)', 'border': '1px solid var(--border)', 'cursor': 'pointer', 'fontSize': '.88rem', 'fontFamily': 'var(--fd)', 'fontWeight': '500'}}>🇬🇧 English</div>
      <div  style={{'padding': '.75rem 1rem', 'borderRadius': 'var(--rm)', 'background': 'var(--surface)', 'border': '1px solid var(--border)', 'cursor': 'pointer', 'fontSize': '.88rem', 'fontFamily': 'var(--fd)', 'fontWeight': '500'}}>🇲🇦 العربية</div>
      <div  style={{'padding': '.75rem 1rem', 'borderRadius': 'var(--rm)', 'background': 'var(--surface)', 'border': '1px solid var(--border)', 'cursor': 'pointer', 'fontSize': '.88rem', 'fontFamily': 'var(--fd)', 'fontWeight': '500'}}>🇪🇸 Español</div>
      <div  style={{'padding': '.75rem 1rem', 'borderRadius': 'var(--rm)', 'background': 'var(--surface)', 'border': '1px solid var(--border)', 'cursor': 'pointer', 'fontSize': '.88rem', 'fontFamily': 'var(--fd)', 'fontWeight': '500'}}>🇵🇹 Português</div>
    </div>
  </div>
</div>

{/* ══════════ MUNIBOT ══════════ */}
<div className="bot-overlay" id="munibot">
  <div className="bot-header">
    <div className="bot-ava">🤖</div>
    <div><div className="bot-name">Muni-Bot</div><div className="bot-desc">Assistant IA · Disponible 24h/24</div></div>
    <button className="bot-close" >✕</button>
  </div>
  <div className="bot-messages" id="botMessages">
    <div className="msg bot"><div className="msg-bubble">Bonjour 👋 Je suis <strong>Muni-Bot</strong>. Comment puis-je vous aider ?</div><div className="msg-time">Maintenant</div></div>
  </div>
  <div className="quick-replies">
    <button className="qr-btn" >🛣️ Signaler</button>
    <button className="qr-btn" >🏛️ Horaires</button>
    <button className="qr-btn" >🚲 Aide vélo</button>
    <button className="qr-btn" >📋 Mes demandes</button>
  </div>
  <div className="bot-input-row">
    <input className="bot-input" id="botInput" placeholder="Votre message…" />
    <button className="bot-send" >➤</button>
  </div>
</div>
    </>
  );
};

