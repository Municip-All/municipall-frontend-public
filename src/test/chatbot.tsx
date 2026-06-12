import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from './Appcontext';
import { BOT_RESPONSES } from '../data';

/* ── CSS ───────────────────────────────────────── */
const css = `
@keyframes bot-panel-in {
  from { opacity:0; transform: translateY(-12px) scale(.97); }
  to   { opacity:1; transform: translateY(0)     scale(1); }
}
@keyframes bot-msg-in {
  from { opacity:0; transform: translateY(8px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes bot-dot {
  0%,80%,100% { transform: scale(.7); opacity:.4; }
  40%         { transform: scale(1);  opacity:1; }
}
/* ── Panel ── */
.bot-panel {
  position: fixed; top: 72px; right: 1.5rem; z-index: 59;
  width: 390px; max-width: calc(100vw - 2rem);
  background: #FAFAF8; border-radius: 20px;
  border: 1px solid rgba(15,15,14,.1);
  box-shadow: 0 24px 64px rgba(15,15,14,.18), 0 4px 16px rgba(15,15,14,.08);
  display: flex; flex-direction: column;
  overflow: hidden; font-family: 'Inter', sans-serif;
  animation: bot-panel-in .32s cubic-bezier(.22,1,.36,1) both;
  max-height: 540px;
}

/* Header */
.bot-header {
  background: linear-gradient(135deg, #1A3A8F 0%, #3B558F 60%, #534AB7 100%);
  padding: 1.1rem 1.25rem; display: flex; align-items: center; gap: .9rem;
  flex-shrink: 0; position: relative; overflow: hidden;
}
.bot-header::before {
  content: ''; position: absolute; top: -30px; right: -30px;
  width: 120px; height: 120px; border-radius: 50%;
  background: rgba(255,255,255,.07); pointer-events: none;
}
.bot-avatar {
  width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
  background: rgba(255,255,255,.18); backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,.3);
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
}
.bot-header-info { flex: 1; }
.bot-header-name { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1rem; color: #fff; letter-spacing: -.2px; }
.bot-header-status { font-size: .7rem; color: rgba(255,255,255,.65); display: flex; align-items: center; gap: .4rem; margin-top: .1rem; }
.bot-online-dot { width: 7px; height: 7px; border-radius: 50%; background: #52D68A; box-shadow: 0 0 0 2px rgba(82,214,138,.3); flex-shrink: 0; }
.bot-close-btn {
  width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.2); cursor: pointer; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: .8rem;
  transition: background .18s; flex-shrink: 0;
}
.bot-close-btn:hover { background: rgba(255,255,255,.22); }

/* Messages */
.bot-messages {
  flex: 1; overflow-y: auto; padding: 1rem 1rem .5rem;
  display: flex; flex-direction: column; gap: .65rem;
  scrollbar-width: thin; scrollbar-color: rgba(15,15,14,.1) transparent;
}
.bot-messages::-webkit-scrollbar { width: 4px; }
.bot-messages::-webkit-scrollbar-thumb { background: rgba(15,15,14,.1); border-radius: 2px; }

.bot-msg { display: flex; gap: .6rem; align-items: flex-end; animation: bot-msg-in .28s cubic-bezier(.22,1,.36,1) both; }
.bot-msg.user { flex-direction: row-reverse; }

.bot-msg-avatar {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #1A3A8F, #3B558F);
  display: flex; align-items: center; justify-content: center; font-size: .75rem;
}
.bot-msg-avatar.user-av {
  background: linear-gradient(135deg, #0F0F0E, #3a3a38);
  font-size: .6rem; font-weight: 700; color: #fff;
  font-family: 'Playfair Display', serif;
}

.bot-bubble {
  max-width: 76%; padding: .65rem .9rem; border-radius: 14px;
  font-size: .83rem; line-height: 1.55; color: rgba(15,15,14,.8);
  background: #F0EEE8; border: 1px solid rgba(15,15,14,.07);
  border-bottom-left-radius: 4px;
}
.bot-msg.user .bot-bubble {
  background: linear-gradient(135deg, #1A3A8F, #3B558F);
  color: #fff; border: none;
  border-bottom-right-radius: 4px; border-bottom-left-radius: 14px;
}
.bot-bubble strong { font-weight: 600; }
.bot-bubble-time {
  font-size: .62rem; color: rgba(15,15,14,.25); margin-top: .25rem;
  display: block; text-align: right;
}
.bot-msg.user .bot-bubble-time { color: rgba(255,255,255,.5); }

/* Typing indicator */
.bot-typing { display: flex; align-items: center; gap: .55rem; padding: .55rem .75rem; }
.bot-typing-dots { display: flex; gap: 4px; }
.bot-typing-dot {
  width: 7px; height: 7px; border-radius: 50%; background: rgba(15,15,14,.25);
}
.bot-typing-dot:nth-child(1) { animation: bot-dot 1.2s ease-in-out 0s    infinite; }
.bot-typing-dot:nth-child(2) { animation: bot-dot 1.2s ease-in-out 0.18s  infinite; }
.bot-typing-dot:nth-child(3) { animation: bot-dot 1.2s ease-in-out 0.36s  infinite; }

/* Quick chips */
.bot-chips {
  padding: .6rem 1rem; display: flex; gap: .4rem; flex-wrap: wrap;
  border-top: 1px solid rgba(15,15,14,.06); flex-shrink: 0;
}
.bot-chip {
  padding: .38rem .85rem; border-radius: 2rem; font-size: .74rem; font-weight: 500;
  border: 1.5px solid rgba(15,15,14,.12); background: transparent;
  color: rgba(15,15,14,.6); cursor: pointer; font-family: 'Inter', sans-serif;
  transition: all .18s; white-space: nowrap;
}
.bot-chip:hover { border-color: #3B558F; color: #3B558F; background: rgba(59,85,143,.06); }

/* Input */
.bot-input-row {
  padding: .75rem 1rem; border-top: 1px solid rgba(15,15,14,.07);
  display: flex; align-items: center; gap: .6rem; flex-shrink: 0;
  background: rgba(250,250,248,.95);
}
.bot-input {
  flex: 1; padding: .62rem .95rem; border-radius: 2rem;
  border: 1.5px solid rgba(15,15,14,.12); background: #F4F2ED;
  font-family: 'Inter', sans-serif; font-size: .84rem; color: #0F0F0E;
  outline: none; transition: border-color .18s;
}
.bot-input:focus { border-color: #3B558F; background: #fff; }
.bot-input::placeholder { color: rgba(15,15,14,.3); }
.bot-send {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #1A3A8F, #3B558F); border: none;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
  box-shadow: 0 2px 10px rgba(59,85,143,.3);
}
.bot-send:hover { transform: scale(1.1); box-shadow: 0 4px 16px rgba(59,85,143,.4); }
.bot-send:disabled { opacity: .4; cursor: not-allowed; transform: none; box-shadow: none; }
.bot-send svg { width: 16px; height: 16px; }
`;

/* ── Types ── */
interface Msg {
  id: number;
  from: 'bot' | 'user';
  text: string;
  time: string;
}

const QUICK_CHIPS = [
  { label: '🛣️ Signaler', query: 'signaler' },
  { label: '🏛️ Horaires mairie', query: 'horaires' },
  { label: '🤝 Associations', query: 'association' },
  { label: '🚲 Aide vélo', query: 'vélo' },
  { label: '📋 Mes demandes', query: 'demande' },
];

function now() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getBotReply(input: string): string {
  const q = input.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  for (const key of Object.keys(BOT_RESPONSES)) {
    if (key !== 'default' && q.includes(key.normalize('NFD').replace(/[̀-ͯ]/g, ''))) {
      return BOT_RESPONSES[key];
    }
  }
  if (q.includes('transport') || q.includes('bus') || q.includes('metro') || q.includes('rer')) {
    return 'Pour les transports, consultez la page <strong>Transports</strong> dans le menu. Elle liste toutes les lignes et perturbations en temps réel.';
  }
  if (q.includes('dechet') || q.includes('poubelle') || q.includes('tri') || q.includes('toilet')) {
    return 'Retrouvez les calendriers de collecte et la localisation des toilettes publiques dans la section <strong>Déchets & Toilettes</strong>.';
  }
  if (q.includes('travaux') || q.includes('chantier')) {
    return 'La page <strong>Travaux</strong> liste tous les chantiers en cours et planifiés avec leur impact sur la circulation.';
  }
  if (q.includes('evenement') || q.includes('agenda') || q.includes('fete') || q.includes('concert')) {
    return 'Consultez la page <strong>Évènements</strong> pour l\'agenda complet : concerts, marchés, réunions publiques et bien plus.';
  }
  return BOT_RESPONSES['default'];
}

const WELCOME: Msg = {
  id: 0,
  from: 'bot',
  text: 'Bonjour ! Je suis <strong>MuniBot</strong>, votre assistant municipal. Je peux vous aider à signaler un problème, trouver les horaires ou naviguer dans les services. Comment puis-je vous aider ?',
  time: now(),
};

/* ── Component ── */
export const MuniBot: React.FC = () => {
  const { botOpen, toggleBot, user, pendingBotMsg, clearPendingBotMsg } = useApp();

  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = 'municipall-bot-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = css;
      document.head.appendChild(s);
    }
  }, []);

  /* Auto-scroll to bottom */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs, typing]);

  /* Handle pendingBotMsg from context */
  useEffect(() => {
    if (pendingBotMsg && botOpen) {
      sendMessage(pendingBotMsg);
      clearPendingBotMsg();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingBotMsg, botOpen]);

  /* Focus input when panel opens */
  useEffect(() => {
    if (botOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [botOpen]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const uid = Date.now();
    const userMsg: Msg = { id: uid, from: 'user', text: text.trim(), time: now() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const reply = getBotReply(text);
      setMsgs(prev => [...prev, { id: uid + 1, from: 'bot', text: reply, time: now() }]);
      setTyping(false);
    }, delay);
  }, []);

  const handleSend = () => sendMessage(input);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const initials = user ? (user.prenom[0] ?? '') + (user.nom[0] ?? '') : 'C';

  return (
    <>
      {/* Panel */}
      {botOpen && (
        <div className="bot-panel">
          {/* Header */}
          <div className="bot-header">
            <div className="bot-avatar">🏛️</div>
            <div className="bot-header-info">
              <div className="bot-header-name">MuniBot</div>
              <div className="bot-header-status">
                <span className="bot-online-dot" />
                Assistant municipal · En ligne
              </div>
            </div>
            <button className="bot-close-btn" onClick={toggleBot}>✕</button>
          </div>

          {/* Messages */}
          <div className="bot-messages" ref={listRef}>
            {msgs.map(m => (
              <div key={m.id} className={`bot-msg${m.from === 'user' ? ' user' : ''}`}>
                {m.from === 'bot'
                  ? <div className="bot-msg-avatar">🏛️</div>
                  : <div className="bot-msg-avatar user-av">{initials.toUpperCase()}</div>
                }
                <div>
                  <div
                    className="bot-bubble"
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />
                  <span className="bot-bubble-time">{m.time}</span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="bot-msg">
                <div className="bot-msg-avatar">🏛️</div>
                <div className="bot-bubble bot-typing">
                  <div className="bot-typing-dots">
                    <div className="bot-typing-dot" />
                    <div className="bot-typing-dot" />
                    <div className="bot-typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick chips */}
          <div className="bot-chips">
            {QUICK_CHIPS.map(c => (
              <button key={c.query} className="bot-chip" onClick={() => sendMessage(c.query)}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="bot-input-row">
            <input
              ref={inputRef}
              className="bot-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Posez votre question…"
              disabled={typing}
            />
            <button className="bot-send" onClick={handleSend} disabled={!input.trim() || typing}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

    </>
  );
};
