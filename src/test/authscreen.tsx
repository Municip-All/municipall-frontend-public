import React, { useState } from 'react';
import { useApp } from './Appcontext';
import { User, Commune } from '../types';
import { COMMUNES, QUARTIERS_BY_COMMUNE, CP_BY_COMMUNE } from '../data';

export const AuthScreen: React.FC = () => {
  const { login, register, setAuthView, authView, showToast } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>(authView);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register state
  const [reg, setReg] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    dateNaissance: '', rue: '', codePostal: '', ville: '' as Commune | '',
    quartier: '', complementAdresse: '',
    password: '', confirmPw: '',
  });
  const [regError, setRegError] = useState('');
  const [pwStrength, setPwStrength] = useState({ width: '0%', color: '', label: '' });

  const switchTab = (t: 'login' | 'register') => {
    setTab(t); setAuthView(t); setLoginError(''); setRegError('');
  };

  // ── LOGIN ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPw) { setLoginError('Remplissez tous les champs.'); return; }
    const ok = await login(loginEmail, loginPw);
    if (!ok) setLoginError('Email ou mot de passe incorrect.');
  };

  // ── REGISTER ──
  const updateReg = (field: string, value: string) => {
    setReg(prev => {
      const next = { ...prev, [field]: value };
      // Auto-fill CP when commune changes
      if (field === 'ville' && value) {
        next.codePostal = CP_BY_COMMUNE[value] || '';
        next.quartier = '';
      }
      return next;
    });
  };

  const checkPwStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    const levels = [
      { width: '20%', color: 'var(--danger)', label: 'Trop court' },
      { width: '40%', color: 'var(--danger)', label: 'Faible' },
      { width: '60%', color: 'var(--warn)', label: 'Moyen' },
      { width: '80%', color: 'var(--accent)', label: 'Bon' },
      { width: '100%', color: 'var(--success)', label: 'Excellent' },
    ];
    setPwStrength(levels[Math.min(score, 4)]);
    updateReg('password', pw);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!reg.prenom || !reg.nom || !reg.email || !reg.telephone || !reg.dateNaissance) {
      setRegError('Remplissez toutes les informations personnelles.'); return;
    }
    if (!reg.rue || !reg.codePostal || !reg.ville || !reg.quartier) {
      setRegError('Remplissez toutes les informations d\'adresse.'); return;
    }
    if (!reg.password || reg.password.length < 8) {
      setRegError('Mot de passe trop court (min. 8 caractères).'); return;
    }
    if (reg.password !== reg.confirmPw) {
      setRegError('Les mots de passe ne correspondent pas.'); return;
    }
    if (!/\S+@\S+\.\S+/.test(reg.email)) {
      setRegError('Email invalide.'); return;
    }

    const initials = `${reg.prenom[0]}${reg.nom[0]}`.toUpperCase();
    const newUser: any = {
      prenom: reg.prenom.trim(),
      nom: reg.nom.trim(),
      email: reg.email.trim(),
      telephone: reg.telephone.trim(),
      dateNaissance: reg.dateNaissance,
      rue: reg.rue.trim(),
      codePostal: reg.codePostal.trim(),
      ville: reg.ville as Commune,
      quartier: reg.quartier as any,
      complementAdresse: reg.complementAdresse.trim() || undefined,
      avatar: initials,
    };
    await register(newUser, reg.password);
    showToast('✅ Compte créé avec succès !');
  };

  const quartiers = reg.ville ? QUARTIERS_BY_COMMUNE[reg.ville] ?? [] : [];

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-mark">M</div>
          <div>
            <div className="auth-logo-name">Municip<span style={{ color: 'var(--accent)' }}>'All</span></div>
            <div style={{ fontSize: '.7rem', color: 'var(--muted)', fontFamily: 'var(--fd)', fontWeight: 500 }}>Espace Citoyen</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <div className={`auth-tab ${tab === 'login' ? 'on' : ''}`} onClick={() => switchTab('login')}>Connexion</div>
          <div className={`auth-tab ${tab === 'register' ? 'on' : ''}`} onClick={() => switchTab('register')}>Créer un compte</div>
        </div>

        {/* ── LOGIN ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-.02em', marginBottom: '.3rem' }}>Bon retour 👋</div>
            <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginBottom: '1.4rem', lineHeight: 1.5 }}>Connectez-vous pour accéder à vos services municipaux.</div>

            {loginError && <div className="auth-error">⚠️ {loginError}</div>}

            <div className="form-group">
              <label className="form-label">Adresse email</label>
              <input className="form-input" type="email" placeholder="votre@email.fr" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input className="form-input" type="password" placeholder="••••••••" value={loginPw} onChange={e => setLoginPw(e.target.value)} autoComplete="current-password" />
            </div>

            <button type="submit" className="btn btn-accent btn-full" style={{ marginTop: '.5rem' }}>
              Se connecter →
            </button>

            <div style={{ textAlign: 'center', marginTop: '.8rem', fontSize: '.72rem', color: 'var(--dim)' }}>
              <span style={{ color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--fd)', fontWeight: 600 }}>Mot de passe oublié ?</span>
            </div>

            <div className="auth-switch">
              Pas encore de compte ? <span onClick={() => switchTab('register')}>Créer un compte</span>
            </div>

            {/* Demo hint */}
            <div style={{ marginTop: '1rem', padding: '.6rem .9rem', background: 'rgba(78,205,196,.05)', border: '1px solid rgba(78,205,196,.15)', borderRadius: 'var(--rm)', fontSize: '.72rem', color: 'var(--muted)' }}>
              💡 <strong style={{ color: 'var(--accent)' }}>Démo :</strong> marie.beaumont@email.fr / demo1234
            </div>
          </form>
        )}

        {/* ── REGISTER ── */}
        {tab === 'register' && (
          <form onSubmit={handleRegister}>
            <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-.02em', marginBottom: '.3rem' }}>Créer mon espace citoyen</div>
            <div style={{ fontSize: '.8rem', color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.5 }}>Disponible dans 4 communes participantes.</div>

            {regError && <div className="auth-error">⚠️ {regError}</div>}

            {/* Section 1 — Identité */}
            <div className="auth-section-label">👤 Identité</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prénom *</label>
                <input className="form-input" placeholder="Marie" value={reg.prenom} onChange={e => updateReg('prenom', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input className="form-input" placeholder="Dupont" value={reg.nom} onChange={e => updateReg('nom', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Date de naissance *</label>
              <input className="form-input" type="date" value={reg.dateNaissance} onChange={e => updateReg('dateNaissance', e.target.value)} />
            </div>

            {/* Section 2 — Contact */}
            <div className="auth-section-label">📱 Contact</div>
            <div className="form-group">
              <label className="form-label">Adresse email *</label>
              <input className="form-input" type="email" placeholder="votre@email.fr" value={reg.email} onChange={e => updateReg('email', e.target.value)} autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone *</label>
              <input className="form-input" type="tel" placeholder="06 XX XX XX XX" value={reg.telephone} onChange={e => updateReg('telephone', e.target.value)} />
            </div>

            {/* Section 3 — Adresse */}
            <div className="auth-section-label">📍 Adresse</div>
            <div className="form-group">
              <label className="form-label">Commune *</label>
              <select className="form-input" value={reg.ville} onChange={e => updateReg('ville', e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="">Choisir votre commune…</option>
                {COMMUNES.map((c: string) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Adresse *</label>
              <input className="form-input" placeholder="12 Rue de la Mairie" value={reg.rue} onChange={e => updateReg('rue', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Code postal</label>
                <input className="form-input" placeholder="94270" value={reg.codePostal} onChange={e => updateReg('codePostal', e.target.value)} readOnly={!!reg.ville} style={{ opacity: reg.ville ? .6 : 1 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Quartier *</label>
                <select className="form-input" value={reg.quartier} onChange={e => updateReg('quartier', e.target.value)} style={{ cursor: 'pointer' }} disabled={!reg.ville}>
                  <option value="">Sélectionner…</option>
                  {quartiers.map((q: string) => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Complément d'adresse</label>
              <input className="form-input" placeholder="Bât, étage, interphone…" value={reg.complementAdresse} onChange={e => updateReg('complementAdresse', e.target.value)} />
            </div>

            {/* Section 4 — Sécurité */}
            <div className="auth-section-label">🔑 Sécurité</div>
            <div className="form-group">
              <label className="form-label">Mot de passe *</label>
              <input className="form-input" type="password" placeholder="••••••••" value={reg.password}
                onChange={e => checkPwStrength(e.target.value)} autoComplete="new-password" />
              {reg.password && (
                <>
                  <div className="pw-strength-bar">
                    <div className="pw-strength-fill" style={{ width: pwStrength.width, background: pwStrength.color }} />
                  </div>
                  <div className="pw-strength-label" style={{ color: pwStrength.color }}>{pwStrength.label}</div>
                </>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe *</label>
              <input className="form-input" type="password" placeholder="••••••••" value={reg.confirmPw}
                onChange={e => updateReg('confirmPw', e.target.value)} autoComplete="new-password" />
              {reg.confirmPw && reg.password !== reg.confirmPw && (
                <div style={{ fontSize: '.72rem', color: 'var(--danger)', marginTop: '.3rem' }}>⚠️ Les mots de passe ne correspondent pas</div>
              )}
            </div>

            {/* CGU */}
            <div style={{ fontSize: '.73rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '1rem', padding: '.6rem .85rem', background: 'var(--surface)', borderRadius: 'var(--rm)', border: '1px solid var(--border)' }}>
              🔒 Vos données sont protégées conformément au <strong style={{ color: 'var(--white)' }}>RGPD</strong> et ne seront jamais revendues. Elles sont uniquement utilisées pour vous fournir les services municipaux.
            </div>

            <button type="submit" className="btn btn-accent btn-full">
              Créer mon compte →
            </button>

            <div className="auth-switch">
              Déjà un compte ? <span onClick={() => switchTab('login')}>Se connecter</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};