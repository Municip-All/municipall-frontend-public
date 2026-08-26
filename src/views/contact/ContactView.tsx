import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../layout/PageLayout';
import { contactService } from '../../services/contactService';
import { parseOpeningHours } from '../../lib/mappers';
import './ContactView.scss';

export const ContactView: React.FC = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [sujet, setSujet] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const sentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (sentTimerRef.current) clearTimeout(sentTimerRef.current);
    };
  }, []);
  const { showToast, cityConfig, isAuthenticated } = useApp();

  const address = cityConfig?.publicProfile?.address || '—';
  const phone = cityConfig?.contact?.phone || '—';
  const contactEmail = cityConfig?.contact?.email || '—';
  const hoursRows = parseOpeningHours(cityConfig?.publicProfile?.openingHours);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !email || !msg) return;
    if (!isAuthenticated) { showToast('Connectez-vous pour envoyer un message à la mairie.'); return; }
    setSending(true);
    try {
      await contactService.createTicket({ subject: sujet || `Message de ${nom}`, body: `${msg}\n\n— ${nom} (${email})`, ticketType: 'question' });
      setSent(true); showToast('Message envoyé à la mairie !'); setNom(''); setEmail(''); setSujet(''); setMsg('');
      if (sentTimerRef.current) clearTimeout(sentTimerRef.current);
      sentTimerRef.current = setTimeout(() => setSent(false), 5000);
    } catch { showToast('Envoi impossible. Réessayez plus tard.'); } finally { setSending(false); }
  };

  return (
    <PageLayout active="contact">
      <section className="pl-hero">
        <div className="pl-hero-blob pl-hero-b1" style={{ background: 'rgba(59,85,143,.08)' }} />
        <div className="pl-hero-blob pl-hero-b2" style={{ background: 'rgba(24,109,16,.06)' }} />
        <div className="pl-hero-blob pl-hero-b3" style={{ background: 'rgba(224,123,32,.04)' }} />
        <div className="pl-hero-ghost">Mairie</div>
        <div className="pl-hero-left">
          <p className="pl-eyebrow">Administration · Contact</p>
          <h1 className="pl-h1"><em>Contactez</em> la mairie.</h1>
          <p className="pl-sub">Vos questions, demandes et suggestions méritent une réponse. Notre équipe vous répondra sous 48h ouvrées.</p>
        </div>
        <div className="pl-hero-right">
          <div className="pl-hero-stats">
            <div className="pl-stat-block"><div className="pl-stat-num">48<em>h</em></div><div className="pl-stat-label">Délai réponse</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-success)' }}>5</div><div className="pl-stat-label">Services</div></div>
            <div className="pl-stat-block"><div className="pl-stat-num" style={{ color: 'var(--color-primary-light)' }}>01</div><div className="pl-stat-label">Numéro direct</div></div>
          </div>
        </div>
      </section>
      <div className="pl-content">
        <div className="pl-two-col">
          <div>
            <div className="pl-sec-head"><div><p className="pl-sec-label">Coordonnées</p><h2 className="pl-sec-title">Nous <em>trouver</em>.</h2></div></div>
            <div className="pl-info-card" style={{ marginBottom: '1.5rem' }}>
              <div className="pl-info-head"><span className="pl-info-head-label">Mairie</span><span className="pl-info-head-title">Hôtel de Ville</span></div>
              <div className="pl-info-body">
                <div className="ct-info-grid">
                  <div className="ct-info-row"><div className="ct-info-icon" style={{ background: 'var(--color-primary-bg)' }}>📍</div><div><div className="ct-info-label">Adresse</div><div className="ct-info-val">{address}</div></div></div>
                  <div className="ct-info-row"><div className="ct-info-icon" style={{ background: 'var(--color-success-bg)' }}>📞</div><div><div className="ct-info-label">Téléphone</div><div className="ct-info-val">{phone}</div></div></div>
                  <div className="ct-info-row"><div className="ct-info-icon" style={{ background: 'var(--color-warning-bg)' }}>✉️</div><div><div className="ct-info-label">E-mail</div><div className="ct-info-val">{contactEmail}</div></div></div>
                </div>
              </div>
            </div>
            <div className="pl-info-card">
              <div className="pl-info-head"><span className="pl-info-head-label">Horaires</span><span className="pl-info-head-title">Ouverture au public</span></div>
              <div className="pl-info-body">
                <div className="ct-hours-grid">{hoursRows.map(r => (<div key={r.j} className="ct-hours-row"><span className="ct-hours-day">{r.j}</span><span>{r.h}</span></div>))}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="pl-sec-head" style={{ marginTop: '3.25rem' }}><div><p className="pl-sec-label">Message</p><h2 className="pl-sec-title">Nous <em>écrire</em>.</h2></div></div>
            <div className="pl-info-card">
              <div className="pl-info-body" style={{ padding: '1.5rem' }}>
                {sent && <div className="pl-alert success" style={{ marginBottom: '1rem' }}>✓ Votre message a bien été envoyé.</div>}
                <form onSubmit={handleSubmit}>
                  <div className="pl-field"><label className="pl-field-label">Nom complet *</label><input className="pl-input" type="text" placeholder="Jean Dupont" value={nom} onChange={e => setNom(e.target.value)} /></div>
                  <div className="pl-field"><label className="pl-field-label">Adresse e-mail *</label><input className="pl-input" type="email" placeholder="jean.dupont@gmail.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
                  <div className="pl-field"><label className="pl-field-label">Sujet</label><select className="pl-select" value={sujet} onChange={e => setSujet(e.target.value)}><option value="">Choisir un sujet…</option><option>Urbanisme</option><option>État civil</option><option>Voirie & espaces verts</option><option>Vie associative</option><option>Autre</option></select></div>
                  <div className="pl-field"><label className="pl-field-label">Message *</label><textarea className="pl-textarea" style={{ height: '100px' }} placeholder="Votre message…" value={msg} onChange={e => setMsg(e.target.value)} /></div>
                  <button type="submit" className="ct-submit" disabled={sending || !nom || !email || !msg}>Envoyer →</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
