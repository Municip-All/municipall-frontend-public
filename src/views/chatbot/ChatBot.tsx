import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { chatbotService } from '../../services/chatbotService';
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

const ERROR_TEXT = 'Le service est momentanément indisponible. Veuillez réessayer.';

function now() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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
  const [errorVisible, setErrorVisible] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFailedRef = useRef<string | null>(null);
  const requestSeqRef = useRef(0);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs, typing, errorVisible]);

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
      lastFailedRef.current = null;
      requestSeqRef.current += 1;
    };
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const seq = requestSeqRef.current + 1;
    requestSeqRef.current = seq;
    const uid = Date.now();
    const userMsg: Msg = { id: uid, from: 'user', text: trimmed, time: now() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setErrorVisible(false);
    lastFailedRef.current = trimmed;
    try {
      const response = await chatbotService.sendCitoyenMessage(trimmed);
      if (requestSeqRef.current !== seq) return;
      setMsgs(prev => [...prev, { id: uid + 1, from: 'bot', text: response.reply, time: now() }]);
      lastFailedRef.current = null;
    } catch {
      if (requestSeqRef.current !== seq) return;
      setErrorVisible(true);
    } finally {
      if (requestSeqRef.current === seq) {
        setTyping(false);
      }
    }
  }, []);

  const handleRetry = useCallback(() => {
    const failed = lastFailedRef.current;
    if (failed) void sendMessage(failed);
  }, [sendMessage]);

  const handleSend = () => { void sendMessage(input); };
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const initials = user ? (user.prenom[0] ?? '') + (user.nom[0] ?? '') : 'C';

  return (
    <>
      <button
        type="button"
        className={`bot-fab${botOpen ? ' bot-fab--open' : ''}`}
        onClick={toggleBot}
        aria-label={botOpen ? 'Fermer l\'assistant MuniBot' : 'Ouvrir l\'assistant MuniBot'}
        title="Assistant MuniBot"
      >
        {botOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        )}
      </button>
      {botOpen && (
        <div className="bot-panel" role="dialog" aria-label="Assistant MuniBot">
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
                <div className="bot-msg-body">
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

            {errorVisible && (
              <div className="bot-msg">
                <div className="bot-msg-avatar bot-msg-avatar--error">!</div>
                <div className="bot-msg-body">
                  <div className="bot-bubble bot-bubble--error">
                    <span>{ERROR_TEXT}</span>
                    <button type="button" className="bot-retry" onClick={handleRetry}>
                      Réessayer
                    </button>
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
              maxLength={5000}
              disabled={typing}
              aria-label="Votre message à l'assistant municipal"
            />
            <button className="bot-send" onClick={handleSend} disabled={!input.trim() || typing} aria-label="Envoyer">
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
