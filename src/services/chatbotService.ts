import axios from 'axios';

const DEFAULT_IA_BASE_URL = 'http://localhost:8000';

function normalizeIaBaseUrl(raw?: string): string {
  const url = raw?.trim();
  if (!url) return DEFAULT_IA_BASE_URL;
  return url.replace(/\/+$/, '');
}

export const IA_BASE_URL = normalizeIaBaseUrl(process.env.REACT_APP_IA_URL);

export interface CitoyenChatResponse {
  reply: string;
  category: string;
  municipal_service: string;
  sentiment_score: number;
  reassured: boolean;
}

export const CITIZEN_CHAT_MAX_LENGTH = 5000;

function createSessionUserId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let sessionUserId: string | null = null;

export function getSessionUserId(): string {
  if (!sessionUserId) {
    sessionUserId = createSessionUserId();
  }
  return sessionUserId;
}

const chatbotClient = axios.create({
  baseURL: IA_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatbotService = {
  sendCitoyenMessage: async (message: string): Promise<CitoyenChatResponse> => {
    const trimmed = message.trim();
    if (!trimmed) {
      throw new Error('Message vide');
    }
    const response = await chatbotClient.post<CitoyenChatResponse>('/reporting/chat/citoyen', {
      user_id: getSessionUserId(),
      message: trimmed.slice(0, CITIZEN_CHAT_MAX_LENGTH),
    });
    return response.data;
  },
};
