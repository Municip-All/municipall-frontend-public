import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Commune, Quartier } from '../../types';
import { COMMUNES, QUARTIERS_BY_COMMUNE, CP_BY_COMMUNE } from '../../data';
import { Button } from '../../components';
import './AuthScreen.scss';

export const AuthScreen: React.FC = () => {
  const { login, register, setAuthView, authView, showToast } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>(authView);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState('');

  const [reg, setReg] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    dateNaissance: '', rue: '', codePostal: '', ville: '' as Commune | '',
    quartier: '', complementAdresse: '', password: '', confirmPw: '',
  });
  const [regError, setRegError] = useState('');
  const [pwStrength, setPwStrength] = useState({ width: '0%', color: '', label: '' });
  const [submitting, setSubmitting] = useState(false);

  const switchTab = (t: 'login' | 'register') => {
    setTab(t); setAuthView(t); setLoginError(''); setRegError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPw) { setLoginError('Remplissez tous les champs.'); return; }
    setSubmitting(true);
    setLoginError('');
    const ok = await login(loginEmail, loginPw);
    setSubmitting(false);
    if (!ok) setLoginError('Email ou mot de passe incorrect.');
  };

  const updateReg = (field: string, value: string) => {
    setReg(prev => {
      const next = { ...prev, [field]: value };
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
      { width: '20%', color: 'var(--color-danger)', label: 'Trop court' },
      { width: '40%', color: 'var(--color-danger)', label: 'Faible' },
      { width: '60%', color: 'var(--color-warning)', label: 'Moyen' },
      { width: '80%', color: 'var(--color-primary-light)', label: 'Bon' },
      { width: '100%', color: 'var(--color-success)', label: 'Excellent' },
    ];
    setPwStrength(levels[Math.min(score, 4)]);
    updateReg('password', pw);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.prenom || !reg.nom || !reg.email || !reg.telephone || !reg.dateNaissance) {
      setRegError('Remplissez toutes les informations personnelles.'); return;
    }
    if (!reg.rue || !reg.codePostal || !reg.ville || !reg.quartier) {
      setRegError("Remplissez toutes les informations d'adresse."); return;
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
    const newUser: User = {
      prenom: reg.prenom.trim(), nom: reg.nom.trim(),
      email: reg.email.trim(), telephone: reg.telephone.trim(),
      dateNaissance: reg.dateNaissance, rue: reg.rue.trim(),
      codePostal: reg.codePostal.trim(), ville: reg.ville as Commune,
      quartier: reg.quartier as Quartier,
      complementAdresse: reg.complementAdresse.trim() || undefined,
      avatar: `${reg.prenom[0]}${reg.nom[0]}`.toUpperCase(),
    };
    setSubmitting(true);
    setRegError('');
    const ok = await register(newUser, reg.password);
    setSubmitting(false);
    if (!ok) {
      setRegError('Inscription impossible. Vérifiez vos informations ou réessayez plus tard.');
      return;
    }
    showToast('Compte créé avec succès !');
  };

  const quartiers = reg.ville ? QUARTIERS_BY_COMMUNE[reg.ville] ?? [] : [];

  return (
    <div className="auth">
      <div className="auth__left">
        <div className="auth__blobs">
          <div className="auth__blob auth__blob--1" />
          <div className="auth__blob auth__blob--2" />
          <div className="auth__blob auth__blob--3" />
        </div>
        <div className="auth__ghost">Civic</div>
        <div className="auth__left-content">
          <div className="auth__logo">
            <div className="auth__logo-mark">M</div>
            <div>
              <div className="auth__logo-name">Municip<span>'All</span></div>
              <div className="auth__logo-sub">Espace Citoyen</div>
            </div>
          </div>
          <p className="auth__eyebrow">Plateforme Municipale · Val-de-Marne</p>
          <h1 className="auth__headline">
            La <em>démocratie</em> de<br />proximité, enfin<br />numérique.
          </h1>
          <p className="auth__sub">
            Signalez, suivez, participez. Votre commune à portée de main — simplement, efficacement, en toute transparence.
          </p>
        </div>
        <div className="auth__left-bottom">
          <div className="auth__features">
            <div className="auth__feat"><div className="auth__feat-dot" /><span>Signalements voirie, parcs & espaces verts</span></div>
            <div className="auth__feat"><div className="auth__feat-dot" /><span>Suivi en temps réel de vos demandes</span></div>
            <div className="auth__feat"><div className="auth__feat-dot" /><span>Actualités et informations municipales</span></div>
            <div className="auth__feat"><div className="auth__feat-dot" /><span>Données protégées RGPD, hébergées en France</span></div>
          </div>
          <div className="auth__stats">
            <div className="auth__stat"><div className="auth__stat-num">4<span>+</span></div><div className="auth__stat-label">Communes</div></div>
            <div className="auth__stat"><div className="auth__stat-num">2k<span>+</span></div><div className="auth__stat-label">Citoyens</div></div>
            <div className="auth__stat"><div className="auth__stat-num">98<span>%</span></div><div className="auth__stat-label">Satisfaction</div></div>
          </div>
        </div>
      </div>

      <div className="auth__right">
        <div className="auth__form-wrap">
          <div className="auth__mobile-logo">
            <div className="auth__mobile-mark">M</div>
            <div className="auth__mobile-name">Municip<span>'All</span></div>
          </div>

          {tab === 'login' ? (
            <>
              <div className="auth__form-eyebrow">Espace Citoyen</div>
              <h2 className="auth__form-heading">Bon retour <em>parmi nous</em></h2>
              <p className="auth__form-sub">Accédez à vos services municipaux en toute sécurité.</p>
            </>
          ) : (
            <>
              <div className="auth__form-eyebrow">Rejoindre Municip'All</div>
              <h2 className="auth__form-heading">Créer <em>mon compte</em></h2>
              <p className="auth__form-sub">Disponible dans 4 communes participantes du Val-de-Marne.</p>
            </>
          )}

          <div className="auth__tabs">
            <div className={`auth__tab${tab === 'login' ? ' auth__tab--on' : ''}`} onClick={() => switchTab('login')}>Connexion</div>
            <div className={`auth__tab${tab === 'register' ? ' auth__tab--on' : ''}`} onClick={() => switchTab('register')}>Créer un compte</div>
          </div>

          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              {loginError && <div className="auth__error">{loginError}</div>}
              <div className="auth__field">
                <label className="auth__field-label">Adresse email</label>
                <input className="auth__field-input" type="email" placeholder="votre@email.fr" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} autoComplete="email" />
              </div>
              <div className="auth__field">
                <div className="auth__pw-row">
                  <label className="auth__field-label">Mot de passe</label>
                  <span className="auth__link">Mot de passe oublié ?</span>
                </div>
                <input className="auth__field-input" type="password" placeholder="••••••••" value={loginPw} onChange={e => setLoginPw(e.target.value)} autoComplete="current-password" />
              </div>
              <Button type="submit" variant="primary" fullWidth loading={submitting}>Se connecter</Button>
              <div className="auth__switch">
                Pas encore de compte ? <span onClick={() => switchTab('register')}>Créer un compte</span>
              </div>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              {regError && <div className="auth__error">{regError}</div>}
              <div className="auth__section-label">Identité</div>
              <div className="auth__row">
                <div className="auth__field"><label className="auth__field-label">Prénom *</label><input className="auth__field-input" placeholder="Marie" value={reg.prenom} onChange={e => updateReg('prenom', e.target.value)} /></div>
                <div className="auth__field"><label className="auth__field-label">Nom *</label><input className="auth__field-input" placeholder="Dupont" value={reg.nom} onChange={e => updateReg('nom', e.target.value)} /></div>
              </div>
              <div className="auth__field"><label className="auth__field-label">Date de naissance *</label><input className="auth__field-input" type="date" value={reg.dateNaissance} onChange={e => updateReg('dateNaissance', e.target.value)} /></div>
              <div className="auth__section-label">Contact</div>
              <div className="auth__field"><label className="auth__field-label">Adresse email *</label><input className="auth__field-input" type="email" placeholder="votre@email.fr" value={reg.email} onChange={e => updateReg('email', e.target.value)} autoComplete="email" /></div>
              <div className="auth__field"><label className="auth__field-label">Téléphone *</label><input className="auth__field-input" type="tel" placeholder="06 XX XX XX XX" value={reg.telephone} onChange={e => updateReg('telephone', e.target.value)} /></div>
              <div className="auth__section-label">Adresse</div>
              <div className="auth__field">
                <label className="auth__field-label">Commune *</label>
                <select className="auth__field-input" value={reg.ville} onChange={e => updateReg('ville', e.target.value)}>
                  <option value="">Choisir votre commune…</option>
                  {COMMUNES.map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="auth__field"><label className="auth__field-label">Adresse *</label><input className="auth__field-input" placeholder="12 Rue de la Mairie" value={reg.rue} onChange={e => updateReg('rue', e.target.value)} /></div>
              <div className="auth__row">
                <div className="auth__field"><label className="auth__field-label">Code postal</label><input className="auth__field-input" placeholder="94270" value={reg.codePostal} onChange={e => updateReg('codePostal', e.target.value)} readOnly={!!reg.ville} style={{ opacity: reg.ville ? 0.5 : 1 }} /></div>
                <div className="auth__field">
                  <label className="auth__field-label">Quartier *</label>
                  <select className="auth__field-input" value={reg.quartier} onChange={e => updateReg('quartier', e.target.value)} disabled={!reg.ville}>
                    <option value="">Sélectionner…</option>
                    {quartiers.map((q: string) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              </div>
              <div className="auth__field"><label className="auth__field-label">Complément d'adresse</label><input className="auth__field-input" placeholder="Bât, étage, interphone…" value={reg.complementAdresse} onChange={e => updateReg('complementAdresse', e.target.value)} /></div>
              <div className="auth__section-label">Sécurité</div>
              <div className="auth__field">
                <label className="auth__field-label">Mot de passe *</label>
                <input className="auth__field-input" type="password" placeholder="••••••••" value={reg.password} onChange={e => checkPwStrength(e.target.value)} autoComplete="new-password" />
                {reg.password && (
                  <>
                    <div className="auth__pw-bar"><div className="auth__pw-fill" style={{ width: pwStrength.width, background: pwStrength.color }} /></div>
                    <div className="auth__pw-label" style={{ color: pwStrength.color }}>{pwStrength.label}</div>
                  </>
                )}
              </div>
              <div className="auth__field">
                <label className="auth__field-label">Confirmer le mot de passe *</label>
                <input className="auth__field-input" type="password" placeholder="••••••••" value={reg.confirmPw} onChange={e => updateReg('confirmPw', e.target.value)} autoComplete="new-password" />
                {reg.confirmPw && reg.password !== reg.confirmPw && <div className="auth__field-err">Les mots de passe ne correspondent pas</div>}
              </div>
              <div className="auth__rgpd">
                Vos données sont protégées conformément au <strong>RGPD</strong> et uniquement utilisées pour vos services municipaux.
              </div>
              <Button type="submit" variant="primary" fullWidth loading={submitting}>Créer mon compte</Button>
              <div className="auth__switch">
                Déjà un compte ? <span onClick={() => switchTab('login')}>Se connecter</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
