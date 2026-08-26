import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../layout/PageLayout';
import { authService } from '../../services/authService';
import { QUARTIERS_BY_COMMUNE } from '../../data';
import { Commune, Quartier } from '../../types';
import { Badge } from '../../components';
import './ProfileView.scss';

type PrTab = 'infos' | 'adresse' | 'securite';

const COMMUNES: Commune[] = ['Bouffémont','Kremlin-Bicêtre','Creil','Saint-Maur-les-Fossés'];

export const ProfileView: React.FC = () => {
  const { user, logout, signalements, updateUser, showToast } = useApp();
  const [tab, setTab] = useState<PrTab>('infos');
  const [prenom, setPrenom] = useState(user?.prenom ?? '');
  const [nom, setNom] = useState(user?.nom ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [tel, setTel] = useState(user?.telephone ?? '');
  const [dob, setDob] = useState(user?.dateNaissance ?? '');
  const [rue, setRue] = useState(user?.rue ?? '');
  const [cp, setCp] = useState(user?.codePostal ?? '');
  const [compl, setCompl] = useState(user?.complementAdresse ?? '');
  const [ville, setVille] = useState<Commune>(user?.ville ?? 'Kremlin-Bicêtre');
  const [quartier, setQuartier] = useState(user?.quartier ?? '');
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confPw, setConfPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const initials = user ? (user.prenom[0] ?? '') + (user.nom[0] ?? '') : 'XX';
  const enCours = signalements.filter(s => s.statut === 'en-cours').length;
  const resolus = signalements.filter(s => s.statut === 'resolu').length;
  const quartiers = QUARTIERS_BY_COMMUNE[ville] ?? [];

  const rules = [
    { label: '8 caractères minimum', ok: newPw.length >= 8 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(newPw) },
    { label: 'Un chiffre', ok: /\d/.test(newPw) },
    { label: 'Confirmation identique', ok: confPw.length > 0 && newPw === confPw },
  ];
  const pwStrength = rules.filter(r => r.ok).length;
  const strengthColor = ['transparent','var(--color-danger)','#E07B20','#E07B20','var(--color-success)'][pwStrength];
  const strengthLabel = ['','Faible','Moyen','Bon','Fort'][pwStrength];

  const handleSaveInfos = () => { if (!prenom.trim() || !nom.trim() || !email.trim()) return; updateUser({ prenom: prenom.trim(), nom: nom.trim(), email: email.trim(), telephone: tel.trim(), dateNaissance: dob, avatar: (prenom.trim()[0] ?? '') + (nom.trim()[0] ?? '') }); showToast('Informations mises à jour !'); };
  const handleSaveAdresse = () => { if (!rue.trim() || !cp.trim()) return; updateUser({ rue: rue.trim(), codePostal: cp.trim(), complementAdresse: compl.trim(), ville, quartier: quartier as Quartier }); showToast('Adresse mise à jour !'); };
  const handleChangePw = async () => {
    setPwError('');
    if (!curPw) { setPwError('Entrez votre mot de passe actuel.'); return; }
    if (!rules.slice(0,3).every(r=>r.ok)) { setPwError('Le nouveau mot de passe ne respecte pas les critères.'); return; }
    if (newPw !== confPw) { setPwError('Les mots de passe ne correspondent pas.'); return; }
    try { await authService.changePassword(curPw, newPw); setCurPw(''); setNewPw(''); setConfPw(''); showToast('Mot de passe mis à jour !'); } catch { setPwError('Mot de passe actuel incorrect.'); }
  };
  const resetInfos = () => { setPrenom(user?.prenom ?? ''); setNom(user?.nom ?? ''); setEmail(user?.email ?? ''); setTel(user?.telephone ?? ''); setDob(user?.dateNaissance ?? ''); };
  const resetAdresse = () => { setRue(user?.rue ?? ''); setCp(user?.codePostal ?? ''); setCompl(user?.complementAdresse ?? ''); setVille(user?.ville ?? 'Kremlin-Bicêtre'); setQuartier(user?.quartier ?? ''); };

  return (
    <PageLayout active="home">
      <section className="pl-hero">
        <div className="pl-hero-blob pl-hero-b1" style={{ background: 'rgba(59,85,143,.1)' }} />
        <div className="pl-hero-blob pl-hero-b2" style={{ background: 'rgba(83,74,183,.06)' }} />
        <div className="pl-hero-blob pl-hero-b3" style={{ background: 'rgba(157,110,70,.05)' }} />
        <div className="pl-hero-ghost">Profil</div>
        <div className="pl-hero-left">
          <p className="pl-eyebrow">Espace personnel · Compte citoyen</p>
          <h1 className="pl-h1">Mon <em>profil</em>.</h1>
          <p className="pl-sub">Modifiez vos informations, gérez votre adresse et sécurisez votre compte.</p>
        </div>
        <div className="pl-hero-right">
          <div className="pl-hero-stats">
            <div className="pl-stat-block"><div className="pl-stat-num">{signalements.length}</div><div className="pl-stat-label">Signalements</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-primary-light)' }}>{enCours}</div><div className="pl-stat-label">En cours</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-success)' }}>{resolus}</div><div className="pl-stat-label">Résolus</div></div>
          </div>
        </div>
      </section>
      <div className="pl-content">
        <div className="pl-two-col">
          <div>
            <div className="pl-sec-head"><div><p className="pl-sec-label">Paramètres</p><h2 className="pl-sec-title">Mon <em>compte</em>.</h2></div></div>
            <div className="pl-info-card" style={{ overflow: 'hidden' }}>
              <div className="pr-avatar-wrap">
                <div className="pr-avatar">{initials.toUpperCase()}</div>
                <div className="pr-avatar-name">{user?.prenom} {user?.nom}</div>
                <div className="pr-avatar-meta"><span className="pr-avatar-email">{user?.email}</span><span className="pr-verified">✓ Vérifié</span></div>
              </div>
              <div className="pr-tabs">
                {([{ key: 'infos', icon: '👤', label: 'Identité' }, { key: 'adresse', icon: '📍', label: 'Adresse' }, { key: 'securite', icon: '🔒', label: 'Sécurité' }] as Array<{ key: PrTab; icon: string; label: string }>).map(t => (
                  <button key={t.key} className={`pr-tab${tab === t.key ? ' on' : ''}`} onClick={() => setTab(t.key)}><span className="pr-tab-icon">{t.icon}</span>{t.label}</button>
                ))}
              </div>
              {tab === 'infos' && (
                <div className="pr-form-wrap">
                  <p className="pr-section-label">Informations personnelles</p>
                  <div className="pr-form-row"><div className="pl-field"><label className="pl-field-label">Prénom *</label><input className="pl-input" value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Votre prénom" /></div><div className="pl-field"><label className="pl-field-label">Nom *</label><input className="pl-input" value={nom} onChange={e => setNom(e.target.value)} placeholder="Votre nom" /></div></div>
                  <div className="pl-field"><label className="pl-field-label">Adresse e-mail *</label><input className="pl-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemple.fr" /></div>
                  <div className="pr-form-row"><div className="pl-field"><label className="pl-field-label">Téléphone</label><input className="pl-input" type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="06 XX XX XX XX" /></div><div className="pl-field"><label className="pl-field-label">Date de naissance</label><input className="pl-input" type="date" value={dob} onChange={e => setDob(e.target.value)} /></div></div>
                  <div className="pr-btn-row"><button className="pr-save-btn" onClick={handleSaveInfos} disabled={!prenom.trim() || !nom.trim() || !email.trim()}>Enregistrer →</button><button className="pr-cancel-btn" onClick={resetInfos}>Annuler</button></div>
                </div>
              )}
              {tab === 'adresse' && (
                <div className="pr-form-wrap">
                  <p className="pr-section-label">Localisation</p>
                  <div className="pr-form-row"><div className="pl-field"><label className="pl-field-label">Commune *</label><select className="pl-select" value={ville} onChange={e => { setVille(e.target.value as Commune); setQuartier(''); }}>{COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}</select></div><div className="pl-field"><label className="pl-field-label">Quartier</label><select className="pl-select" value={quartier} onChange={e => setQuartier(e.target.value)}><option value="">Choisir…</option>{quartiers.map((q: string) => <option key={q} value={q}>{q}</option>)}</select></div></div>
                  <div className="pl-field"><label className="pl-field-label">Rue *</label><input className="pl-input" value={rue} onChange={e => setRue(e.target.value)} placeholder="12 Rue Victor Hugo" /></div>
                  <div className="pr-form-row"><div className="pl-field"><label className="pl-field-label">Code postal *</label><input className="pl-input" value={cp} onChange={e => setCp(e.target.value)} placeholder="94270" maxLength={5} /></div><div className="pl-field"><label className="pl-field-label">Complément</label><input className="pl-input" value={compl} onChange={e => setCompl(e.target.value)} placeholder="Bât., étage…" /></div></div>
                  <div className="pr-btn-row"><button className="pr-save-btn" onClick={handleSaveAdresse} disabled={!rue.trim() || !cp.trim()}>Enregistrer →</button><button className="pr-cancel-btn" onClick={resetAdresse}>Annuler</button></div>
                </div>
              )}
              {tab === 'securite' && (
                <div className="pr-form-wrap">
                  <p className="pr-section-label">Changer le mot de passe</p>
                  {pwError && <div className="pl-alert danger" style={{ marginBottom: '1rem' }}>{pwError}</div>}
                  <div className="pl-field"><label className="pl-field-label">Mot de passe actuel *</label><div className="pr-input-wrap"><input className="pl-input" type={showCur ? 'text' : 'password'} value={curPw} onChange={e => setCurPw(e.target.value)} placeholder="••••••••" /><button type="button" className="pr-eye" onClick={() => setShowCur(p => !p)}>{showCur ? '🙈' : '👁'}</button></div></div>
                  <div className="pl-field"><label className="pl-field-label">Nouveau mot de passe *</label><div className="pr-input-wrap"><input className="pl-input" type={showNew ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="••••••••" /><button type="button" className="pr-eye" onClick={() => setShowNew(p => !p)}>{showNew ? '🙈' : '👁'}</button></div>
                    {newPw.length > 0 && (<><div className="pr-pw-track"><div className="pr-pw-fill" style={{ width: `${pwStrength * 25}%`, background: strengthColor }} /></div><div className="pr-pw-meta"><span className="pr-pw-hint" style={{ color: strengthColor }}>{strengthLabel}</span><span style={{ fontSize: '.68rem', color: 'var(--color-neutral-400)' }}>{pwStrength}/4 critères</span></div></>)}
                  </div>
                  <div className="pl-field"><label className="pl-field-label">Confirmer *</label><input className="pl-input" type="password" value={confPw} onChange={e => setConfPw(e.target.value)} placeholder="••••••••" /></div>
                  {newPw.length > 0 && <div className="pr-pw-rules">{rules.map(r => (<div key={r.label} className={`pr-pw-rule${r.ok ? ' ok' : ''}`}><span className="pr-pw-rule-dot" />{r.label}</div>))}</div>}
                  <div className="pr-btn-row"><button className="pr-save-btn" onClick={handleChangePw} disabled={!curPw || !newPw || !confPw}>Mettre à jour →</button><button className="pr-cancel-btn" onClick={() => { setCurPw(''); setNewPw(''); setConfPw(''); setPwError(''); }}>Annuler</button></div>
                </div>
              )}
            </div>
          </div>
          <div style={{ paddingTop: '3.25rem' }}>
            <div className="pr-sidebar-card">
              <div className="pr-sidebar-top">
                <div className="pr-sidebar-avatar">{initials.toUpperCase()}</div>
                <div className="pr-sidebar-name">{user?.prenom} {user?.nom}</div>
                <div className="pr-sidebar-city">📍 {user?.ville}{user?.quartier ? ` · ${user.quartier}` : ''}</div>
                <div className="pr-sidebar-badge">★ Citoyen actif</div>
              </div>
              <div className="pr-stats-grid">
                <div className="pr-stat"><div className="pr-stat-accent" style={{ background: 'var(--color-primary-light)' }} /><div className="pr-stat-icon">📋</div><div className="pr-stat-num">{signalements.length}<em>+</em></div><div className="pr-stat-label">Total signalements</div></div>
                <div className="pr-stat"><div className="pr-stat-accent" style={{ background: '#E07B20' }} /><div className="pr-stat-icon">⏳</div><div className="pr-stat-num" style={{ color: '#E07B20' }}>{enCours}</div><div className="pr-stat-label">En cours</div></div>
                <div className="pr-stat"><div className="pr-stat-accent" style={{ background: 'var(--color-success)' }} /><div className="pr-stat-icon">✅</div><div className="pr-stat-num" style={{ color: 'var(--color-success)' }}>{resolus}</div><div className="pr-stat-label">Résolus</div></div>
                <div className="pr-stat"><div className="pr-stat-accent" style={{ background: '#9370DB' }} /><div className="pr-stat-icon">📅</div><div className="pr-stat-num" style={{ color: '#9370DB' }}>3</div><div className="pr-stat-label">Évènements</div></div>
              </div>
              <div className="pr-sidebar-footer">
                <p className="pr-contrib-text">Membre actif depuis 2025. Vos signalements contribuent à améliorer le cadre de vie de toute la commune. Merci pour votre engagement !</p>
                <Badge variant="resolu" style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', marginBottom: '.9rem' }}>✓ Profil vérifié · Membre 2025</Badge>
                <button className="pr-logout" onClick={logout}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
