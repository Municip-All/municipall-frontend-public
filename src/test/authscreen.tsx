import React, { useState, useEffect } from 'react';
import { useApp } from './Appcontext';
import { User, Commune } from '../types';
import { COMMUNES, QUARTIERS_BY_COMMUNE, CP_BY_COMMUNE } from '../data';

/* ─────────────────────────────────────────────────────────────────
   INLINE CSS — light mode, editorial split-screen
   Même DA que PresentationView : Playfair Display + Inter,
   tokens #FAFAF8 / #F4F2ED / #0F0F0E / #3B558F
───────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');

/* ── Keyframes ─────────────────────────────────── */
@keyframes au-left-in {
  from { opacity: 0; transform: translateX(-36px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes au-right-in {
  from { opacity: 0; transform: translateX(36px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes au-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes au-blob-1 {
  0%,100% { transform: translate(0,0) scale(1); }
  50%     { transform: translate(28px,-20px) scale(1.04); }
}
@keyframes au-blob-2 {
  0%,100% { transform: translate(0,0) scale(1); }
  50%     { transform: translate(-22px,24px) scale(.96); }
}
@keyframes au-blob-3 {
  0%,100% { transform: translate(0,0) scale(1); }
  60%     { transform: translate(14px,22px) scale(1.03); }
}
@keyframes au-shimmer {
  from { background-position: -400px 0; }
  to   { background-position: 400px 0; }
}

/* ── Root ──────────────────────────────────────── */
.au {
  position: fixed; inset: 0;
  display: flex;
  font-family: 'Inter', sans-serif;
  background: #FAFAF8;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ══════════════════════════════════════════════════
   LEFT PANEL
══════════════════════════════════════════════════ */
.au-left {
  flex: 0 0 56%;
  position: relative; overflow: hidden;
  background: #F4F2ED;
  border-right: 1px solid rgba(15,15,14,.1);
  display: flex; flex-direction: column;
  justify-content: space-between;
  padding: 3rem 3.5rem;
  animation: au-left-in .95s cubic-bezier(.22,1,.36,1) .05s both;
}

/* Watercolor blobs */
.au-blobs {
  position: absolute; inset: 0;
  pointer-events: none; overflow: hidden;
}
.au-blob {
  position: absolute; border-radius: 50%;
  filter: blur(72px);
}
.au-blob-1 {
  width: 460px; height: 380px; top: -110px; right: -90px;
  background: rgba(59,85,143,.09);
  animation: au-blob-1 16s ease-in-out infinite;
}
.au-blob-2 {
  width: 340px; height: 290px; bottom: 40px; left: -70px;
  background: rgba(123,143,204,.07);
  animation: au-blob-2 20s ease-in-out 3s infinite;
}
.au-blob-3 {
  width: 260px; height: 220px; top: 36%; right: 6%;
  background: rgba(157,110,70,.055);
  animation: au-blob-3 24s ease-in-out 1s infinite;
}

/* Ghost background text */
.au-ghost {
  position: absolute; bottom: -1.5rem; right: -2rem;
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: clamp(120px, 16vw, 210px); line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(59,85,143,.06);
  white-space: nowrap; pointer-events: none; user-select: none;
  letter-spacing: -8px;
}

/* ── Logo ── */
.au-left-top { position: relative; z-index: 1; }

.au-logo {
  display: flex; align-items: center; gap: .8rem;
  margin-bottom: 3.75rem;
  animation: au-up .85s cubic-bezier(.22,1,.36,1) .25s both;
}
.au-logo-mark {
  width: 42px; height: 42px; border-radius: 10px;
  background: linear-gradient(135deg, #1A3A8F 0%, #7B8FCC 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1.25rem;
  color: #fff; letter-spacing: -.5px; flex-shrink: 0;
  box-shadow: 0 4px 18px rgba(26,58,143,.22);
}
.au-logo-name {
  font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1.15rem;
  color: #0F0F0E; letter-spacing: -.3px; line-height: 1;
}
.au-logo-name span { color: #3B558F; }
.au-logo-sub {
  font-size: .64rem; font-weight: 500; letter-spacing: .12em;
  text-transform: uppercase; color: rgba(15,15,14,.3); margin-top: .22rem;
}

/* ── Headline block ── */
.au-eyebrow {
  font-size: .74rem; font-weight: 600; letter-spacing: .14em;
  text-transform: uppercase; color: #3B558F;
  margin-bottom: 1.1rem;
  animation: au-up .85s cubic-bezier(.22,1,.36,1) .42s both;
}
.au-headline {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: clamp(2rem, 3vw, 3.1rem); line-height: 1.08;
  letter-spacing: -1.5px; color: #0F0F0E; max-width: 510px;
  animation: au-up .9s cubic-bezier(.22,1,.36,1) .52s both;
}
.au-headline em { font-style: italic; color: #3B558F; }

.au-sub {
  margin-top: 1.2rem; font-size: .975rem; color: rgba(15,15,14,.6);
  max-width: 400px; line-height: 1.72;
  animation: au-up .9s cubic-bezier(.22,1,.36,1) .66s both;
}

/* ── Left bottom ── */
.au-left-bottom { position: relative; z-index: 1; }

.au-features {
  display: flex; flex-direction: column; gap: .58rem;
  margin-bottom: 2.4rem;
  animation: au-up .9s cubic-bezier(.22,1,.36,1) .82s both;
}
.au-feat {
  display: flex; align-items: center; gap: .7rem;
  font-size: .875rem; color: rgba(15,15,14,.6);
}
.au-feat-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #3B558F; flex-shrink: 0;
}

/* Stats row */
.au-stats {
  display: flex; gap: 0;
  border-top: 1px solid rgba(15,15,14,.1);
  animation: au-up .9s cubic-bezier(.22,1,.36,1) .98s both;
}
.au-stat {
  padding: 1.3rem 0;
  padding-right: 2.25rem; margin-right: 2.25rem;
  border-right: 1px solid rgba(15,15,14,.1);
}
.au-stat:last-child { border-right: none; margin-right: 0; }
.au-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 2.1rem; font-weight: 800; letter-spacing: -1.5px;
  color: #0F0F0E; line-height: 1;
}
.au-stat-num span { color: #3B558F; }
.au-stat-label {
  font-size: .67rem; color: rgba(15,15,14,.3); margin-top: .32rem;
  text-transform: uppercase; letter-spacing: .09em; font-weight: 500;
}

/* Scroll line (decoration) */
.au-scroll-line {
  position: absolute; top: 0; left: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom,
    transparent 0%,
    rgba(59,85,143,.15) 30%,
    rgba(59,85,143,.15) 70%,
    transparent 100%
  );
  pointer-events: none;
}

/* ══════════════════════════════════════════════════
   RIGHT PANEL
══════════════════════════════════════════════════ */
.au-right {
  flex: 1; overflow-y: auto; scrollbar-width: none;
  display: flex; flex-direction: column;
  align-items: center;
  padding: 2rem 2.5rem;
  background: #FAFAF8;
  animation: au-right-in .95s cubic-bezier(.22,1,.36,1) .1s both;
  min-height: 0;
}
.au-right::-webkit-scrollbar { display: none; }

.au-form-wrap {
  width: 100%; max-width: 410px;
  margin-top: auto; margin-bottom: auto;
  padding: 2rem 0;
}

/* Mobile logo (hidden on desktop) */
.au-mobile-logo {
  display: none; align-items: center; gap: .65rem;
  margin-bottom: 2.5rem;
}
.au-mobile-mark {
  width: 36px; height: 36px; border-radius: 8px;
  background: linear-gradient(135deg, #1A3A8F, #7B8FCC);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1rem;
  color: #fff;
}
.au-mobile-name {
  font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1.1rem;
  color: #0F0F0E;
}
.au-mobile-name span { color: #3B558F; }

/* Form heading */
.au-form-eyebrow {
  font-size: .7rem; font-weight: 600; letter-spacing: .14em;
  text-transform: uppercase; color: rgba(15,15,14,.3);
  margin-bottom: .6rem;
  animation: au-up .75s cubic-bezier(.22,1,.36,1) .38s both;
}
.au-form-heading {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 2rem; letter-spacing: -1px; color: #0F0F0E; line-height: 1.15;
  margin-bottom: .45rem;
  animation: au-up .75s cubic-bezier(.22,1,.36,1) .48s both;
}
.au-form-heading em { font-style: italic; color: #3B558F; }
.au-form-sub {
  font-size: .875rem; color: rgba(15,15,14,.55); line-height: 1.6;
  margin-bottom: 1.85rem;
  animation: au-up .75s cubic-bezier(.22,1,.36,1) .58s both;
}

/* ── Tabs ── */
.au-tabs {
  display: flex; border-bottom: 1px solid rgba(15,15,14,.1);
  margin-bottom: 2rem;
  animation: au-up .75s cubic-bezier(.22,1,.36,1) .64s both;
}
.au-tab {
  flex: 1; text-align: center;
  padding: .68rem .5rem;
  font-size: .84rem; font-weight: 500;
  color: rgba(15,15,14,.3);
  cursor: pointer; position: relative;
  transition: color .28s;
  user-select: none; letter-spacing: .01em;
}
.au-tab.on { color: #0F0F0E; }
.au-tab::after {
  content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
  height: 2px; background: #0F0F0E;
  transform: scaleX(0); transform-origin: center;
  transition: transform .38s cubic-bezier(.22,1,.36,1);
}
.au-tab.on::after { transform: scaleX(1); }

/* ── Form fields ── */
.form-group { margin-bottom: 1rem; }
.form-row   { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; }

.form-label {
  display: block; font-size: .7rem; font-weight: 500;
  letter-spacing: .07em; text-transform: uppercase;
  color: rgba(15,15,14,.35); margin-bottom: .4rem;
}

.form-input {
  width: 100%; padding: .75rem .95rem;
  background: #FAFAF8;
  border: 1px solid rgba(15,15,14,.14);
  border-radius: 4px;
  font-size: .9rem; font-family: 'Inter', sans-serif;
  color: #0F0F0E;
  outline: none;
  transition: border-color .22s, box-shadow .22s, background .22s;
  appearance: none; box-sizing: border-box;
}
.form-input::placeholder { color: rgba(15,15,14,.28); }
.form-input:focus {
  border-color: rgba(15,15,14,.5);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(15,15,14,.05);
}
.form-input option { background: #fff; color: #0F0F0E; }
.form-input:disabled { opacity: .4; cursor: not-allowed; }

/* Section labels */
.au-section-label {
  font-size: .66rem; font-weight: 600; letter-spacing: .13em;
  text-transform: uppercase; color: rgba(15,15,14,.28);
  margin: 1.6rem 0 .85rem;
  display: flex; align-items: center; gap: .5rem;
}
.au-section-label::after {
  content: ''; flex: 1; height: 1px; background: rgba(15,15,14,.1);
}

/* Error */
.au-error {
  padding: .65rem .9rem; border-radius: 4px;
  border: 1px solid rgba(198,40,40,.2);
  background: rgba(198,40,40,.04);
  font-size: .8rem; color: rgba(175,30,30,.9);
  line-height: 1.55; margin-bottom: 1rem;
}

/* Password strength */
.pw-strength-bar {
  height: 2px; background: rgba(15,15,14,.08);
  border-radius: 1px; margin-top: .42rem; overflow: hidden;
}
.pw-strength-fill {
  height: 100%; border-radius: 1px;
  transition: width .5s cubic-bezier(.25,.46,.45,.94), background .3s;
}
.pw-strength-label {
  font-size: .67rem; font-weight: 600; letter-spacing: .04em;
  margin-top: .24rem; transition: color .3s;
}

/* ── CTA button ── */
.btn-auth {
  width: 100%; padding: .92rem 1.5rem;
  background: #0F0F0E;
  border: 1px solid #0F0F0E; border-radius: 2rem;
  font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 500;
  color: #FAFAF8; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: .5rem;
  transition: background .25s, border-color .25s,
              transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s;
  margin-top: .8rem; letter-spacing: .02em;
}
.btn-auth:hover {
  background: #1A3A8F; border-color: #1A3A8F;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(26,58,143,.22);
}
.btn-auth:hover .btn-arrow { transform: translateX(5px); }
.btn-auth:active { transform: translateY(0); }
.btn-arrow { transition: transform .22s cubic-bezier(.22,1,.36,1); display: inline-block; }

/* Links */
.au-link {
  font-size: .78rem; color: rgba(15,15,14,.35);
  cursor: pointer; transition: color .2s; font-weight: 500;
}
.au-link:hover { color: #0F0F0E; }

.au-switch {
  text-align: center; margin-top: 1.35rem;
  font-size: .8rem; color: rgba(15,15,14,.35);
}
.au-switch span {
  color: #0F0F0E; cursor: pointer; font-weight: 600;
  text-decoration: underline; text-underline-offset: 3px;
  transition: color .2s;
}
.au-switch span:hover { color: #3B558F; }

/* Demo hint */
.au-demo {
  margin-top: 1.3rem; padding: .68rem .9rem;
  background: rgba(59,85,143,.04);
  border: 1px solid rgba(59,85,143,.12);
  border-radius: 4px; font-size: .75rem;
  color: rgba(15,15,14,.55); line-height: 1.65;
}
.au-demo strong { color: #3B558F; }

/* RGPD */
.au-rgpd {
  padding: .62rem .9rem; margin-bottom: .75rem;
  background: rgba(24,109,16,.04);
  border: 1px solid rgba(24,109,16,.14);
  border-radius: 4px; font-size: .75rem;
  color: rgba(15,15,14,.55); line-height: 1.65;
}
.au-rgpd strong { color: #186D10; }

/* Inline field error */
.field-err {
  font-size: .71rem; color: rgba(198,40,40,.8);
  margin-top: .26rem; font-weight: 500;
}

/* Divider with forgotten-pw row */
.au-pw-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: .35rem;
}

/* ── Responsive ──────────────────────────────── */
@media (max-width: 820px) {
  .au-left { display: none; }
  .au-mobile-logo { display: flex; }
  .au-right {
    justify-content: flex-start;
    padding: 3rem 2rem;
  }
}
@media (max-width: 480px) {
  .au-right { padding: 2rem 1.25rem; }
  .form-row  { grid-template-columns: 1fr; }
}
`;

export const AuthScreen: React.FC = () => {
  const { login, register, setAuthView, authView, showToast } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>(authView);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw,    setLoginPw]    = useState('');
  const [loginError, setLoginError] = useState('');

  // Register
  const [reg, setReg] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    dateNaissance: '', rue: '', codePostal: '', ville: '' as Commune | '',
    quartier: '', complementAdresse: '', password: '', confirmPw: '',
  });
  const [regError,   setRegError]   = useState('');
  const [pwStrength, setPwStrength] = useState({ width: '0%', color: '', label: '' });

  // Inject CSS once
  useEffect(() => {
    const id = 'municipall-auth-v2-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = css;
      document.head.appendChild(s);
    }
  }, []);

  const switchTab = (t: 'login' | 'register') => {
    setTab(t); setAuthView(t); setLoginError(''); setRegError('');
  };

  // ── LOGIN ──
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPw) { setLoginError('Remplissez tous les champs.'); return; }
    setSubmitting(true);
    setLoginError('');
    const ok = await login(loginEmail, loginPw);
    setSubmitting(false);
    if (!ok) setLoginError('Email ou mot de passe incorrect.\nDémo : @demo.municipall.dev / Demo2026!');
  };

  // ── REGISTER ──
  const updateReg = (field: string, value: string) => {
    setReg(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'ville' && value) {
        next.codePostal = CP_BY_COMMUNE[value] || '';
        next.quartier   = '';
      }
      return next;
    });
  };

  const checkPwStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8)           score++;
    if (pw.length >= 12)          score++;
    if (/[A-Z]/.test(pw))         score++;
    if (/[0-9]/.test(pw))         score++;
    if (/[^a-zA-Z0-9]/.test(pw))  score++;
    const levels = [
      { width: '20%', color: '#C62828', label: 'Trop court' },
      { width: '40%', color: '#C62828', label: 'Faible' },
      { width: '60%', color: '#9D6E46', label: 'Moyen' },
      { width: '80%', color: '#3B558F', label: 'Bon' },
      { width: '100%', color: '#186D10', label: 'Excellent' },
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
      quartier: reg.quartier as any,
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
    <div className="au">

      {/* ══════════ LEFT PANEL ══════════ */}
      <div className="au-left">
        {/* Animated blobs */}
        <div className="au-blobs">
          <div className="au-blob au-blob-1" />
          <div className="au-blob au-blob-2" />
          <div className="au-blob au-blob-3" />
        </div>

        {/* Ghost background letter */}
        <div className="au-ghost">Civic</div>

        {/* Left edge decoration */}
        <div className="au-scroll-line" />

        {/* ── Top: Logo + Headline ── */}
        <div className="au-left-top">
          <div className="au-logo">
            <div className="au-logo-mark">M</div>
            <div>
              <div className="au-logo-name">
                Municip<span>'All</span>
              </div>
              <div className="au-logo-sub">Espace Citoyen</div>
            </div>
          </div>

          <div className="au-eyebrow">Plateforme Municipale · Val-de-Marne</div>

          <h1 className="au-headline">
            La <em>démocratie</em> de<br />
            proximité, enfin<br />
            numérique.
          </h1>

          <p className="au-sub">
            Signalez, suivez, participez. Votre commune à portée de main — simplement, efficacement, en toute transparence.
          </p>
        </div>

        {/* ── Bottom: Features + Stats ── */}
        <div className="au-left-bottom">
          <div className="au-features">
            <div className="au-feat">
              <div className="au-feat-dot" />
              <span>Signalements voirie, parcs &amp; espaces verts</span>
            </div>
            <div className="au-feat">
              <div className="au-feat-dot" />
              <span>Suivi en temps réel de vos demandes</span>
            </div>
            <div className="au-feat">
              <div className="au-feat-dot" />
              <span>Actualités et informations municipales</span>
            </div>
            <div className="au-feat">
              <div className="au-feat-dot" />
              <span>Données protégées RGPD, hébergées en France</span>
            </div>
          </div>

          <div className="au-stats">
            <div className="au-stat">
              <div className="au-stat-num">4<span>+</span></div>
              <div className="au-stat-label">Communes</div>
            </div>
            <div className="au-stat">
              <div className="au-stat-num">2k<span>+</span></div>
              <div className="au-stat-label">Citoyens</div>
            </div>
            <div className="au-stat">
              <div className="au-stat-num">98<span>%</span></div>
              <div className="au-stat-label">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT PANEL ══════════ */}
      <div className="au-right">
        <div className="au-form-wrap">

          {/* Mobile-only logo */}
          <div className="au-mobile-logo">
            <div className="au-mobile-mark">M</div>
            <div className="au-mobile-name">
              Municip<span>'All</span>
            </div>
          </div>

          {/* Dynamic heading based on active tab */}
          {tab === 'login' ? (
            <>
              <div className="au-form-eyebrow">Espace Citoyen</div>
              <h2 className="au-form-heading">
                Bon retour <em>parmi nous</em>
              </h2>
              <p className="au-form-sub">
                Accédez à vos services municipaux en toute sécurité.
              </p>
            </>
          ) : (
            <>
              <div className="au-form-eyebrow">Rejoindre Municip'All</div>
              <h2 className="au-form-heading">
                Créer <em>mon compte</em>
              </h2>
              <p className="au-form-sub">
                Disponible dans 4 communes participantes du Val-de-Marne.
              </p>
            </>
          )}

          {/* ── Tabs ── */}
          <div className="au-tabs">
            <div
              className={`au-tab${tab === 'login' ? ' on' : ''}`}
              onClick={() => switchTab('login')}
            >
              Connexion
            </div>
            <div
              className={`au-tab${tab === 'register' ? ' on' : ''}`}
              onClick={() => switchTab('register')}
            >
              Créer un compte
            </div>
          </div>

          {/* ───────── LOGIN ───────── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              {loginError && (
                <div className="au-error">{loginError}</div>
              )}

              <div className="form-group">
                <label className="form-label">Adresse email</label>
                <input
                  className="form-input" type="email"
                  placeholder="votre@email.fr"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <div className="au-pw-row">
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Mot de passe
                  </label>
                  <span className="au-link">Mot de passe oublié ?</span>
                </div>
                <input
                  className="form-input" type="password"
                  placeholder="••••••••"
                  value={loginPw}
                  onChange={e => setLoginPw(e.target.value)}
                  autoComplete="current-password"
                  style={{ marginTop: '.4rem' }}
                />
              </div>

              <button type="submit" className="btn-auth" disabled={submitting}>
                Se connecter
                <span className="btn-arrow">→</span>
              </button>

              <div className="au-switch">
                Pas encore de compte ?{' '}
                <span onClick={() => switchTab('register')}>
                  Créer un compte
                </span>
              </div>

              <div className="au-demo">
                <strong>Démo :</strong> marie.beaumont@email.fr &nbsp;/&nbsp; demo1234
              </div>
            </form>
          )}

          {/* ───────── REGISTER ───────── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              {regError && (
                <div className="au-error">{regError}</div>
              )}

              {/* Identité */}
              <div className="au-section-label">Identité</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prénom *</label>
                  <input className="form-input" placeholder="Marie"
                    value={reg.prenom}
                    onChange={e => updateReg('prenom', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nom *</label>
                  <input className="form-input" placeholder="Dupont"
                    value={reg.nom}
                    onChange={e => updateReg('nom', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Date de naissance *</label>
                <input className="form-input" type="date"
                  value={reg.dateNaissance}
                  onChange={e => updateReg('dateNaissance', e.target.value)} />
              </div>

              {/* Contact */}
              <div className="au-section-label">Contact</div>
              <div className="form-group">
                <label className="form-label">Adresse email *</label>
                <input className="form-input" type="email"
                  placeholder="votre@email.fr"
                  value={reg.email}
                  onChange={e => updateReg('email', e.target.value)}
                  autoComplete="email" />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone *</label>
                <input className="form-input" type="tel"
                  placeholder="06 XX XX XX XX"
                  value={reg.telephone}
                  onChange={e => updateReg('telephone', e.target.value)} />
              </div>

              {/* Adresse */}
              <div className="au-section-label">Adresse</div>
              <div className="form-group">
                <label className="form-label">Commune *</label>
                <select className="form-input" value={reg.ville}
                  onChange={e => updateReg('ville', e.target.value)}>
                  <option value="">Choisir votre commune…</option>
                  {COMMUNES.map((c: string) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Adresse *</label>
                <input className="form-input" placeholder="12 Rue de la Mairie"
                  value={reg.rue}
                  onChange={e => updateReg('rue', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Code postal</label>
                  <input className="form-input" placeholder="94270"
                    value={reg.codePostal}
                    onChange={e => updateReg('codePostal', e.target.value)}
                    readOnly={!!reg.ville}
                    style={{ opacity: reg.ville ? .5 : 1 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Quartier *</label>
                  <select className="form-input" value={reg.quartier}
                    onChange={e => updateReg('quartier', e.target.value)}
                    disabled={!reg.ville}>
                    <option value="">Sélectionner…</option>
                    {quartiers.map((q: string) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Complément d'adresse</label>
                <input className="form-input" placeholder="Bât, étage, interphone…"
                  value={reg.complementAdresse}
                  onChange={e => updateReg('complementAdresse', e.target.value)} />
              </div>

              {/* Sécurité */}
              <div className="au-section-label">Sécurité</div>
              <div className="form-group">
                <label className="form-label">Mot de passe *</label>
                <input className="form-input" type="password"
                  placeholder="••••••••"
                  value={reg.password}
                  onChange={e => checkPwStrength(e.target.value)}
                  autoComplete="new-password" />
                {reg.password && (
                  <>
                    <div className="pw-strength-bar">
                      <div className="pw-strength-fill"
                        style={{ width: pwStrength.width, background: pwStrength.color }} />
                    </div>
                    <div className="pw-strength-label"
                      style={{ color: pwStrength.color }}>
                      {pwStrength.label}
                    </div>
                  </>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Confirmer le mot de passe *</label>
                <input className="form-input" type="password"
                  placeholder="••••••••"
                  value={reg.confirmPw}
                  onChange={e => updateReg('confirmPw', e.target.value)}
                  autoComplete="new-password" />
                {reg.confirmPw && reg.password !== reg.confirmPw && (
                  <div className="field-err">Les mots de passe ne correspondent pas</div>
                )}
              </div>

              <div className="au-rgpd">
                Vos données sont protégées conformément au <strong>RGPD</strong> et
                uniquement utilisées pour vos services municipaux.
              </div>

              <button type="submit" className="btn-auth" disabled={submitting}>
                Créer mon compte
                <span className="btn-arrow">→</span>
              </button>

              <div className="au-switch">
                Déjà un compte ?{' '}
                <span onClick={() => switchTab('login')}>Se connecter</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
