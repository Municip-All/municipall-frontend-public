import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../../components';
import { StaticSkylineFallback } from './SkylineFallback';
import './PresentationView.scss';

const CityJourney = lazy(() => import('./CityJourney').then((m) => ({ default: m.CityJourney })));

interface PresentationViewProps {
  onComplete?: () => void;
  onNavigateTo?: (view: string) => void;
}

/**
 * "La ville qui écoute" — the five acts the particle field moves through as the
 * visitor scrolls. `from`/`to` are positions along the pinned journey (0→1).
 */
const CHAPTERS: Array<{ num: string; title: string; hint?: string; from: number; to: number; low?: boolean }> = [
  // Starts before 0 so the opening caption is already at full opacity on arrival.
  { num: 'Chapitre I', title: 'Chaque point est une voix.', from: -0.06, to: 0.17 },
  { num: 'Chapitre II', title: 'Ensemble, elles dessinent une ville.', from: 0.2, to: 0.38 },
  { num: 'Chapitre III', title: 'Elle réagit à votre présence.', hint: 'Bougez votre curseur', from: 0.42, to: 0.56 },
  { num: 'Chapitre IV', title: "Et relie celles et ceux qui l'habitent.", from: 0.6, to: 0.78 },
  // Sits low so it never collides with the word forming above it.
  { num: 'Chapitre V', title: 'La démocratie de proximité.', from: 0.88, to: 1.0, low: true },
];

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
  'Signalements Centralisés', 'Suivi en Temps Réel', 'IA Intelligente', 'Mobile d’Abord',
  'Notifications Instantanées', 'Transparence Totale', 'Infos Municipales Unifiées', 'Démocratie de Proximité',
  'Signalements Centralisés', 'Suivi en Temps Réel', 'IA Intelligente', 'Mobile d’Abord',
  'Notifications Instantanées', 'Transparence Totale', 'Infos Municipales Unifiées', 'Démocratie de Proximité',
];

// Fixed decorative pattern — not a scannable code, just an illustrative preview
const QR_PATTERN = [
  1,1,1,0,1,0,1, 1,0,1,1,0,1,1, 1,1,1,0,0,1,1, 0,0,1,1,1,0,1,
  1,1,0,1,0,1,1, 1,0,1,0,1,1,0, 1,1,1,0,1,0,1,
];

type PhoneVariant = 'feed' | 'map' | 'notif';

const PhoneMockup: React.FC<{ variant: PhoneVariant; className?: string }> = ({ variant, className }) => (
  <div className={`pv-phone ${className || ''}`}>
    <div className="pv-phone-notch" />
    <div className="pv-phone-screen">
      {variant === 'feed' && (
        <>
          <div className="pv-ph-statusbar"><span>9:41</span></div>
          <div className="pv-ph-header">
            <span className="pv-ph-avatar" />
            <div>
              <p className="pv-ph-hello">Bonjour, Camille</p>
              <p className="pv-ph-sub">Quartier des Tilleuls</p>
            </div>
          </div>
          <div className="pv-ph-search" />
          <div className="pv-ph-card">
            <span className="pv-ph-pill pv-ph-pill-progress">En cours</span>
            <p className="pv-ph-card-title">Éclairage public</p>
            <p className="pv-ph-card-sub">Rue des Acacias</p>
          </div>
          <div className="pv-ph-card">
            <span className="pv-ph-pill pv-ph-pill-done">Résolu</span>
            <p className="pv-ph-card-title">Dépôt sauvage</p>
            <p className="pv-ph-card-sub">Square Voltaire</p>
          </div>
          <div className="pv-ph-fab">+</div>
        </>
      )}
      {variant === 'map' && (
        <>
          <div className="pv-ph-statusbar"><span>9:41</span></div>
          <div className="pv-ph-map">
            <span className="pv-ph-pin" style={{ top: '28%', left: '34%' }} />
            <span className="pv-ph-pin" style={{ top: '52%', left: '62%' }} />
            <span className="pv-ph-pin pv-ph-pin-active" style={{ top: '68%', left: '38%' }} />
          </div>
          <div className="pv-ph-sheet">
            <p className="pv-ph-card-title">Marché place centrale</p>
            <p className="pv-ph-card-sub">À 240 m · ouvert jusqu'à 13h</p>
          </div>
        </>
      )}
      {variant === 'notif' && (
        <>
          <div className="pv-ph-statusbar pv-ph-statusbar-dark"><span>9:41</span></div>
          <div className="pv-ph-lock">
            <p className="pv-ph-time">9:41</p>
            <p className="pv-ph-date">Lundi 30 Août</p>
          </div>
          <div className="pv-ph-notif">
            <span className="pv-ph-notif-dot" />
            <div>
              <p className="pv-ph-notif-title">Municipall</p>
              <p className="pv-ph-notif-text">Votre signalement « Éclairage public » a été résolu ✓</p>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);

export const PresentationView: React.FC<PresentationViewProps> = ({ onComplete, onNavigateTo }) => {
  const { setAuthView, theme } = useApp();
  const [isHidden, setIsHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ s1: 0, s2: 0, s3: 0 });
  const [barsVisible, setBarsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const statsAnimatedRef = useRef(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const journeyProgressRef = useRef(0);
  const captionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const railRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    setCoarsePointer(query.matches);
    const onChange = () => setCoarsePointer(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // Scroll progress + journey chapter choreography.
  // Chapter opacity is written straight to the DOM so the 5-act sequence never
  // triggers a React re-render while scrolling.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      setProgress((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);

      const journey = journeyRef.current;
      if (!journey) return;
      const span = journey.clientHeight - el.clientHeight;
      const raw = span > 0 ? (el.scrollTop - journey.offsetTop) / span : 0;
      const p = Math.min(1, Math.max(0, raw));
      journeyProgressRef.current = p;

      const fade = 0.05;
      CHAPTERS.forEach((chapter, i) => {
        const node = captionRefs.current[i];
        if (!node) return;
        const opacity = Math.max(
          0,
          Math.min((p - chapter.from) / fade, (chapter.to - p) / fade, 1)
        );
        node.style.opacity = String(opacity);
        node.style.transform = `translateY(${(1 - opacity) * 26}px)`;

        // Class toggle (not a per-frame style write) drives the staggered
        // word reveal, so the CSS transitions run uninterrupted.
        const active = opacity > 0.55;
        if (active !== node.classList.contains('is-active')) {
          node.classList.toggle('is-active', active);
        }
        const rail = railRefs.current[i];
        if (rail && active !== rail.classList.contains('is-active')) {
          rail.classList.toggle('is-active', active);
        }
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [reducedMotion]);

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
    const interactiveEls = document.querySelectorAll('a, button');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', grow);
        el.removeEventListener('mouseleave', shrink);
      });
    };
  }, []);

  const handleCTA = () => {
    setIsHidden(true);
    setTimeout(() => { setAuthView('login'); onComplete?.(); }, 600);
  };

  const handleFooterLink = (view: string) => {
    setIsHidden(true);
    setTimeout(() => {
      onNavigateTo?.(view);
      setAuthView('login');
      onComplete?.();
    }, 600);
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
          <div className="pv-nav-right">
            <ul className="pv-nav-links">
              <li><a href="#pv-app">App Mobile</a></li>
              <li><a href="#pv-solutions">Solutions</a></li>
              <li><a href="#pv-impact">Impact</a></li>
            </ul>
            <ThemeToggle />
            <button className="pv-nav-cta" onClick={handleCTA}>Accéder →</button>
          </div>
        </nav>

        {/* ── ACT I–V — "La ville qui écoute" ── */}
        {!reducedMotion && (
          <section className="pv-journey" id="pv-top" ref={journeyRef} aria-hidden="true">
            <div className="pv-journey-stage">
              <Suspense fallback={null}>
                <CityJourney progressRef={journeyProgressRef} theme={theme} />
              </Suspense>

              <div className="pv-journey-captions">
                {CHAPTERS.map((chapter, i) => (
                  <div
                    key={chapter.num}
                    className={`pv-chapter${chapter.low ? ' pv-chapter--low' : ''}`}
                    ref={(node) => { captionRefs.current[i] = node; }}
                  >
                    <p className="pv-chapter-num">{chapter.num}</p>
                    <h2 className="pv-chapter-title">
                      {chapter.title.split(' ').map((word, w) => (
                        <span className="pv-word-mask" key={w}>
                          <span className="pv-word" style={{ transitionDelay: `${0.05 + w * 0.055}s` }}>
                            {word}
                          </span>
                        </span>
                      ))}
                    </h2>
                    {chapter.hint && (
                      <p className="pv-chapter-hint">
                        {coarsePointer ? "Touchez l'écran" : chapter.hint}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Chapter rail — gives the sequence a readable structure */}
              <div className="pv-journey-rail">
                {CHAPTERS.map((chapter, i) => (
                  <div
                    key={chapter.num}
                    className="pv-rail-item"
                    ref={(node) => { railRefs.current[i] = node; }}
                  >
                    <span className="pv-rail-tick" />
                    <span className="pv-rail-label">{['I', 'II', 'III', 'IV', 'V'][i]}</span>
                  </div>
                ))}
              </div>

              <div className="pv-journey-scroll-cue">
                <span />
              </div>
            </div>
          </section>
        )}

        {/* ── HERO ── */}
        <section className="pv-hero" id={reducedMotion ? 'pv-top' : undefined}>
          {reducedMotion && <StaticSkylineFallback />}

          <div className="pv-hero-phone">
            <PhoneMockup variant="feed" />
          </div>

          <p className="pv-hero-eyebrow">Votre commune, dans votre poche</p>
          <h1 className="pv-hero-headline">
            La <em>démocratie</em><br />de proximité,<br />dans votre poche.
          </h1>
          <p className="pv-hero-sub">
            Comme les applications que vous utilisez déjà tous les jours, Municipall est avant tout une app mobile — rapide, intuitive, toujours à portée de main. Accessible aussi sur ordinateur.
          </p>
          <div className="pv-hero-actions">
            <a href="#pv-app" className="pv-btn-primary">
              Découvrir l'app <span className="pv-arrow">↓</span>
            </a>
            <button className="pv-btn-secondary" onClick={handleCTA}>Continuer sur le web →</button>
          </div>
          <div className="pv-scroll-line" />
        </section>

        {/* ── TICKER ── */}
        <div className="pv-ticker">
          <div className="pv-ticker-inner">
            {TICKER_ITEMS.map((t, i) => <span key={i} className="pv-ticker-item">{t}</span>)}
          </div>
        </div>

        {/* ── APP MOBILE ── */}
        <section className="pv-section pv-app-section" id="pv-app">
          <div className="pv-app-wrap">
            <div className="pv-app-visual">
              <PhoneMockup variant="map" className="pv-phone-back pv-phone-left" />
              <PhoneMockup variant="notif" className="pv-phone-back pv-phone-right" />
              <PhoneMockup variant="feed" className="pv-phone-front" />
            </div>
            <div className="pv-app-content">
              <p className="pv-section-label reveal">L'app Municipall</p>
              <h2 className="pv-section-h2 reveal reveal-delay-1">Pensée mobile <em>d'abord</em>.</h2>
              <p className="pv-section-body reveal reveal-delay-2">
                La version web reste disponible, mais l'app mobile est notre priorité : conçue pour tenir dans une poche, s'ouvrir en un instant, et rester avec vous partout dans la commune.
              </p>
              <ul className="pv-app-perks reveal reveal-delay-3">
                <li>Signalement en 10 secondes — photo et géolocalisation automatiques</li>
                <li>Notifications instantanées à chaque étape de votre demande</li>
                <li>Infos essentielles de votre commune accessibles hors-ligne</li>
              </ul>
              <div className="pv-app-download reveal reveal-delay-4">
                <div className="pv-store-badges">
                  <button className="pv-store-badge" onClick={handleCTA}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="2" width="18" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="12" cy="18.2" r="1" fill="currentColor" />
                    </svg>
                    <span>App Store<small>Bientôt disponible</small></span>
                  </button>
                  <button className="pv-store-badge" onClick={handleCTA}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 3.5v17l13-8.5-13-8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <span>Google Play<small>Bientôt disponible</small></span>
                  </button>
                </div>
                <div className="pv-qr">
                  <div className="pv-qr-grid">
                    {QR_PATTERN.map((on, i) => <span key={i} className={on ? 'on' : ''} />)}
                  </div>
                  <p className="pv-qr-label">QR code au lancement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                Municipall ne remplace pas les institutions. Il les rend accessibles. Chaque signalement devient une tâche, chaque demande trouve une réponse, chaque citoyen se sent entendu.
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
              <h2 className="pv-section-h2 reveal reveal-delay-1">L'essentiel pour <em>transformer</em> votre quotidien.</h2>
            </div>
            <p className="pv-section-body reveal reveal-delay-2" style={{ marginTop: 0, maxWidth: '320px' }}>
              Quatre piliers, pensés d'abord pour l'app mobile.
            </p>
          </div>
          <div className="pv-solutions-grid">
            <div className="pv-sol-card reveal">
              <svg className="pv-sol-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="rgba(143,203,134,0.14)" />
                <rect x="12" y="14" width="24" height="3" rx="1.5" fill="#8FCB86" />
                <rect x="12" y="20" width="18" height="3" rx="1.5" fill="#B7E0AC" />
                <rect x="12" y="26" width="21" height="3" rx="1.5" fill="#B7E0AC" />
                <circle cx="36" cy="32" r="6" fill="#8FCB86" />
                <rect x="34.5" y="29.5" width="3" height="5" rx="1" fill="white" />
              </svg>
              <p className="pv-sol-num">01</p>
              <h3 className="pv-sol-title">Signalements Centralisés</h3>
              <p className="pv-sol-desc">Plaintes, suggestions, incivilités — tout en un seul endroit, catégorisé automatiquement par l'IA.</p>
            </div>
            <div className="pv-sol-card reveal reveal-delay-1">
              <svg className="pv-sol-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="rgba(143,203,134,0.14)" />
                <circle cx="24" cy="24" r="10" stroke="#8FCB86" strokeWidth="2" fill="none" />
                <path d="M19 24l4 4 7-7" stroke="#8FCB86" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="pv-sol-num">02</p>
              <h3 className="pv-sol-title">Suivi en Temps Réel</h3>
              <p className="pv-sol-desc">Les citoyens voient l'avancée de leur demande à chaque étape. La transparence, c'est la confiance.</p>
            </div>
            <div className="pv-sol-card reveal reveal-delay-2">
              <svg className="pv-sol-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="rgba(217,164,65,0.16)" />
                <path d="M14 28 Q24 14 34 28" stroke="#D9A441" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="24" cy="28" r="4" fill="#D9A441" />
                <line x1="24" y1="32" x2="24" y2="36" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="pv-sol-num">03</p>
              <h3 className="pv-sol-title">Infos Municipales Unifiées</h3>
              <p className="pv-sol-desc">Événements, transports, travaux — toutes les informations qui comptent, au même endroit.</p>
            </div>
            <div className="pv-sol-card reveal">
              <svg className="pv-sol-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="rgba(143,203,134,0.14)" />
                <circle cx="24" cy="20" r="7" fill="#8FCB86" opacity="0.15" />
                <circle cx="24" cy="20" r="4" fill="#8FCB86" />
                <path d="M16 35 Q24 28 32 35" stroke="#8FCB86" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M33 18 Q36 16 36 20 Q36 24 33 22" stroke="#8FCB86" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
              <p className="pv-sol-num">04</p>
              <h3 className="pv-sol-title">IA Intelligente</h3>
              <p className="pv-sol-desc">Catégorisation auto, détection spam, résumés de satisfaction et redirection intelligente des demandes.</p>
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
            <ellipse cx="200" cy="300" rx="300" ry="200" fill="#8FCB86" opacity="0.12" filter="url(#pvwblur)" />
            <ellipse cx="1000" cy="300" rx="280" ry="180" fill="#7B8FCC" opacity="0.10" filter="url(#pvwblur)" />
            <ellipse cx="600" cy="500" rx="200" ry="120" fill="#D9A441" opacity="0.10" filter="url(#pvwblur)" />
          </svg>
          <p className="pv-section-label reveal" style={{ position: 'relative' }}>Rejoignez le Mouvement</p>
          <h2 className="pv-section-h2 pv-cta-h2 reveal reveal-delay-1">
            Prêt à transformer<br />votre <em>commune</em>&nbsp;?
          </h2>
          <p className="pv-section-body pv-cta-body reveal reveal-delay-2">
            Rejoignez les communes qui construisent une démocratie plus proche, plus transparente, plus vivante. L'intégration prend moins d'une journée.
          </p>
          <div className="pv-cta-actions reveal reveal-delay-3">
            <button className="pv-btn-primary pv-btn-large" onClick={handleCTA}>
              Télécharger l'app <span className="pv-arrow">→</span>
            </button>
            <button className="pv-btn-secondary pv-btn-large" onClick={handleCTA}>
              Utiliser sur le web <span className="pv-arrow">→</span>
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
            <span className="pv-footer-tagline"> · Démocratie de proximité, mobile d'abord</span>
          </div>
          <ul className="pv-footer-links">
            <li><button onClick={() => handleFooterLink('sig')}>Solutions</button></li>
            <li><button onClick={() => handleFooterLink('home')}>À propos</button></li>
            <li><button onClick={() => handleFooterLink('social')}>Carrières</button></li>
            <li><button onClick={() => handleFooterLink('contact')}>Contact</button></li>
            <li><button onClick={() => handleFooterLink('privacy')}>RGPD</button></li>
          </ul>
          <p className="pv-footer-legal">© 2026 Municip'All. Tous droits réservés.</p>
        </footer>

      </div>
    </>
  );
};
