import React, { useState, useEffect, useRef } from 'react';
import { useApp } from './Appcontext';
import './PresentationView.scss';

interface PresentationViewProps {
  onComplete?: () => void;
}

function animateNum(from: number, to: number, dur: number, cb: (v: number) => void) {
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min((now - start) / dur, 1);
    cb(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const TICKER_ITEMS = [
  'Signalements Centralisés', 'Suivi en Temps Réel', 'IA Intelligente', 'Intégration Flexible',
  'Back-office All-in-One', 'Transparence Totale', 'Infos Municipales Unifiées', 'Démocratie de Proximité',
  'Signalements Centralisés', 'Suivi en Temps Réel', 'IA Intelligente', 'Intégration Flexible',
  'Back-office All-in-One', 'Transparence Totale', 'Infos Municipales Unifiées', 'Démocratie de Proximité',
];

const VALUES = [
  { n: '01', name: 'Communication Bienveillante', text: 'Une équipe qui écoute construit mieux. La transparence est notre fondation.' },
  { n: '02', name: 'Confiance Gagnée', text: 'Nous sommes clairs sur nos limites autant que sur nos forces. Promesses tenues.' },
  { n: '03', name: 'Excellence Sans Compromis', text: 'Les meilleurs modèles IA, interface intuitive, performance irréprochable.' },
  { n: '04', name: "Clarté d'Abord", text: 'Design épuré, pas de jargon tech. Focus sur la tâche, pas sur la complexité.' },
  { n: '05', name: 'Responsabilité Intégrée', text: "Privacy, sécurité, droits humains — pas un compromis, un standard non négociable." },
  { n: '06', name: 'Amélioration Continue', text: "On teste rigoureusement, on écoute étroitement, on s'améliore constamment." },
];

export const PresentationView: React.FC<PresentationViewProps> = ({ onComplete }) => {
  const { setAuthView } = useApp();
  const [isHidden, setIsHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ s1: 0, s2: 0, s3: 0 });
  const [barsVisible, setBarsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const statsAnimatedRef = useRef(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Scroll progress + watercolor parallax
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      setProgress(el.scrollTop / (el.scrollHeight - el.clientHeight) * 100);
      const wc = el.querySelector<HTMLElement>('.pv-hero-watercolor');
      if (wc) wc.style.transform = `translateY(${el.scrollTop * 0.3}px)`;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12, root: el }
    );
    el.querySelectorAll('.reveal').forEach(r => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  // Stats animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const statsEl = el.querySelector('.pv-stats-grid');
    if (!statsEl) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && !statsAnimatedRef.current) {
            statsAnimatedRef.current = true;
            animateNum(0, 70, 1800, v => setStats(p => ({ ...p, s1: v })));
            animateNum(0, 40, 1800, v => setStats(p => ({ ...p, s2: v })));
            animateNum(0, 85, 1800, v => setStats(p => ({ ...p, s3: v })));
            setTimeout(() => setBarsVisible(true), 100);
          }
        });
      },
      { threshold: 0.3, root: el }
    );
    obs.observe(statsEl);
    return () => obs.disconnect();
  }, []);

  // Value rows stagger
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
      },
      { threshold: 0.2, root: el }
    );
    el.querySelectorAll('.pv-value-row').forEach((row, i) => {
      (row as HTMLElement).style.animationDelay = `${i * 0.08}s`;
      obs.observe(row);
    });
    return () => obs.disconnect();
  }, []);

  // Custom cursor
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const tick = () => {
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
      dot.style.left = `${mx}px`; dot.style.top = `${my}px`;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      raf = requestAnimationFrame(tick);
    };
    document.addEventListener('mousemove', onMove);
    tick();
    const grow = () => { ring.style.width = '56px'; ring.style.height = '56px'; };
    const shrink = () => { ring.style.width = '36px'; ring.style.height = '36px'; };
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleCTA = () => {
    setIsHidden(true);
    setTimeout(() => { setAuthView('login'); onComplete?.(); }, 600);
  };

  return (
    <>
      <div className="pv-progress-bar" style={{ width: `${progress}%` }} />
      <div className="pv-cursor-dot" ref={dotRef} />
      <div className="pv-cursor-ring" ref={ringRef} />

      <div className={`presentation ${isHidden ? 'hide' : ''}`} ref={containerRef}>

        {/* ── NAV ── */}
        <nav className="pv-nav">
          <a href="#pv-top" className="pv-nav-logo">Municip<span>'All</span></a>
          <ul className="pv-nav-links">
            <li><a href="#pv-solutions">Solutions</a></li>
            <li><a href="#pv-valeurs">Valeurs</a></li>
            <li><a href="#pv-impact">Impact</a></li>
          </ul>
          <button className="pv-nav-cta" onClick={handleCTA}>Accéder →</button>
        </nav>

        {/* ── HERO ── */}
        <section className="pv-hero" id="pv-top">
          <div className="pv-hero-bg-text">Démocratie</div>
          <div className="pv-hero-watercolor">
            <svg viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
              <defs>
                <filter id="pvb1"><feGaussianBlur stdDeviation="18" /></filter>
                <filter id="pvb2"><feGaussianBlur stdDeviation="28" /></filter>
                <filter id="pvb3"><feGaussianBlur stdDeviation="12" /></filter>
              </defs>
              <ellipse cx="600" cy="340" rx="320" ry="260" fill="#C8D5F0" opacity="0.45" filter="url(#pvb2)" />
              <ellipse cx="680" cy="500" rx="180" ry="140" fill="#E8C97A" opacity="0.22" filter="url(#pvb2)" />
              <ellipse cx="450" cy="650" rx="200" ry="160" fill="#A8D4B8" opacity="0.3" filter="url(#pvb1)" />
              <ellipse cx="580" cy="220" rx="140" ry="100" fill="#3B558F" opacity="0.1" filter="url(#pvb1)" />
              <ellipse cx="700" cy="720" rx="120" ry="90" fill="#F4BACC" opacity="0.25" filter="url(#pvb2)" />
              <path d="M480,280 Q540,200 620,310 Q700,420 580,480 Q460,540 440,440 Q420,340 480,280Z" fill="#E8EDF8" opacity="0.35" filter="url(#pvb3)" />
              <path d="M560,480 Q640,420 700,510 Q760,600 680,660 Q600,720 550,650 Q500,580 560,480Z" fill="#D4E0F8" opacity="0.3" filter="url(#pvb3)" />
            </svg>
          </div>

          <p className="pv-hero-eyebrow">Plateforme Civique Nouvelle Génération</p>
          <h1 className="pv-hero-headline">
            La <em>démocratie</em><br />de proximité,<br />réinventée.
          </h1>
          <p className="pv-hero-sub">
            Le pont numérique entre élus et riverains. Simple, transparent, et construit pour durer — sans changer les habitudes de personne.
          </p>
          <div className="pv-hero-actions">
            <button className="pv-btn-primary" onClick={handleCTA}>
              Accéder à Municipall <span className="pv-arrow">→</span>
            </button>
            <a href="#pv-solutions" className="pv-btn-ghost">Découvrir les solutions ↓</a>
          </div>
          <div className="pv-scroll-line" />
        </section>

        {/* ── TICKER ── */}
        <div className="pv-ticker">
          <div className="pv-ticker-inner">
            {TICKER_ITEMS.map((t, i) => <span key={i} className="pv-ticker-item">{t}</span>)}
          </div>
        </div>

        {/* ── MANIFESTO + STATS ── */}
        <section className="pv-section">
          <div className="pv-manifesto">
            <div>
              <p className="pv-section-label reveal">Notre Vision</p>
              <blockquote className="pv-manifesto-quote reveal reveal-delay-1">
                Une commune connectée est une commune plus vivante, plus juste, et plus inclusive.
              </blockquote>
            </div>
            <div className="reveal reveal-delay-2">
              <p className="pv-section-body" style={{ marginTop: 0 }}>
                Nous construisons le futur de la démocratie locale. Pas avec des technologies complexes, mais en simplifiant ce qui est essentiel : la conversation entre les citoyens et leurs élus.
              </p>
              <p className="pv-section-body" style={{ marginTop: '1.25rem' }}>
                Municipall ne remplace pas les institutions. Il les rend accessibles. Chaque signalement devient une tâche. Chaque demande trouve une réponse. Chaque citoyen se sent entendu.
              </p>
            </div>
          </div>

          <div className="pv-stats-grid">
            <div className="pv-stat-block reveal">
              <div className="pv-stat-num"><span>{stats.s1}</span>%</div>
              <p className="pv-stat-desc">des citoyens se sentent déconnectés de leur commune aujourd'hui</p>
              <div className="pv-stat-bar-track"><div className="pv-stat-bar-fill" style={{ width: barsVisible ? '70%' : '0%' }} /></div>
            </div>
            <div className="pv-stat-block reveal reveal-delay-1">
              <div className="pv-stat-num">−<span>{stats.s2}</span>%</div>
              <p className="pv-stat-desc">de charge administrative pour les équipes municipales</p>
              <div className="pv-stat-bar-track"><div className="pv-stat-bar-fill" style={{ width: barsVisible ? '40%' : '0%' }} /></div>
            </div>
            <div className="pv-stat-block reveal reveal-delay-2">
              <div className="pv-stat-num"><span>{stats.s3}</span>%</div>
              <p className="pv-stat-desc">d'augmentation de la confiance grâce à la transparence en temps réel</p>
              <div className="pv-stat-bar-track"><div className="pv-stat-bar-fill" style={{ width: barsVisible ? '85%' : '0%' }} /></div>
            </div>
          </div>
        </section>

        {/* ── SOLUTIONS ── */}
        <section className="pv-section" id="pv-solutions">
          <div className="pv-solutions-intro">
            <div>
              <p className="pv-section-label reveal">Nos Solutions</p>
              <h2 className="pv-section-h2 reveal reveal-delay-1">Six piliers pour <em>transformer</em> votre commune.</h2>
            </div>
            <p className="pv-section-body reveal reveal-delay-2" style={{ marginTop: 0, maxWidth: '320px' }}>
              Clé en main ou modulaire. Chaque pilier s'intègre à votre infrastructure existante.
            </p>
          </div>
          <div className="pv-solutions-grid">
            <div className="pv-sol-card reveal">
              <svg className="pv-sol-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#E8EDF8" />
                <rect x="12" y="14" width="24" height="3" rx="1.5" fill="#3B558F" />
                <rect x="12" y="20" width="18" height="3" rx="1.5" fill="#7B8FCC" />
                <rect x="12" y="26" width="21" height="3" rx="1.5" fill="#7B8FCC" />
                <circle cx="36" cy="32" r="6" fill="#3B558F" />
                <rect x="34.5" y="29.5" width="3" height="5" rx="1" fill="white" />
              </svg>
              <p className="pv-sol-num">01</p>
              <h3 className="pv-sol-title">Signalements Centralisés</h3>
              <p className="pv-sol-desc">Plaintes, suggestions, incivilités — tout en un seul endroit, catégorisé automatiquement par l'IA.</p>
            </div>
            <div className="pv-sol-card reveal reveal-delay-1">
              <svg className="pv-sol-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#EAF4ED" />
                <circle cx="24" cy="24" r="10" stroke="#186D10" strokeWidth="2" fill="none" />
                <path d="M19 24l4 4 7-7" stroke="#186D10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="pv-sol-num">02</p>
              <h3 className="pv-sol-title">Suivi en Temps Réel</h3>
              <p className="pv-sol-desc">Les citoyens voient l'avancée de leur demande à chaque étape. La transparence, c'est la confiance.</p>
            </div>
            <div className="pv-sol-card reveal reveal-delay-2">
              <svg className="pv-sol-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#FEF3E8" />
                <path d="M14 28 Q24 14 34 28" stroke="#E07B20" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="24" cy="28" r="4" fill="#E07B20" />
                <line x1="24" y1="32" x2="24" y2="36" stroke="#E07B20" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="pv-sol-num">03</p>
              <h3 className="pv-sol-title">Infos Municipales Unifiées</h3>
              <p className="pv-sol-desc">Événements, transports, travaux — toutes les informations qui comptent, au même endroit.</p>
            </div>
            <div className="pv-sol-card reveal">
              <svg className="pv-sol-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#EDE8FE" />
                <circle cx="24" cy="20" r="7" fill="#534AB7" opacity="0.15" />
                <circle cx="24" cy="20" r="4" fill="#534AB7" />
                <path d="M16 35 Q24 28 32 35" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M33 18 Q36 16 36 20 Q36 24 33 22" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
              <p className="pv-sol-num">04</p>
              <h3 className="pv-sol-title">IA Intelligente</h3>
              <p className="pv-sol-desc">Catégorisation auto, détection spam, résumés de satisfaction et redirection intelligente des demandes.</p>
            </div>
            <div className="pv-sol-card reveal reveal-delay-1">
              <svg className="pv-sol-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#E8EDF8" />
                <rect x="13" y="18" width="10" height="12" rx="3" fill="#3B558F" opacity="0.8" />
                <rect x="25" y="18" width="10" height="12" rx="3" fill="#7B8FCC" />
                <path d="M23 24 H25" stroke="#3B558F" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="pv-sol-num">05</p>
              <h3 className="pv-sol-title">Intégration Flexible</h3>
              <p className="pv-sol-desc">Clé en main ou via widgets dans votre application existante. Nous nous adaptons à vous, pas l'inverse.</p>
            </div>
            <div className="pv-sol-card reveal reveal-delay-2">
              <svg className="pv-sol-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#F8E8E8" />
                <rect x="12" y="12" width="24" height="18" rx="3" stroke="#C62828" strokeWidth="1.5" fill="none" />
                <line x1="12" y1="18" x2="36" y2="18" stroke="#C62828" strokeWidth="1.5" />
                <rect x="18" y="23" width="12" height="3" rx="1" fill="#C62828" opacity="0.5" />
                <path d="M20 33 h8 v5 h-8z" fill="#C62828" opacity="0.15" />
              </svg>
              <p className="pv-sol-num">06</p>
              <h3 className="pv-sol-title">Back-office All-in-One</h3>
              <p className="pv-sol-desc">Gérez tout en un lieu : citoyens, demandes, équipes, intégrations externes et tableaux de bord.</p>
            </div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="pv-section pv-values-section" id="pv-valeurs">
          <div className="pv-values-wrap">
            <div>
              <p className="pv-section-label reveal">Nos Valeurs</p>
              <h2 className="pv-section-h2 reveal reveal-delay-1">Comment nous <em>construisons</em> Municipall.</h2>
              <div className="pv-values-list">
                {VALUES.map((v) => (
                  <div key={v.n} className="pv-value-row">
                    <span className="pv-value-index">{v.n}</span>
                    <div>
                      <p className="pv-value-name">{v.name}</p>
                      <p className="pv-value-text">{v.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pv-values-visual">
              <svg viewBox="0 0 420 420" width="380" height="380" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="pvwc1"><feGaussianBlur stdDeviation="14" /></filter>
                  <filter id="pvwc2"><feGaussianBlur stdDeviation="8" /></filter>
                </defs>
                <circle cx="210" cy="210" r="160" fill="#C8D5F0" opacity="0.3" filter="url(#pvwc1)" />
                <circle cx="170" cy="180" r="100" fill="#3B558F" opacity="0.08" filter="url(#pvwc1)" />
                <circle cx="260" cy="240" r="90" fill="#E8C97A" opacity="0.2" filter="url(#pvwc1)" />
                <circle cx="200" cy="270" r="70" fill="#A8D4B8" opacity="0.3" filter="url(#pvwc2)" />
                <circle cx="240" cy="160" r="60" fill="#F4BACC" opacity="0.2" filter="url(#pvwc2)" />
                <circle cx="210" cy="210" r="130" stroke="#1A3A8F" strokeWidth="0.5" fill="none" opacity="0.2" />
                <circle cx="210" cy="210" r="90" stroke="#3B558F" strokeWidth="0.5" fill="none" opacity="0.15" strokeDasharray="4 8" />
                <circle cx="210" cy="210" r="8" fill="#3B558F" opacity="0.8" />
                <circle cx="210" cy="210" r="4" fill="#1A3A8F" />
                <circle cx="210" cy="80" r="4" fill="#3B558F" opacity="0.5" />
                <circle cx="330" cy="160" r="3" fill="#7B8FCC" opacity="0.6" />
                <circle cx="330" cy="260" r="4" fill="#3B558F" opacity="0.4" />
                <circle cx="210" cy="340" r="3" fill="#7B8FCC" opacity="0.5" />
                <circle cx="90" cy="260" r="4" fill="#3B558F" opacity="0.4" />
                <circle cx="90" cy="160" r="3" fill="#7B8FCC" opacity="0.6" />
                <line x1="210" y1="210" x2="210" y2="80" stroke="#3B558F" strokeWidth="0.5" opacity="0.2" />
                <line x1="210" y1="210" x2="330" y2="160" stroke="#3B558F" strokeWidth="0.5" opacity="0.2" />
                <line x1="210" y1="210" x2="330" y2="260" stroke="#3B558F" strokeWidth="0.5" opacity="0.2" />
                <line x1="210" y1="210" x2="210" y2="340" stroke="#3B558F" strokeWidth="0.5" opacity="0.2" />
                <line x1="210" y1="210" x2="90" y2="260" stroke="#3B558F" strokeWidth="0.5" opacity="0.2" />
                <line x1="210" y1="210" x2="90" y2="160" stroke="#3B558F" strokeWidth="0.5" opacity="0.2" />
                <text x="210" y="68" textAnchor="middle" fontSize="9" fontFamily="Inter,sans-serif" fill="#1A3A8F" opacity="0.7" fontWeight="600" letterSpacing="1">COMMUNICATION</text>
                <text x="346" y="158" fontSize="9" fontFamily="Inter,sans-serif" fill="#1A3A8F" opacity="0.7" fontWeight="600" letterSpacing="1">CONFIANCE</text>
                <text x="338" y="272" fontSize="9" fontFamily="Inter,sans-serif" fill="#1A3A8F" opacity="0.7" fontWeight="600" letterSpacing="1">EXCELLENCE</text>
                <text x="210" y="360" textAnchor="middle" fontSize="9" fontFamily="Inter,sans-serif" fill="#1A3A8F" opacity="0.7" fontWeight="600" letterSpacing="1">CLARTÉ</text>
                <text x="16" y="272" fontSize="9" fontFamily="Inter,sans-serif" fill="#1A3A8F" opacity="0.7" fontWeight="600" letterSpacing="1">SÉCURITÉ</text>
                <text x="20" y="158" fontSize="9" fontFamily="Inter,sans-serif" fill="#1A3A8F" opacity="0.7" fontWeight="600" letterSpacing="1">AMÉLIORATION</text>
              </svg>
            </div>
          </div>
        </section>

        {/* ── IMPACT (light, same style as other sections) ── */}
        <section className="pv-section" id="pv-impact">
          <div className="pv-impact-intro">
            <p className="pv-section-label reveal">Impact Mesurable</p>
            <h2 className="pv-section-h2 reveal reveal-delay-1">Construire une ville qui <em>écoute</em>.</h2>
          </div>
          <div className="pv-impact-grid">
            <div className="pv-impact-card reveal">
              <span className="pv-impact-step">1</span>
              <span className="pv-impact-tag">Efficacité</span>
              <h3 className="pv-impact-title">Réduire le Chaos Administratif</h3>
              <p className="pv-impact-text">Du bruit administratif aux insights actionnables. Chaque plainte devient une tâche tracée, priorisée, résolue.</p>
              <div className="pv-impact-metric">−40%</div>
              <p className="pv-impact-sub">de charge administrative</p>
            </div>
            <div className="pv-impact-card reveal reveal-delay-1">
              <span className="pv-impact-step">2</span>
              <span className="pv-impact-tag">Confiance</span>
              <h3 className="pv-impact-title">Augmenter la Confiance Citoyenne</h3>
              <p className="pv-impact-text">Transparence totale signifie citoyens satisfaits. Les demandes progressent visiblement, en temps réel, sans friction.</p>
              <div className="pv-impact-metric">+85%</div>
              <p className="pv-impact-sub">de confiance augmentée</p>
            </div>
            <div className="pv-impact-card reveal reveal-delay-2">
              <span className="pv-impact-step">3</span>
              <span className="pv-impact-tag">Transformation</span>
              <h3 className="pv-impact-title">Transformer le Travail Municipal</h3>
              <p className="pv-impact-text">L'IA fait le tri automatique. Les agents se concentrent sur ce qui compte vraiment : les habitants, pas la paperasse.</p>
              <div className="pv-impact-metric">+∞</div>
              <p className="pv-impact-sub">efficacité immédiate</p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pv-section pv-cta-section" id="pv-cta">
          <svg className="pv-cta-blobs" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs><filter id="pvwblur"><feGaussianBlur stdDeviation="40" /></filter></defs>
            <ellipse cx="200" cy="300" rx="300" ry="200" fill="#C8D5F0" opacity="0.3" filter="url(#pvwblur)" />
            <ellipse cx="1000" cy="300" rx="280" ry="180" fill="#A8D4B8" opacity="0.25" filter="url(#pvwblur)" />
            <ellipse cx="600" cy="500" rx="200" ry="120" fill="#E8C97A" opacity="0.15" filter="url(#pvwblur)" />
          </svg>
          <p className="pv-section-label reveal" style={{ position: 'relative' }}>Rejoignez le Mouvement</p>
          <h2 className="pv-section-h2 pv-cta-h2 reveal reveal-delay-1">
            Prêt à transformer<br />votre <em>commune</em>&nbsp;?
          </h2>
          <p className="pv-section-body pv-cta-body reveal reveal-delay-2">
            Rejoignez les communes qui construisent une démocratie plus proche, plus transparente, plus vivante. L'intégration prend moins d'une journée.
          </p>
          <div className="reveal reveal-delay-3" style={{ position: 'relative' }}>
            <button className="pv-btn-primary pv-btn-large" onClick={handleCTA}>
              Accéder à Municipall <span className="pv-arrow">→</span>
            </button>
          </div>
          <div className="pv-cta-features reveal reveal-delay-4">
            <span className="pv-cta-feat">Intégration simple</span>
            <span className="pv-cta-feat">Support dédié</span>
            <span className="pv-cta-feat">Données sécurisées RGPD</span>
            <span className="pv-cta-feat">Sans engagement</span>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="pv-footer">
          <div className="pv-footer-brand">
            Municip<span>'All</span>
            <span className="pv-footer-tagline"> · Démocratie de proximité</span>
          </div>
          <ul className="pv-footer-links">
            <li><a href="#">Solutions</a></li>
            <li><a href="#">À propos</a></li>
            <li><a href="#">Carrières</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">RGPD</a></li>
          </ul>
          <p className="pv-footer-legal">© 2026 Municip'All. Tous droits réservés.</p>
        </footer>

      </div>
    </>
  );
};
