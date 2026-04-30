import React, { useState } from 'react';
import { useApp } from './Appcontext';
import { SignalementCategory, Signalement } from '../types';

const CATEGORIES: { label: SignalementCategory; icon: string }[] = [
  { label: 'Voirie', icon: '🛣️' },
  { label: 'Éclairage', icon: '💡' },
  { label: 'Propreté', icon: '🗑️' },
  { label: 'Espaces verts', icon: '🌳' },
  { label: 'Stationnement', icon: '🚗' },
  { label: 'Bâtiment', icon: '🏚️' },
  { label: 'Nuisance', icon: '🔊' },
  { label: 'Autre', icon: '➕' },
];

export const SignalementView: React.FC = () => {
  const { showView, addSignalement, user, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [pinPos, setPinPos] = useState({ x: 50, y: 50 });
  const [address, setAddress] = useState(`12 Rue Victor Hugo, ${user?.codePostal || '94800'}`);
  const [category, setCategory] = useState<SignalementCategory | null>(null);
  const [description, setDescription] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [ticketId] = useState(() => `#MA-2026-${Math.floor(Math.random() * 90000) + 10000}`);

  const goStep = (n: number) => setStep(n);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { 
      setPhoto(ev.target?.result as string); 
      setTimeout(() => goStep(2), 600); 
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!category || description.length < 10) return;
    const s: Signalement = {
      id: ticketId, categorie: category, description, adresse: address,
      statut: 'attente', dateCreation: "À l'instant", urgent,
    };
    addSignalement(s);
    goStep(4);
  };

  return (
    <div className="view active" id="view-sig">
      <div className="sig-progress" id="sigProgress">
        <div className={`sp ${step >= 1 ? (step === 1 ? 'active' : 'done') : ''}`} id="sp1"></div>
        <div className={`sp ${step >= 2 ? (step === 2 ? 'active' : 'done') : ''}`} id="sp2"></div>
        <div className={`sp ${step >= 3 ? (step === 3 ? 'active' : 'done') : ''}`} id="sp3"></div>
      </div>

      <div className={`sig-step ${step === 1 ? 'on' : ''}`} id="ss1">
        <div className="sig-h">
          <h2>📸 Ajouter une photo</h2>
          <p>Une photo aide nos agents à mieux comprendre et traiter votre signalement plus vite.</p>
        </div>

        {photo ? (
          <div className="photo-preview" id="photoPreview" style={{display: 'block'}}>
            <img id="photoImg" src={photo} alt="Preview" />
            <button className="photo-preview__remove" onClick={() => setPhoto(null)}>✕</button>
          </div>
        ) : (
          <div className="photo-drop" id="photoDrop" onClick={() => document.getElementById('fileInput')?.click()}>
            <div className="photo-drop__icon">📷</div>
            <div className="photo-drop__label">Appuyez pour ajouter une photo</div>
          </div>
        )}

        <input type="file" id="fileInput" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhoto} />
        
        <div className="photo-btns">
          <div className="photo-btn" onClick={() => document.getElementById('fileInput')?.click()}><div className="photo-btn__icon">📷</div><div className="photo-btn__label">Appareil photo</div></div>
          <div className="photo-btn" onClick={() => document.getElementById('fileInput')?.click()}><div className="photo-btn__icon">🖼️</div><div className="photo-btn__label">Ma galerie</div></div>
        </div>

        <div className="skip-btn" onClick={() => goStep(2)}><span>Ignorer cette étape →</span></div>
      </div>

      <div className={`sig-step ${step === 2 ? 'on' : ''}`} id="ss2">
        <div className="sig-h">
          <h2>📍 Localiser l\'incident</h2>
          <p>Touchez la carte pour préciser l\'emplacement exact du problème.</p>
        </div>
        
        <div className="map-container" id="mapContainer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPinPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
        }}>
          <svg className="map-svg" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="240" fill="#101824"/>
            <rect width="400" height="240" fill="url(#grid)"/>
            <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(255,255,255,.08)" strokeWidth="8"/>
            <line x1="200" y1="0" x2="200" y2="240" stroke="rgba(255,255,255,.08)" strokeWidth="8"/>
            <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,.04)" strokeWidth="4"/>
            <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,.04)" strokeWidth="4"/>
            <line x1="80" y1="0" x2="80" y2="240" stroke="rgba(255,255,255,.04)" strokeWidth="4"/>
            <line x1="320" y1="0" x2="320" y2="240" stroke="rgba(255,255,255,.04)" strokeWidth="4"/>
            <rect x="85" y="65" width="110" height="50" rx="3" fill="rgba(59,85,143,.15)" stroke="rgba(59,85,143,.2)" strokeWidth=".5"/>
            <rect x="205" y="125" width="110" height="50" rx="3" fill="rgba(59,85,143,.1)" stroke="rgba(59,85,143,.15)" strokeWidth=".5"/>
            <text x="140" y="95" fill="rgba(232,232,232,.3)" fontSize="7" textAnchor="middle" fontFamily="sans-serif">Centre-Ville</text>
            <line x1="0" y1="170" x2="400" y2="100" stroke="#3B558F" strokeWidth="2.5" opacity=".6"/>
            <circle cx="80" cy="162" r="5" fill="#3B558F" stroke="rgba(232,232,232,.3)" strokeWidth="1"/>
            <circle cx="200" cy="130" r="5" fill="#3B558F" stroke="rgba(232,232,232,.3)" strokeWidth="1"/>
            <circle cx="320" cy="98" r="5" fill="#3B558F" stroke="rgba(232,232,232,.3)" strokeWidth="1"/>
            <text x="86" y="176" fill="rgba(232,232,232,.4)" fontSize="5.5" fontFamily="sans-serif">{user?.ville || 'Villejuif'} P.G.</text>
          </svg>
          <div className="map-pin" id="mapPin" style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%`, transform: 'translate(-50%,-100%)' }}>📍</div>
          <div className="map-pulse" id="mapPulse" style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}></div>
          <button className="map-recenter" onClick={(e) => { e.stopPropagation(); setPinPos({x:50,y:50}); }}>🎯 Ma position</button>
        </div>
        
        <div className="location-field">
          <span className="lf-icon">📍</span>
          <input 
            type="text" 
            id="locationInput" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Adresse détectée…" 
          />
        </div>
        <button className="btn btn-accent btn-full" onClick={() => goStep(3)}>Valider cette localisation →</button>
      </div>

      <div className={`sig-step ${step === 3 ? 'on' : ''}`} id="ss3">
        <div className="sig-h">
          <h2>📝 Détails du signalement</h2>
          <p>Choisissez une catégorie et décrivez brièvement le problème.</p>
        </div>
        
        <div className="field-label">Catégorie *</div>
        <div className="cat-grid">
          {CATEGORIES.map(c => (
            <div 
              key={c.label} 
              className={`cat-item ${category === c.label ? 'sel' : ''}`} 
              onClick={() => setCategory(c.label)}
            >
              <div className="cat-item__icon">{c.icon}</div>
              <div className="cat-item__label">{c.label}</div>
            </div>
          ))}
        </div>
        
        <div className="field-label" style={{ marginTop: '.5rem' }}>Description *</div>
        <div className="textarea-wrap">
          <textarea 
            id="descInput" 
            placeholder="Ex: Il y a un nid-de-poule important à l\'angle de la rue…" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
          <div className="textarea-tools">
            <span className="char-count" id="charCount">{description.length} / 500</span>
            <button className="mic-btn">🎤 Dicter</button>
          </div>
        </div>
        
        <div className="urgency-row">
          <div>
            <div style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: '.85rem' }}>Signalement urgent ?</div>
            <div style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: '.1rem' }}>Danger immédiat pour les personnes</div>
          </div>
          <div className={`toggle ${urgent ? 'on' : ''}`} id="urgToggle" onClick={() => setUrgent(!urgent)}></div>
        </div>
        
        <button 
          className="btn btn-accent btn-full" id="sendBtn" 
          onClick={submit} 
          disabled={!category || description.length < 10}
        >
          Envoyer le signalement
        </button>
      </div>

      <div className={`sig-step ${step === 4 ? 'on' : ''}`} id="ss4">
        <div className="success-screen confetti-wrap" id="successScreen">
          <div className="success-anim">✅</div>
          <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-.02em', marginBottom: '.4rem' }}>
            Signalement enregistré !
          </h2>
          <p style={{ fontSize: '.83rem', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 300, margin: '0 auto 1.2rem' }}>
            Notre IA analyse votre demande et va la rediriger vers le service compétent sous quelques minutes.
          </p>
          
          <div className="ticket-card">
            <div className="ticket-row"><span>Numéro</span><span style={{ color: 'var(--accent)' }}>{ticketId}</span></div>
            <div className="ticket-row"><span>Catégorie</span><span id="successCat">{category || '—'}</span></div>
            <div className="ticket-row"><span>Localisation</span><span style={{ fontSize: '.75rem' }}>{user?.codePostal || '94800'}, {user?.ville || 'Villejuif'}</span></div>
            <div className="ticket-row"><span>Statut</span><span className="status status-wait">En attente</span></div>
            <div className="ticket-row"><span>Délai estimé</span><span>3 à 5 jours ouvrés</span></div>
          </div>
          
          <button className="btn btn-primary btn-full" onClick={() => showView('demandes')} style={{ marginBottom: '.6rem' }}>
            Suivre mon signalement →
          </button>
          <button className="btn btn-ghost btn-full" onClick={() => { setStep(1); setDescription(''); setCategory(null); setPhoto(null); setUrgent(false); }}>
            Faire un autre signalement
          </button>
        </div>
      </div>
    </div>
  );
};
