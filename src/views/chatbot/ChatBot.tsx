import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { BOT_RESPONSES } from '../../data';
import DOMPurify from 'dompurify';
import './ChatBot.scss';

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

export const MuniBot: React.FC = () => {
  const { botOpen, toggleBot, user, pendingBotMsg, clearPendingBotMsg } = useApp();

  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs, typing]);

  useEffect(() => {
    if (pendingBotMsg && botOpen) {
      sendMessage(pendingBotMsg);
      clearPendingBotMsg();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingBotMsg, botOpen]);

  useEffect(() => {
    if (botOpen) {
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      focusTimerRef.current = setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [botOpen]);

  useEffect(() => {
    return () => {
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    };
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const uid = Date.now();
    const userMsg: Msg = { id: uid, from: 'user', text: text.trim(), time: now() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 800 + Math.random() * 600;
    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    replyTimerRef.current = setTimeout(() => {
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
      {botOpen && (
        <div className="bot-panel">
          <div className="bot-header">
            <div className="bot-avatar">🏛️</div>
            <div className="bot-header-info">
              <div className="bot-header-name">MuniBot</div>
              <div className="bot-header-status">
                <span className="bot-online-dot" />
                Assistant municipal · En ligne
              </div>
            </div>
            <button className="bot-close-btn" onClick={toggleBot} aria-label="Fermer">✕</button>
          </div>

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
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(m.text) }}
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

          <div className="bot-chips">
            {QUICK_CHIPS.map(c => (
              <button key={c.query} className="bot-chip" onClick={() => sendMessage(c.query)}>
                {c.label}
              </button>
            ))}
          </div>

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
