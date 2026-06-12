import React, { useEffect, useState } from 'react';
import { useApp } from './Appcontext';
import { TopNav } from './layout';
import { EVENEMENTS, ASSOS, QUARTIERS_BY_COMMUNE } from '../data';
import { Commune, Quartier } from '../types';

/* ═══════════════════════════════════════════
   CSS INJECTION HELPER
═══════════════════════════════════════════ */
function injectCss(id: string, css: string) {
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id; s.textContent = css;
    document.head.appendChild(s);
  }
}

/* ═══════════════════════════════════════════
   ÉVÈNEMENTS VIEW
═══════════════════════════════════════════ */
const evCss = `
.ev-grid { display: flex; flex-direction: column; gap: .8rem; }
.ev-row {
  display: flex; gap: 1.4rem; align-items: stretch;
  animation: ma-up .6s cubic-bezier(.22,1,.36,1) both;
}
.ev-date-col {
  width: 68px; flex-shrink: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: .1rem;
  border-radius: 12px; padding: .85rem .4rem;
}
.ev-date-day { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1.75rem; line-height: 1; }
.ev-date-mois { font-size: .65rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; opacity: .65; margin-top: .1rem; }
.ev-card-inner { flex: 1; }
.ev-tag {
  display: inline-block; font-size: .6rem; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; padding: .25rem .7rem; border-radius: 1rem;
  margin-bottom: .45rem;
}
.ev-title { font-size: 1rem; font-weight: 700; color: #0F0F0E; margin-bottom: .3rem; line-height: 1.3; }
.ev-meta { font-size: .78rem; color: rgba(15,15,14,.38); display: flex; gap: .9rem; flex-wrap: wrap; }
.ev-meta span { display: flex; align-items: center; gap: .3rem; }
.ev-desc { font-size: .78rem; color: rgba(15,15,14,.4); margin-top: .4rem; }
.ev-accent-strip { width: 3px; border-radius: 2px; flex-shrink: 0; align-self: stretch; }
`;

const TAG_STYLE: Record<string, { bg: string; color: string }> = {
  culture:  { bg: 'rgba(147,112,219,.12)', color: '#7B58B0' },
  marche:   { bg: 'rgba(224,123,32,.12)',  color: '#B96A12' },
  sport:    { bg: 'rgba(24,109,16,.12)',   color: '#186D10' },
  info:     { bg: 'rgba(59,85,143,.12)',   color: '#3B558F' },
  social:   { bg: 'rgba(255,180,80,.15)',  color: '#B87B00' },
};

export const EvenementView: React.FC = () => {
  useEffect(() => injectCss('municipall-ev-css', evCss), []);
  const { showView } = useApp();

  return (
    <div className="ma-root">
      <TopNav active="evenement" />

      <section className="ma-hero">
        <div className="ma-hero-blob ma-hero-b1" style={{ background: 'rgba(147,112,219,.1)' }} />
        <div className="ma-hero-blob ma-hero-b2" style={{ background: 'rgba(224,123,32,.07)' }} />
        <div className="ma-hero-blob ma-hero-b3" style={{ background: 'rgba(59,85,143,.05)' }} />
        <div className="ma-hero-ghost">Agenda</div>

        <div className="ma-hero-left">
          <p className="ma-eyebrow">Agenda · Mai 2026</p>
          <h1 className="ma-h1">La vie de <em>la ville</em>.</h1>
          <p className="ma-sub">Concerts, marchés, réunions publiques, tournois — voici ce qui se passe près de chez vous.</p>
        </div>

        <div className="ma-hero-right">
          <div className="ma-hero-stats">
            <div className="ma-stat-block">
              <div className="ma-stat-num">{EVENEMENTS.length}<em>+</em></div>
              <div className="ma-stat-label">À venir</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#7B58B0' }}>3</div>
              <div className="ma-stat-label">Gratuits</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#186D10' }}>2</div>
              <div className="ma-stat-label">Ce mois</div>
            </div>
          </div>
        </div>
      </section>

      <div className="ma-content">
        <div className="ma-sec-head">
          <div>
            <p className="ma-sec-label">Prochains rendez-vous</p>
            <h2 className="ma-sec-title">Agenda <em>local</em>.</h2>
          </div>
          <button className="ma-btn-ghost" onClick={() => showView('home')}>← Retour</button>
        </div>

        <div className="ev-grid">
          {EVENEMENTS.map((ev, i) => {
            const ts = TAG_STYLE[ev.tag] ?? { bg: 'rgba(15,15,14,.07)', color: '#555' };
            return (
              <div key={ev.id} className="ev-row ma-card" style={{ animationDelay: `${i * .09}s` }}>
                {ev.accent && <div className="ev-accent-strip" style={{ background: '#9370DB' }} />}
                <div className="ev-date-col" style={{ background: ts.bg }}>
                  <div className="ev-date-day" style={{ color: ts.color }}>{ev.jour}</div>
                  <div className="ev-date-mois" style={{ color: ts.color }}>{ev.mois}</div>
                </div>
                <div className="ev-card-inner">
                  <span className="ev-tag" style={{ background: ts.bg, color: ts.color }}>{ev.tag}</span>
                  <div className="ev-title">{ev.titre}</div>
                  <div className="ev-meta">
                    <span>🕐 {ev.heure}</span>
                    <span>📍 {ev.lieu}</span>
                  </div>
                  {ev.desc && <div className="ev-desc">{ev.desc}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   CONTACT VIEW
═══════════════════════════════════════════ */
const ctCss = `
.ct-info-grid { display: flex; flex-direction: column; gap: .7rem; }
.ct-info-row {
  display: flex; align-items: center; gap: 1rem; padding: .8rem 1rem;
  background: rgba(15,15,14,.03); border-radius: 10px;
  border: 1px solid rgba(15,15,14,.06);
}
.ct-info-icon {
  width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
}
.ct-info-label { font-size: .7rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: rgba(15,15,14,.3); margin-bottom: .12rem; }
.ct-info-val { font-size: .9rem; font-weight: 500; color: #0F0F0E; }
.ct-hours-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .45rem; margin-top: .5rem; }
.ct-hours-row { font-size: .82rem; color: rgba(15,15,14,.55); display: flex; justify-content: space-between; padding: .45rem .7rem; background: rgba(15,15,14,.025); border-radius: 8px; }
.ct-hours-day { font-weight: 500; }
.ct-submit {
  width: 100%; padding: .88rem 1.5rem; background: #0F0F0E; border: none; border-radius: 2rem;
  font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 500; color: #FAFAF8;
  cursor: pointer; letter-spacing: .02em; margin-top: .25rem;
  transition: background .22s, transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s;
}
.ct-submit:hover { background: #1A3A8F; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,58,143,.22); }
`;

export const ContactView: React.FC = () => {
  useEffect(() => injectCss('municipall-ct-css', ctCss), []);
  const [nom, setNom]   = useState('');
  const [email, setEmail] = useState('');
  const [sujet, setSujet] = useState('');
  const [msg, setMsg]   = useState('');
  const [sent, setSent] = useState(false);
  const { showToast } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !email || !msg) return;
    setSent(true);
    showToast('Message envoyé à la mairie !');
    setNom(''); setEmail(''); setSujet(''); setMsg('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="ma-root">
      <TopNav active="contact" />

      <section className="ma-hero">
        <div className="ma-hero-blob ma-hero-b1" style={{ background: 'rgba(59,85,143,.08)' }} />
        <div className="ma-hero-blob ma-hero-b2" style={{ background: 'rgba(24,109,16,.06)' }} />
        <div className="ma-hero-blob ma-hero-b3" style={{ background: 'rgba(224,123,32,.04)' }} />
        <div className="ma-hero-ghost">Mairie</div>

        <div className="ma-hero-left">
          <p className="ma-eyebrow">Administration · Contact</p>
          <h1 className="ma-h1"><em>Contactez</em> la mairie.</h1>
          <p className="ma-sub">Vos questions, demandes et suggestions méritent une réponse. Notre équipe vous répondra sous 48h ouvrées.</p>
        </div>

        <div className="ma-hero-right">
          <div className="ma-hero-stats">
            <div className="ma-stat-block">
              <div className="ma-stat-num">48<em>h</em></div>
              <div className="ma-stat-label">Délai réponse</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#186D10' }}>5</div>
              <div className="ma-stat-label">Services</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#3B558F' }}>01</div>
              <div className="ma-stat-label">Numéro direct</div>
            </div>
          </div>
        </div>
      </section>

      <div className="ma-content">
        <div className="ma-two-col">
          {/* Infos */}
          <div>
            <div className="ma-sec-head">
              <div>
                <p className="ma-sec-label">Coordonnées</p>
                <h2 className="ma-sec-title">Nous <em>trouver</em>.</h2>
              </div>
            </div>

            <div className="ma-info-card" style={{ marginBottom: '1.5rem' }}>
              <div className="ma-info-head">
                <span className="ma-info-head-label">Mairie</span>
                <span className="ma-info-head-title">Hôtel de Ville</span>
              </div>
              <div className="ma-info-body">
                <div className="ct-info-grid">
                  <div className="ct-info-row">
                    <div className="ct-info-icon" style={{ background: 'rgba(59,85,143,.1)' }}>📍</div>
                    <div><div className="ct-info-label">Adresse</div><div className="ct-info-val">1 Place du Général de Gaulle</div></div>
                  </div>
                  <div className="ct-info-row">
                    <div className="ct-info-icon" style={{ background: 'rgba(24,109,16,.1)' }}>📞</div>
                    <div><div className="ct-info-label">Téléphone</div><div className="ct-info-val">01 49 58 60 00</div></div>
                  </div>
                  <div className="ct-info-row">
                    <div className="ct-info-icon" style={{ background: 'rgba(224,123,32,.1)' }}>✉️</div>
                    <div><div className="ct-info-label">E-mail</div><div className="ct-info-val">contact@mairie.fr</div></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ma-info-card">
              <div className="ma-info-head">
                <span className="ma-info-head-label">Horaires</span>
                <span className="ma-info-head-title">Ouverture au public</span>
              </div>
              <div className="ma-info-body">
                <div className="ct-hours-grid">
                  {[
                    { j:'Lundi', h:'8h30 – 17h00' },
                    { j:'Mardi', h:'8h30 – 17h00' },
                    { j:'Mercredi', h:'8h30 – 19h30' },
                    { j:'Jeudi', h:'8h30 – 17h00' },
                    { j:'Vendredi', h:'8h30 – 16h30' },
                    { j:'Samedi', h:'Fermé' },
                  ].map(r => (
                    <div key={r.j} className="ct-hours-row">
                      <span className="ct-hours-day">{r.j}</span>
                      <span>{r.h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div>
            <div className="ma-sec-head" style={{ marginTop: '3.25rem' }}>
              <div>
                <p className="ma-sec-label">Message</p>
                <h2 className="ma-sec-title">Nous <em>écrire</em>.</h2>
              </div>
            </div>

            <div className="ma-info-card">
              <div className="ma-info-body" style={{ padding: '1.5rem' }}>
                {sent && <div className="ma-alert success" style={{ marginBottom: '1rem' }}>✓ Votre message a bien été envoyé.</div>}
                <form onSubmit={handleSubmit}>
                  <div className="ma-field">
                    <label className="ma-field-label">Nom complet *</label>
                    <input className="ma-input" type="text" placeholder="Jean Dupont" value={nom} onChange={e => setNom(e.target.value)} />
                  </div>
                  <div className="ma-field">
                    <label className="ma-field-label">Adresse e-mail *</label>
                    <input className="ma-input" type="email" placeholder="jean.dupont@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="ma-field">
                    <label className="ma-field-label">Sujet</label>
                    <select className="ma-select" value={sujet} onChange={e => setSujet(e.target.value)}>
                      <option value="">Choisir un sujet…</option>
                      <option>Urbanisme</option>
                      <option>État civil</option>
                      <option>Voirie & espaces verts</option>
                      <option>Vie associative</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div className="ma-field">
                    <label className="ma-field-label">Message *</label>
                    <textarea className="ma-textarea" style={{ height: '100px' }} placeholder="Votre message…" value={msg} onChange={e => setMsg(e.target.value)} />
                  </div>
                  <button type="submit" className="ct-submit" disabled={!nom || !email || !msg}>
                    Envoyer →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   PROFIL VIEW
═══════════════════════════════════════════ */
const prCss = `
@keyframes pr-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

/* ── Avatar section ── */
.pr-avatar-wrap {
  display: flex; flex-direction: column; align-items: center;
  padding: 2.25rem 1.5rem 1.75rem;
  background: linear-gradient(170deg, rgba(59,85,143,.06) 0%, rgba(250,250,248,0) 60%);
  border-bottom: 1px solid rgba(15,15,14,.07);
  position: relative; overflow: hidden;
}
.pr-avatar-wrap::before {
  content: ''; position: absolute; top: -60px; right: -60px;
  width: 220px; height: 220px; border-radius: 50%;
  background: radial-gradient(circle, rgba(59,85,143,.07) 0%, transparent 70%);
  pointer-events: none;
}
.pr-avatar {
  width: 92px; height: 92px; border-radius: 50%;
  background: linear-gradient(135deg, #3B558F 0%, #1A3A8F 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 2.2rem; font-weight: 800; color: #fff;
  font-family: 'Playfair Display', serif;
  box-shadow: 0 0 0 4px #FAFAF8, 0 0 0 7px rgba(59,85,143,.18), 0 12px 32px rgba(59,85,143,.28);
  margin-bottom: 1.1rem; flex-shrink: 0;
  animation: pr-in .6s cubic-bezier(.22,1,.36,1) both;
}
.pr-avatar-name {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 1.45rem; color: #0F0F0E; letter-spacing: -.5px;
  margin-bottom: .3rem; text-align: center; animation: pr-in .65s cubic-bezier(.22,1,.36,1) .06s both;
}
.pr-avatar-meta {
  display: flex; align-items: center; gap: .55rem; flex-wrap: wrap; justify-content: center;
  animation: pr-in .65s cubic-bezier(.22,1,.36,1) .12s both;
}
.pr-avatar-email { font-size: .78rem; color: rgba(15,15,14,.38); }
.pr-verified {
  display: inline-flex; align-items: center; gap: .2rem;
  padding: .2rem .6rem; background: rgba(24,109,16,.09);
  border-radius: 1rem; color: #186D10; font-size: .65rem; font-weight: 700;
  letter-spacing: .05em; border: 1px solid rgba(24,109,16,.15);
}

/* ── Underline tabs ── */
.pr-tabs {
  display: flex; border-bottom: 1px solid rgba(15,15,14,.09); padding: 0 1.75rem;
}
.pr-tab {
  padding: .9rem 1.1rem; border: none; background: transparent; cursor: pointer;
  font-family: 'Inter', sans-serif; font-size: .82rem; font-weight: 500;
  color: rgba(15,15,14,.38); transition: color .18s;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  display: flex; align-items: center; gap: .4rem;
}
.pr-tab:hover { color: rgba(15,15,14,.72); }
.pr-tab.on { color: #0F0F0E; border-bottom-color: #0F0F0E; font-weight: 600; }
.pr-tab-icon { font-size: .95rem; }

/* ── Form area ── */
.pr-form-wrap { padding: 1.5rem 1.75rem 1.75rem; animation: pr-in .4s cubic-bezier(.22,1,.36,1) both; }
.pr-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; }
.pr-section-label {
  font-size: .64rem; font-weight: 700; letter-spacing: .13em; text-transform: uppercase;
  color: rgba(15,15,14,.28); margin: 0 0 1rem; display: flex; align-items: center; gap: .6rem;
}
.pr-section-label::after { content: ''; flex: 1; height: 1px; background: rgba(15,15,14,.07); }

.pr-btn-row { display: flex; align-items: center; gap: .75rem; margin-top: 1.6rem; padding-top: 1.4rem; border-top: 1px solid rgba(15,15,14,.07); }
.pr-save-btn {
  padding: .82rem 2rem; background: #0F0F0E; border: none; border-radius: 2rem;
  font-family: 'Inter', sans-serif; font-size: .86rem; font-weight: 600; color: #FAFAF8;
  cursor: pointer; letter-spacing: .03em;
  transition: background .22s, transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s;
  display: flex; align-items: center; gap: .45rem;
}
.pr-save-btn:hover { background: #1A3A8F; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(26,58,143,.22); }
.pr-save-btn:disabled { opacity: .42; cursor: not-allowed; transform: none; box-shadow: none; }
.pr-cancel-btn {
  padding: .82rem 1.4rem; background: transparent; border: 1.5px solid rgba(15,15,14,.12); border-radius: 2rem;
  font-family: 'Inter', sans-serif; font-size: .86rem; font-weight: 500; color: rgba(15,15,14,.45);
  cursor: pointer; transition: all .18s;
}
.pr-cancel-btn:hover { border-color: rgba(15,15,14,.3); color: #0F0F0E; }

/* ── Password strength ── */
.pr-pw-track { height: 4px; background: rgba(15,15,14,.08); border-radius: 2px; margin-top: .5rem; overflow: hidden; }
.pr-pw-fill { height: 100%; border-radius: 2px; transition: width .4s cubic-bezier(.22,1,.36,1), background .4s; }
.pr-pw-meta { display: flex; justify-content: space-between; margin-top: .3rem; }
.pr-pw-hint { font-size: .7rem; font-weight: 600; }
.pr-pw-rules { margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: .35rem; }
.pr-pw-rule { font-size: .74rem; display: flex; align-items: center; gap: .4rem; color: rgba(15,15,14,.35); transition: color .2s; }
.pr-pw-rule .dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(15,15,14,.15); flex-shrink: 0; transition: background .2s; }
.pr-pw-rule.ok { color: #186D10; }
.pr-pw-rule.ok .dot { background: #186D10; }

/* ── Eye button ── */
.pr-eye {
  position: absolute; right: .8rem; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; padding: .2rem;
  color: rgba(15,15,14,.3); font-size: .85rem; line-height: 1;
  transition: color .18s;
}
.pr-eye:hover { color: rgba(15,15,14,.65); }
.pr-input-wrap { position: relative; }
.pr-input-wrap .ma-input { padding-right: 2.4rem; }

/* ── Right sidebar ── */
.pr-sidebar-card {
  border-radius: 16px; overflow: hidden;
  border: 1px solid rgba(15,15,14,.09);
  box-shadow: 0 2px 20px rgba(15,15,14,.06);
  animation: pr-in .7s cubic-bezier(.22,1,.36,1) .2s both;
}
.pr-sidebar-top {
  background: linear-gradient(135deg, #1A3A8F 0%, #3B558F 60%, #534AB7 100%);
  padding: 1.75rem 1.5rem; position: relative; overflow: hidden;
}
.pr-sidebar-top::before {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 180px; height: 180px; border-radius: 50%;
  background: rgba(255,255,255,.07); pointer-events: none;
}
.pr-sidebar-top::after {
  content: ''; position: absolute; bottom: -50px; left: -30px;
  width: 140px; height: 140px; border-radius: 50%;
  background: rgba(255,255,255,.05); pointer-events: none;
}
.pr-sidebar-avatar {
  width: 56px; height: 56px; border-radius: 50%;
  background: rgba(255,255,255,.18); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: 1.3rem; color: #fff; margin-bottom: .9rem;
  border: 2px solid rgba(255,255,255,.3);
}
.pr-sidebar-name { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1.15rem; color: #fff; letter-spacing: -.3px; line-height: 1.2; }
.pr-sidebar-city { font-size: .76rem; color: rgba(255,255,255,.6); margin-top: .22rem; }
.pr-sidebar-badge {
  display: inline-flex; align-items: center; gap: .3rem; margin-top: .65rem;
  padding: .28rem .75rem; border-radius: 1rem; background: rgba(255,255,255,.15);
  font-size: .68rem; font-weight: 600; color: rgba(255,255,255,.9); letter-spacing: .05em;
  border: 1px solid rgba(255,255,255,.2);
}

.pr-stats-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 0; background: #FAFAF8;
}
.pr-stat {
  padding: 1.1rem 1.25rem; border-right: 1px solid rgba(15,15,14,.07);
  border-bottom: 1px solid rgba(15,15,14,.07);
  position: relative;
}
.pr-stat:nth-child(2n) { border-right: none; }
.pr-stat:nth-last-child(-n+2) { border-bottom: none; }
.pr-stat-icon { font-size: 1.1rem; margin-bottom: .35rem; }
.pr-stat-num { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1.65rem; color: #0F0F0E; line-height: 1; }
.pr-stat-num em { font-size: .95rem; font-style: normal; color: rgba(15,15,14,.3); }
.pr-stat-label { font-size: .65rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: rgba(15,15,14,.32); margin-top: .2rem; }
.pr-stat-accent { position: absolute; top: 0; left: 0; right: 0; height: 2px; border-radius: 0; }

.pr-sidebar-footer { padding: 1.25rem 1.5rem; background: #FAFAF8; }
.pr-contrib-text { font-size: .8rem; color: rgba(15,15,14,.45); line-height: 1.65; margin-bottom: .75rem; }

.pr-logout {
  width: 100%; padding: .82rem 1.5rem;
  background: transparent; border: 1.5px solid rgba(198,40,40,.2); border-radius: 2rem;
  font-family: 'Inter', sans-serif; font-size: .86rem; font-weight: 500; color: #C62828;
  cursor: pointer; letter-spacing: .02em; transition: all .22s;
  display: flex; align-items: center; justify-content: center; gap: .5rem;
}
.pr-logout:hover { background: #C62828; color: #fff; border-color: #C62828; box-shadow: 0 6px 20px rgba(198,40,40,.22); }
`;

type PrTab = 'infos' | 'adresse' | 'securite';

export const ProfilView: React.FC = () => {
  useEffect(() => injectCss('municipall-pr-css', prCss), []);
  const { user, logout, signalements, updateUser, showToast } = useApp();

  const [tab, setTab] = useState<PrTab>('infos');

  /* ── Infos state ── */
  const [prenom,  setPrenom]  = useState(user?.prenom       ?? '');
  const [nom,     setNom]     = useState(user?.nom          ?? '');
  const [email,   setEmail]   = useState(user?.email        ?? '');
  const [tel,     setTel]     = useState(user?.telephone    ?? '');
  const [dob,     setDob]     = useState(user?.dateNaissance ?? '');

  /* ── Adresse state ── */
  const [rue,        setRue]        = useState(user?.rue               ?? '');
  const [cp,         setCp]         = useState(user?.codePostal        ?? '');
  const [compl,      setCompl]      = useState(user?.complementAdresse ?? '');
  const [ville,      setVille]      = useState<Commune>(user?.ville    ?? 'Kremlin-Bicêtre');
  const [quartier,   setQuartier]   = useState(user?.quartier          ?? '');

  /* ── Sécurité state ── */
  const [curPw,   setCurPw]   = useState('');
  const [newPw,   setNewPw]   = useState('');
  const [confPw,  setConfPw]  = useState('');
  const [pwError, setPwError] = useState('');
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const initials  = user ? (user.prenom[0] ?? '') + (user.nom[0] ?? '') : 'XX';
  const enCours   = signalements.filter(s => s.statut === 'en-cours').length;
  const resolus   = signalements.filter(s => s.statut === 'resolu').length;
  const quartiers = QUARTIERS_BY_COMMUNE[ville] ?? [];

  /* password rules */
  const rules = [
    { label: '8 caractères minimum',      ok: newPw.length >= 8 },
    { label: 'Une majuscule',             ok: /[A-Z]/.test(newPw) },
    { label: 'Un chiffre',               ok: /\d/.test(newPw) },
    { label: 'Confirmation identique',   ok: confPw.length > 0 && newPw === confPw },
  ];
  const pwStrength  = rules.filter(r => r.ok).length;
  const strengthColor = ['transparent','#C62828','#E07B20','#E07B20','#186D10'][pwStrength];
  const strengthLabel = ['','Faible','Moyen','Bon','Fort'][pwStrength];

  const handleSaveInfos = () => {
    if (!prenom.trim() || !nom.trim() || !email.trim()) return;
    updateUser({
      prenom: prenom.trim(), nom: nom.trim(),
      email: email.trim(), telephone: tel.trim(), dateNaissance: dob,
      avatar: (prenom.trim()[0] ?? '') + (nom.trim()[0] ?? ''),
    });
    showToast('Informations mises à jour !');
  };

  const handleSaveAdresse = () => {
    if (!rue.trim() || !cp.trim()) return;
    updateUser({ rue: rue.trim(), codePostal: cp.trim(), complementAdresse: compl.trim(), ville, quartier: quartier as Quartier });
    showToast('Adresse mise à jour !');
  };

  const handleChangePw = () => {
    setPwError('');
    if (!curPw)                        { setPwError('Entrez votre mot de passe actuel.'); return; }
    if (curPw !== 'demo1234')          { setPwError('Mot de passe actuel incorrect.'); return; }
    if (!rules.slice(0,3).every(r=>r.ok)) { setPwError('Le nouveau mot de passe ne respecte pas les critères.'); return; }
    if (newPw !== confPw)              { setPwError('Les mots de passe ne correspondent pas.'); return; }
    setCurPw(''); setNewPw(''); setConfPw('');
    showToast('Mot de passe mis à jour !');
  };

  const resetInfos   = () => { setPrenom(user?.prenom ?? ''); setNom(user?.nom ?? ''); setEmail(user?.email ?? ''); setTel(user?.telephone ?? ''); setDob(user?.dateNaissance ?? ''); };
  const resetAdresse = () => { setRue(user?.rue ?? ''); setCp(user?.codePostal ?? ''); setCompl(user?.complementAdresse ?? ''); setVille(user?.ville ?? 'Kremlin-Bicêtre'); setQuartier(user?.quartier ?? ''); };

  const COMMUNES: Commune[] = ['Bouffémont','Kremlin-Bicêtre','Creil','Saint-Maur-les-Fossés'];

  return (
    <div className="ma-root">
      <TopNav active="home" />

      {/* ── Hero ── */}
      <section className="ma-hero">
        <div className="ma-hero-blob ma-hero-b1" style={{ background: 'rgba(59,85,143,.1)' }} />
        <div className="ma-hero-blob ma-hero-b2" style={{ background: 'rgba(83,74,183,.06)' }} />
        <div className="ma-hero-blob ma-hero-b3" style={{ background: 'rgba(157,110,70,.05)' }} />
        <div className="ma-hero-ghost">Profil</div>
        <div className="ma-hero-left">
          <p className="ma-eyebrow">Espace personnel · Compte citoyen</p>
          <h1 className="ma-h1">Mon <em>profil</em>.</h1>
          <p className="ma-sub">Modifiez vos informations, gérez votre adresse et sécurisez votre compte.</p>
        </div>
        <div className="ma-hero-right">
          <div className="ma-hero-stats">
            <div className="ma-stat-block">
              <div className="ma-stat-num">{signalements.length}</div>
              <div className="ma-stat-label">Signalements</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#3B558F' }}>{enCours}</div>
              <div className="ma-stat-label">En cours</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#186D10' }}>{resolus}</div>
              <div className="ma-stat-label">Résolus</div>
            </div>
          </div>
        </div>
      </section>

      <div className="ma-content">
        <div className="ma-two-col">

          {/* ── Left: settings card ── */}
          <div>
            <div className="ma-sec-head">
              <div>
                <p className="ma-sec-label">Paramètres</p>
                <h2 className="ma-sec-title">Mon <em>compte</em>.</h2>
              </div>
            </div>

            <div className="ma-info-card" style={{ overflow: 'hidden' }}>

              {/* Avatar centered */}
              <div className="pr-avatar-wrap">
                <div className="pr-avatar">{initials.toUpperCase()}</div>
                <div className="pr-avatar-name">{user?.prenom} {user?.nom}</div>
                <div className="pr-avatar-meta">
                  <span className="pr-avatar-email">{user?.email}</span>
                  <span className="pr-verified">✓ Vérifié</span>
                </div>
              </div>

              {/* Underline tabs */}
              <div className="pr-tabs">
                {([
                  { key: 'infos',    icon: '👤', label: 'Identité'  },
                  { key: 'adresse',  icon: '📍', label: 'Adresse'   },
                  { key: 'securite', icon: '🔒', label: 'Sécurité'  },
                ] as Array<{ key: PrTab; icon: string; label: string }>).map(t => (
                  <button key={t.key} className={`pr-tab${tab === t.key ? ' on' : ''}`} onClick={() => setTab(t.key)}>
                    <span className="pr-tab-icon">{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>

              {/* ── Identité ── */}
              {tab === 'infos' && (
                <div className="pr-form-wrap">
                  <p className="pr-section-label">Informations personnelles</p>
                  <div className="pr-form-row">
                    <div className="ma-field">
                      <label className="ma-field-label">Prénom *</label>
                      <input className="ma-input" value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Votre prénom" />
                    </div>
                    <div className="ma-field">
                      <label className="ma-field-label">Nom *</label>
                      <input className="ma-input" value={nom} onChange={e => setNom(e.target.value)} placeholder="Votre nom" />
                    </div>
                  </div>
                  <div className="ma-field">
                    <label className="ma-field-label">Adresse e-mail *</label>
                    <input className="ma-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemple.fr" />
                  </div>
                  <div className="pr-form-row">
                    <div className="ma-field">
                      <label className="ma-field-label">Téléphone</label>
                      <input className="ma-input" type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="06 XX XX XX XX" />
                    </div>
                    <div className="ma-field">
                      <label className="ma-field-label">Date de naissance</label>
                      <input className="ma-input" type="date" value={dob} onChange={e => setDob(e.target.value)} />
                    </div>
                  </div>
                  <div className="pr-btn-row">
                    <button className="pr-save-btn" onClick={handleSaveInfos} disabled={!prenom.trim() || !nom.trim() || !email.trim()}>
                      Enregistrer →
                    </button>
                    <button className="pr-cancel-btn" onClick={resetInfos}>Annuler</button>
                  </div>
                </div>
              )}

              {/* ── Adresse ── */}
              {tab === 'adresse' && (
                <div className="pr-form-wrap">
                  <p className="pr-section-label">Localisation</p>
                  <div className="pr-form-row">
                    <div className="ma-field">
                      <label className="ma-field-label">Commune *</label>
                      <select className="ma-select" value={ville} onChange={e => { setVille(e.target.value as Commune); setQuartier(''); }}>
                        {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="ma-field">
                      <label className="ma-field-label">Quartier</label>
                      <select className="ma-select" value={quartier} onChange={e => setQuartier(e.target.value)}>
                        <option value="">Choisir…</option>
                        {quartiers.map((q: string) => <option key={q} value={q}>{q}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="ma-field">
                    <label className="ma-field-label">Rue *</label>
                    <input className="ma-input" value={rue} onChange={e => setRue(e.target.value)} placeholder="12 Rue Victor Hugo" />
                  </div>
                  <div className="pr-form-row">
                    <div className="ma-field">
                      <label className="ma-field-label">Code postal *</label>
                      <input className="ma-input" value={cp} onChange={e => setCp(e.target.value)} placeholder="94270" maxLength={5} />
                    </div>
                    <div className="ma-field">
                      <label className="ma-field-label">Complément</label>
                      <input className="ma-input" value={compl} onChange={e => setCompl(e.target.value)} placeholder="Bât., étage…" />
                    </div>
                  </div>
                  <div className="pr-btn-row">
                    <button className="pr-save-btn" onClick={handleSaveAdresse} disabled={!rue.trim() || !cp.trim()}>
                      Enregistrer →
                    </button>
                    <button className="pr-cancel-btn" onClick={resetAdresse}>Annuler</button>
                  </div>
                </div>
              )}

              {/* ── Sécurité ── */}
              {tab === 'securite' && (
                <div className="pr-form-wrap">
                  <p className="pr-section-label">Changer le mot de passe</p>
                  {pwError && <div className="ma-alert danger" style={{ marginBottom: '1rem' }}>{pwError}</div>}

                  <div className="ma-field">
                    <label className="ma-field-label">Mot de passe actuel *</label>
                    <div className="pr-input-wrap">
                      <input className="ma-input" type={showCur ? 'text' : 'password'} value={curPw} onChange={e => setCurPw(e.target.value)} placeholder="••••••••" />
                      <button type="button" className="pr-eye" onClick={() => setShowCur(p => !p)}>
                        {showCur ? '🙈' : '👁'}
                      </button>
                    </div>
                  </div>

                  <div className="ma-field">
                    <label className="ma-field-label">Nouveau mot de passe *</label>
                    <div className="pr-input-wrap">
                      <input className="ma-input" type={showNew ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="••••••••" />
                      <button type="button" className="pr-eye" onClick={() => setShowNew(p => !p)}>
                        {showNew ? '🙈' : '👁'}
                      </button>
                    </div>
                    {newPw.length > 0 && (
                      <>
                        <div className="pr-pw-track">
                          <div className="pr-pw-fill" style={{ width: `${pwStrength * 25}%`, background: strengthColor }} />
                        </div>
                        <div className="pr-pw-meta">
                          <span className="pr-pw-hint" style={{ color: strengthColor }}>{strengthLabel}</span>
                          <span style={{ fontSize: '.68rem', color: 'rgba(15,15,14,.28)' }}>{pwStrength}/4 critères</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="ma-field">
                    <label className="ma-field-label">Confirmer *</label>
                    <input className="ma-input" type="password" value={confPw} onChange={e => setConfPw(e.target.value)} placeholder="••••••••" />
                  </div>

                  {newPw.length > 0 && (
                    <div className="pr-pw-rules">
                      {rules.map(r => (
                        <div key={r.label} className={`pr-pw-rule${r.ok ? ' on' : ''}`}>
                          <span className="dot" />{r.label}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pr-btn-row">
                    <button className="pr-save-btn" onClick={handleChangePw} disabled={!curPw || !newPw || !confPw}>
                      Mettre à jour →
                    </button>
                    <button className="pr-cancel-btn" onClick={() => { setCurPw(''); setNewPw(''); setConfPw(''); setPwError(''); }}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ── Right: premium sidebar ── */}
          <div style={{ paddingTop: '3.25rem' }}>

            <div className="pr-sidebar-card">
              {/* Gradient top */}
              <div className="pr-sidebar-top">
                <div className="pr-sidebar-avatar">{initials.toUpperCase()}</div>
                <div className="pr-sidebar-name">{user?.prenom} {user?.nom}</div>
                <div className="pr-sidebar-city">📍 {user?.ville}{user?.quartier ? ` · ${user.quartier}` : ''}</div>
                <div className="pr-sidebar-badge">★ Citoyen actif</div>
              </div>

              {/* Stats 2x2 grid */}
              <div className="pr-stats-grid">
                <div className="pr-stat">
                  <div className="pr-stat-accent" style={{ background: '#3B558F' }} />
                  <div className="pr-stat-icon">📋</div>
                  <div className="pr-stat-num">{signalements.length}<em>+</em></div>
                  <div className="pr-stat-label">Total signalements</div>
                </div>
                <div className="pr-stat">
                  <div className="pr-stat-accent" style={{ background: '#E07B20' }} />
                  <div className="pr-stat-icon">⏳</div>
                  <div className="pr-stat-num" style={{ color: '#E07B20' }}>{enCours}</div>
                  <div className="pr-stat-label">En cours</div>
                </div>
                <div className="pr-stat">
                  <div className="pr-stat-accent" style={{ background: '#186D10' }} />
                  <div className="pr-stat-icon">✅</div>
                  <div className="pr-stat-num" style={{ color: '#186D10' }}>{resolus}</div>
                  <div className="pr-stat-label">Résolus</div>
                </div>
                <div className="pr-stat">
                  <div className="pr-stat-accent" style={{ background: '#9370DB' }} />
                  <div className="pr-stat-icon">📅</div>
                  <div className="pr-stat-num" style={{ color: '#9370DB' }}>3</div>
                  <div className="pr-stat-label">Évènements</div>
                </div>
              </div>

              {/* Footer */}
              <div className="pr-sidebar-footer">
                <p className="pr-contrib-text">
                  Membre actif depuis 2025. Vos signalements contribuent à améliorer le cadre de vie de toute la commune. Merci pour votre engagement !
                </p>
                <div className="ma-badge resolu" style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', marginBottom: '.9rem' }}>
                  ✓ Profil vérifié · Membre 2025
                </div>
                <button className="pr-logout" onClick={logout}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Se déconnecter
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   COLLECTE VIEW  (Déchets & Toilettes)
═══════════════════════════════════════════ */
const colCss = `
.col-schedule { display: flex; flex-direction: column; gap: .65rem; }
.col-day-row {
  display: flex; align-items: center; gap: 1rem; padding: .9rem 1.1rem;
  background: rgba(15,15,14,.025); border: 1px solid rgba(15,15,14,.06);
  border-radius: 12px; animation: ma-up .6s cubic-bezier(.22,1,.36,1) both;
}
.col-day-pill {
  width: 56px; flex-shrink: 0; text-align: center;
  font-size: .72rem; font-weight: 700; letter-spacing: .07em;
  text-transform: uppercase; padding: .4rem .4rem;
  border-radius: 8px;
}
.col-day-info { flex: 1; }
.col-day-type { font-weight: 600; font-size: .9rem; color: #0F0F0E; }
.col-day-time { font-size: .75rem; color: rgba(15,15,14,.38); margin-top: .15rem; }
.col-day-icon { font-size: 1.3rem; }

.col-toilet-grid { display: flex; flex-direction: column; gap: .7rem; }
.col-toilet-row {
  display: flex; align-items: center; gap: 1rem; padding: .85rem 1.1rem;
  border-radius: 12px;
}
.col-toilet-icon { font-size: 1.3rem; }
.col-toilet-name { font-weight: 600; font-size: .88rem; color: #0F0F0E; }
.col-toilet-addr { font-size: .75rem; color: rgba(15,15,14,.38); margin-top: .1rem; }
.col-toilet-status { margin-left: auto; }
`;

const COLLECTE_SCHEDULE = [
  { jour: 'Lun', type: 'Ordures ménagères', heure: 'Avant 7h — Collecte matinale', icon: '🗑️', bg: 'rgba(198,40,40,.1)', color: '#C62828' },
  { jour: 'Mer', type: 'Tri sélectif',       heure: 'Avant 7h — Bacs jaunes uniquement', icon: '♻️', bg: 'rgba(24,109,16,.1)', color: '#186D10' },
  { jour: 'Ven', type: 'Ordures ménagères',  heure: 'Avant 7h — Collecte hebdomadaire', icon: '🗑️', bg: 'rgba(198,40,40,.1)', color: '#C62828' },
  { jour: 'Sam', type: 'Encombrants',        heure: 'Sur réservation — Service Propreté', icon: '📦', bg: 'rgba(157,110,70,.1)', color: '#9D6E46' },
  { jour: 'Sam', type: 'Verre & Carton',     heure: 'Collecte en déchetterie 9h–12h',   icon: '🧴', bg: 'rgba(59,85,143,.1)', color: '#3B558F' },
];

const TOILETTES = [
  { nom: 'Place du Marché',           adresse: 'Place centrale',              ouvert: true  },
  { nom: 'Parc Central — Entrée Est', adresse: 'Allée des Platanes',          ouvert: true  },
  { nom: 'Gare routière',             adresse: 'Av. du Général Leclerc',      ouvert: true  },
  { nom: 'Stade Municipal',           adresse: 'Rue des Sports',              ouvert: false },
  { nom: 'Médiathèque',               adresse: '14 Rue de la Bibliothèque',   ouvert: true  },
];

export const CollecteView: React.FC = () => {
  useEffect(() => injectCss('municipall-col-css', colCss), []);
  const { showView } = useApp();

  return (
    <div className="ma-root">
      <TopNav active="home" />

      <section className="ma-hero">
        <div className="ma-hero-blob ma-hero-b1" style={{ background: 'rgba(24,109,16,.09)' }} />
        <div className="ma-hero-blob ma-hero-b2" style={{ background: 'rgba(59,85,143,.06)' }} />
        <div className="ma-hero-blob ma-hero-b3" style={{ background: 'rgba(157,110,70,.05)' }} />
        <div className="ma-hero-ghost">Déchets</div>

        <div className="ma-hero-left">
          <p className="ma-eyebrow">Services · Propreté urbaine</p>
          <h1 className="ma-h1"><em>Collecte</em> & toilettes.</h1>
          <p className="ma-sub">Calendrier des collectes de déchets et localisation des toilettes publiques les plus proches.</p>
        </div>

        <div className="ma-hero-right">
          <div className="ma-hero-stats">
            <div className="ma-stat-block">
              <div className="ma-stat-num">{COLLECTE_SCHEDULE.length}</div>
              <div className="ma-stat-label">Collectes/sem.</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#186D10' }}>{TOILETTES.filter(t => t.ouvert).length}</div>
              <div className="ma-stat-label">Toilettes ouvertes</div>
            </div>
          </div>
        </div>
      </section>

      <div className="ma-content">
        <div className="ma-two-col">
          <div>
            <div className="ma-sec-head">
              <div>
                <p className="ma-sec-label">Planning</p>
                <h2 className="ma-sec-title">Calendrier <em>collecte</em>.</h2>
              </div>
              <button className="ma-btn-ghost" onClick={() => showView('home')}>← Retour</button>
            </div>

            <div className="col-schedule">
              {COLLECTE_SCHEDULE.map((c, i) => (
                <div key={i} className="col-day-row ma-card" style={{ animationDelay: `${i * .08}s` }}>
                  <div className="col-day-pill" style={{ background: c.bg, color: c.color }}>{c.jour}</div>
                  <span className="col-day-icon">{c.icon}</span>
                  <div className="col-day-info">
                    <div className="col-day-type">{c.type}</div>
                    <div className="col-day-time">{c.heure}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="ma-sec-head" style={{ marginTop: '3.25rem' }}>
              <div>
                <p className="ma-sec-label">Localisation</p>
                <h2 className="ma-sec-title">Toilettes <em>publiques</em>.</h2>
              </div>
            </div>

            <div className="col-toilet-grid">
              {TOILETTES.map((t, i) => (
                <div key={i} className="ma-card col-toilet-row" style={{ animationDelay: `${i * .07}s` }}>
                  <span className="col-toilet-icon">🚻</span>
                  <div>
                    <div className="col-toilet-name">{t.nom}</div>
                    <div className="col-toilet-addr">{t.adresse}</div>
                  </div>
                  <div className="col-toilet-status">
                    <span className={`ma-badge ${t.ouvert ? 'resolu' : 'attente'}`}>
                      {t.ouvert ? 'Ouvert' : 'Fermé'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   TRAVAUX VIEW
═══════════════════════════════════════════ */
const tvCss = `
.tv-card { padding: 1.3rem 1.5rem; animation: ma-up .6s cubic-bezier(.22,1,.36,1) both; }
.tv-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: .6rem; }
.tv-title { font-weight: 700; font-size: 1rem; color: #0F0F0E; line-height: 1.3; }
.tv-type { font-size: .72rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; padding: .28rem .75rem; border-radius: 1rem; }
.tv-addr { font-size: .8rem; color: rgba(15,15,14,.4); display: flex; align-items: center; gap: .4rem; margin-bottom: .7rem; }
.tv-progress { height: 4px; background: rgba(15,15,14,.08); border-radius: 2px; overflow: hidden; margin-bottom: .5rem; }
.tv-progress-fill { height: 100%; border-radius: 2px; transition: width 1.2s cubic-bezier(.25,.46,.45,.94); }
.tv-foot { display: flex; gap: .8rem; align-items: center; flex-wrap: wrap; }
.tv-date { font-size: .72rem; color: rgba(15,15,14,.3); }
.tv-impact { font-size: .72rem; color: rgba(15,15,14,.45); display: flex; align-items: center; gap: .35rem; }
`;

const TRAVAUX = [
  { titre: 'Réfection de la chaussée', addr: 'Rue Victor Hugo (n°1–45)', type: 'Voirie', typeBg: 'rgba(59,85,143,.1)', typeColor: '#3B558F', statut: 'en-cours', prog: 60, debut: '15 mai', fin: '20 juin', impact: 'Circulation alternée' },
  { titre: 'Rénovation trottoirs', addr: 'Avenue de la République', type: 'Voirie', typeBg: 'rgba(59,85,143,.1)', typeColor: '#3B558F', statut: 'planifie', prog: 0, debut: '1 juillet', fin: '30 août', impact: 'Piétons déviés' },
  { titre: 'Mise aux normes réseaux', addr: 'Quartier Paul Hochart', type: 'Réseau', typeBg: 'rgba(224,123,32,.1)', typeColor: '#E07B20', statut: 'en-cours', prog: 35, debut: '3 mai', fin: '15 juillet', impact: 'Coupures ponctuelles' },
  { titre: 'Réaménagement square', addr: 'Parc des Marronniers', type: 'Espaces verts', typeBg: 'rgba(24,109,16,.1)', typeColor: '#186D10', statut: 'en-cours', prog: 80, debut: '1 avril', fin: '30 juin', impact: 'Accès restreint' },
  { titre: 'Ravalement façade mairie', addr: 'Hôtel de Ville', type: 'Bâtiment', typeBg: 'rgba(157,110,70,.1)', typeColor: '#9D6E46', statut: 'planifie', prog: 0, debut: '15 août', fin: '15 oct', impact: 'Aucun impact' },
  { titre: 'Extension réseau fibre', addr: 'Quartier Nord — 12 rues', type: 'Numérique', typeBg: 'rgba(83,74,183,.1)', typeColor: '#534AB7', statut: 'en-cours', prog: 50, debut: '1 mars', fin: '31 août', impact: 'Fouilles ponctuelles' },
];

export const TravauxView: React.FC = () => {
  useEffect(() => injectCss('municipall-tv-css', tvCss), []);
  const { showView } = useApp();

  const enCours  = TRAVAUX.filter(t => t.statut === 'en-cours').length;
  const planifie = TRAVAUX.filter(t => t.statut === 'planifie').length;

  return (
    <div className="ma-root">
      <TopNav active="home" />

      <section className="ma-hero">
        <div className="ma-hero-blob ma-hero-b1" style={{ background: 'rgba(224,123,32,.09)' }} />
        <div className="ma-hero-blob ma-hero-b2" style={{ background: 'rgba(157,110,70,.07)' }} />
        <div className="ma-hero-blob ma-hero-b3" style={{ background: 'rgba(59,85,143,.05)' }} />
        <div className="ma-hero-ghost">Travaux</div>

        <div className="ma-hero-left">
          <p className="ma-eyebrow">Infrastructure · Chantiers</p>
          <h1 className="ma-h1">Travaux <em>en cours</em>.</h1>
          <p className="ma-sub">Restez informé des chantiers en cours et planifiés dans votre commune. Accès, délais et impacts sur la circulation.</p>
        </div>

        <div className="ma-hero-right">
          <div className="ma-hero-stats">
            <div className="ma-stat-block">
              <div className="ma-stat-num">{TRAVAUX.length}</div>
              <div className="ma-stat-label">Total chantiers</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#E07B20' }}>{enCours}</div>
              <div className="ma-stat-label">En cours</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#3B558F' }}>{planifie}</div>
              <div className="ma-stat-label">Planifiés</div>
            </div>
          </div>
        </div>
      </section>

      <div className="ma-content">
        <div className="ma-sec-head">
          <div>
            <p className="ma-sec-label">Chantiers actifs</p>
            <h2 className="ma-sec-title">État <em>des travaux</em>.</h2>
          </div>
          <button className="ma-btn-ghost" onClick={() => showView('home')}>← Retour</button>
        </div>

        <div className="ma-two-col">
          {TRAVAUX.map((t, i) => (
            <div key={i} className="ma-card tv-card" style={{ animationDelay: `${i * .08}s` }}>
              <div className="tv-header">
                <div className="tv-title">{t.titre}</div>
                <span className="tv-type" style={{ background: t.typeBg, color: t.typeColor }}>{t.type}</span>
              </div>
              <div className="tv-addr">📍 {t.addr}</div>
              {t.prog > 0 && (
                <div className="tv-progress">
                  <div className="tv-progress-fill" style={{ width: `${t.prog}%`, background: t.typeColor }} />
                </div>
              )}
              <div className="tv-foot">
                <span className={`ma-badge ${t.statut === 'en-cours' ? 'en-cours' : 'info'}`}>
                  {t.statut === 'en-cours' ? 'En cours' : 'Planifié'}
                </span>
                <span className="tv-date">{t.debut} → {t.fin}</span>
                {t.prog > 0 && <span className="tv-date">{t.prog}%</span>}
                <span className="tv-impact">⚠️ {t.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   TRANSPORTS VIEW
═══════════════════════════════════════════ */
const trCss = `
.tr-card { padding: 1.2rem 1.4rem; animation: ma-up .6s cubic-bezier(.22,1,.36,1) both; }
.tr-header { display: flex; align-items: center; gap: .9rem; margin-bottom: .65rem; }
.tr-line-badge {
  width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: .85rem; font-family: 'Inter', sans-serif;
}
.tr-line-name { font-weight: 700; font-size: .95rem; color: #0F0F0E; }
.tr-line-type { font-size: .72rem; color: rgba(15,15,14,.35); margin-top: .1rem; }
.tr-status-row { display: flex; align-items: center; gap: .7rem; flex-wrap: wrap; }
.tr-freq { font-size: .76rem; color: rgba(15,15,14,.4); }
.tr-alert {
  margin-top: .65rem; padding: .6rem .9rem;
  border-radius: 8px; font-size: .76rem; line-height: 1.55;
  display: flex; align-items: flex-start; gap: .5rem;
}
.tr-alert-icon { flex-shrink: 0; font-size: .95rem; }
`;

const LIGNES = [
  { num: '131', nom: 'Kremlin-Bicêtre ↔ Paris 13e', type: 'Bus', bg: '#E83E3E', color: '#fff', statut: 'perturbe', freq: 'Toutes les 8 min', alerte: 'Déviation Rue Victor Hugo jusqu\'à 18h30 — arrêts Pasteur et République non desservis.' },
  { num: 'B', nom: 'RER B — Boissy ↔ Mitry', type: 'RER', bg: '#005FA9', color: '#fff', statut: 'normal', freq: 'Toutes les 4–10 min' },
  { num: '7', nom: 'Métro 7 — Villejuif ↔ La Courneuve', type: 'Métro', bg: '#F08080', color: '#fff', statut: 'normal', freq: 'Toutes les 3 min' },
  { num: '104', nom: 'Creil ↔ Chantilly Gare', type: 'Bus', bg: '#E07B20', color: '#fff', statut: 'perturbe', freq: 'Toutes les 20 min', alerte: 'Service réduit jusqu\'à 31 mai — grève partielle des conducteurs.' },
  { num: 'D', nom: 'RER D — Orry ↔ Melun', type: 'RER', bg: '#005FA9', color: '#fff', statut: 'planifie', freq: 'Toutes les 15 min', alerte: 'Travaux noctirnes 2–6 juillet — interceptions 0h–5h.' },
  { num: 'V1', nom: 'VéloService — Réseau ville', type: 'Vélo', bg: '#186D10', color: '#fff', statut: 'normal', freq: '24h/24 — 35 stations' },
];

export const TransportsView: React.FC = () => {
  useEffect(() => injectCss('municipall-tr-css', trCss), []);
  const { showView } = useApp();

  const perturbees = LIGNES.filter(l => l.statut === 'perturbe').length;

  return (
    <div className="ma-root">
      <TopNav active="home" />

      <section className="ma-hero">
        <div className="ma-hero-blob ma-hero-b1" style={{ background: 'rgba(0,95,169,.09)' }} />
        <div className="ma-hero-blob ma-hero-b2" style={{ background: 'rgba(59,85,143,.06)' }} />
        <div className="ma-hero-blob ma-hero-b3" style={{ background: 'rgba(232,62,62,.05)' }} />
        <div className="ma-hero-ghost">Lignes</div>

        <div className="ma-hero-left">
          <p className="ma-eyebrow">Mobilité · Réseau local</p>
          <h1 className="ma-h1"><em>Transports</em> en commun.</h1>
          <p className="ma-sub">État du réseau, perturbations et fréquences de passage pour les lignes desservant votre commune.</p>
        </div>

        <div className="ma-hero-right">
          <div className="ma-hero-stats">
            <div className="ma-stat-block">
              <div className="ma-stat-num">{LIGNES.length}</div>
              <div className="ma-stat-label">Lignes</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#C62828' }}>{perturbees}</div>
              <div className="ma-stat-label">Perturbées</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#186D10' }}>{LIGNES.length - perturbees}</div>
              <div className="ma-stat-label">Normales</div>
            </div>
          </div>
        </div>
      </section>

      <div className="ma-content">
        <div className="ma-sec-head">
          <div>
            <p className="ma-sec-label">État du réseau</p>
            <h2 className="ma-sec-title">Lignes & <em>perturbations</em>.</h2>
          </div>
          <button className="ma-btn-ghost" onClick={() => showView('home')}>← Retour</button>
        </div>

        <div className="ma-two-col">
          {LIGNES.map((l, i) => (
            <div key={i} className="ma-card tr-card" style={{ animationDelay: `${i * .08}s` }}>
              <div className="tr-header">
                <div className="tr-line-badge" style={{ background: l.bg, color: l.color }}>{l.num}</div>
                <div>
                  <div className="tr-line-name">{l.nom}</div>
                  <div className="tr-line-type">{l.type}</div>
                </div>
              </div>
              <div className="tr-status-row">
                <span className={`ma-badge ${l.statut}`}>
                  {l.statut === 'perturbe' ? 'Perturbé' : l.statut === 'planifie' ? 'Travaux planifiés' : 'Normal'}
                </span>
                {l.freq && <span className="tr-freq">🕐 {l.freq}</span>}
              </div>
              {l.alerte && (
                <div className="tr-alert" style={{ background: l.statut === 'planifie' ? 'rgba(59,85,143,.07)' : 'rgba(198,40,40,.07)', border: `1px solid ${l.statut === 'planifie' ? 'rgba(59,85,143,.15)' : 'rgba(198,40,40,.15)'}` }}>
                  <span className="tr-alert-icon">{l.statut === 'planifie' ? '🔧' : '⚠️'}</span>
                  <span style={{ color: l.statut === 'planifie' ? '#3B558F' : '#C62828' }}>{l.alerte}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SOCIAL VIEW  (Associations)
═══════════════════════════════════════════ */
const socCss = `
.soc-card { padding: 1.2rem 1.4rem; animation: ma-up .6s cubic-bezier(.22,1,.36,1) both; }
.soc-header { display: flex; align-items: flex-start; gap: .9rem; margin-bottom: .55rem; }
.soc-icon {
  width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 1.15rem;
}
.soc-name { font-weight: 700; font-size: .96rem; color: #0F0F0E; line-height: 1.25; }
.soc-cat { font-size: .68rem; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; margin-top: .18rem; }
.soc-desc { font-size: .78rem; color: rgba(15,15,14,.45); line-height: 1.6; margin-bottom: .65rem; }
.soc-foot { display: flex; gap: .7rem; align-items: center; flex-wrap: wrap; }
.soc-meta { font-size: .72rem; color: rgba(15,15,14,.32); display: flex; align-items: center; gap: .3rem; }
`;

const CAT_FILTERS = [
  { key: 'tous',         label: 'Tous' },
  { key: 'sport',        label: '⚽ Sport' },
  { key: 'culture',      label: '🎭 Culture' },
  { key: 'social',       label: '🤝 Social' },
  { key: 'environnement',label: '🌿 Environnement' },
  { key: 'jeunesse',     label: '🔬 Jeunesse' },
  { key: 'sante',        label: '🏥 Santé' },
];

const CAT_COLOR: Record<string, string> = {
  sport:        '#52D68A',
  culture:      '#9370DB',
  social:       '#FFB347',
  environnement:'#52D68A',
  jeunesse:     '#4ECDC4',
  sante:        '#FF6B6B',
};

export const SocialView: React.FC = () => {
  useEffect(() => injectCss('municipall-soc-css', socCss), []);
  const [activeFilter, setFilter] = useState('tous');
  const { showView } = useApp();

  const filtered = activeFilter === 'tous'
    ? ASSOS
    : ASSOS.filter(a => a.cat === activeFilter);

  return (
    <div className="ma-root">
      <TopNav active="home" />

      <section className="ma-hero">
        <div className="ma-hero-blob ma-hero-b1" style={{ background: 'rgba(82,214,138,.1)' }} />
        <div className="ma-hero-blob ma-hero-b2" style={{ background: 'rgba(147,112,219,.07)' }} />
        <div className="ma-hero-blob ma-hero-b3" style={{ background: 'rgba(255,179,71,.05)' }} />
        <div className="ma-hero-ghost">Associations</div>

        <div className="ma-hero-left">
          <p className="ma-eyebrow">Vie locale · Associations</p>
          <h1 className="ma-h1">La vie <em>sociale</em>.</h1>
          <p className="ma-sub">Clubs sportifs, associations culturelles, entraide et bénévolat — rejoignez la communauté locale.</p>
        </div>

        <div className="ma-hero-right">
          <div className="ma-hero-stats">
            <div className="ma-stat-block">
              <div className="ma-stat-num">{ASSOS.length}<em>+</em></div>
              <div className="ma-stat-label">Associations</div>
            </div>
            <div className="ma-stat-block">
              <div className="ma-stat-num" style={{ color: '#52D68A' }}>{ASSOS.reduce((acc, a) => acc + (a.membres ?? 0), 0)}</div>
              <div className="ma-stat-label">Membres</div>
            </div>
          </div>
        </div>
      </section>

      <div className="ma-content">
        <div className="ma-sec-head">
          <div>
            <p className="ma-sec-label">Annuaire</p>
            <h2 className="ma-sec-title">Toutes les <em>associations</em>.</h2>
          </div>
          <button className="ma-btn-ghost" onClick={() => showView('home')}>← Retour</button>
        </div>

        <div className="ma-chips" style={{ marginBottom: '1.75rem' }}>
          {CAT_FILTERS.map(f => (
            <button key={f.key} className={`ma-chip${activeFilter === f.key ? ' on' : ''}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="ma-three-col">
          {filtered.map((a, i) => {
            const c = CAT_COLOR[a.cat] ?? '#888';
            return (
              <div key={a.id} className="ma-card soc-card" style={{ animationDelay: `${i * .06}s` }}>
                <div className="soc-header">
                  <div className="soc-icon" style={{ background: `${c}22` }}>
                    {a.icon}
                  </div>
                  <div>
                    <div className="soc-name">{a.nom}</div>
                    <div className="soc-cat" style={{ color: c }}>{a.cat}</div>
                  </div>
                </div>
                <div className="soc-desc">{a.desc}</div>
                <div className="soc-foot">
                  {a.membres && <span className="soc-meta">👥 {a.membres} membres</span>}
                  {a.lieu    && <span className="soc-meta">📍 {a.lieu}</span>}
                  {a.horaires && <span className="soc-meta">🕐 {a.horaires}</span>}
                </div>
                {a.tel && (
                  <div style={{ marginTop: '.6rem', fontSize: '.76rem', color: 'rgba(15,15,14,.35)' }}>
                    📞 {a.tel}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
