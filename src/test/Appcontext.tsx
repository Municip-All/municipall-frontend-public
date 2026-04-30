import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, ViewName, AuthView, Signalement } from '../types';
import api from '../services/api';

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  authView: AuthView;
  setAuthView: (v: AuthView) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: User, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => Promise<void>;

  // Navigation
  currentView: ViewName;
  showView: (v: ViewName) => void;

  // Signalements
  signalements: Signalement[];
  addSignalement: (s: Signalement) => void;

  // Toast
  toast: string;
  showToast: (msg: string) => void;

  // Bot
  botOpen: boolean;
  toggleBot: () => void;
  openBotWith: (msg: string) => void;
  pendingBotMsg: string;
  clearPendingBotMsg: () => void;

  // Notif drawer
  notifOpen: boolean;
  toggleNotif: () => void;
  closeNotif: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// No more fake stored users

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentView, setCurrentView] = useState<ViewName>('home');
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [toast, setToast] = useState('');
  const [botOpen, setBotOpen] = useState(false);
  const [pendingBotMsg, setPendingBotMsg] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const isAuthenticated = user !== null;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setAuthView('login');
    setCurrentView('home');
  }, []);

  const fetchMe = useCallback(async (token: string) => {
    try {
      const data = await api.get('/auth/me', token);
      if (data && !data.error) {
        setUser(data);
      } else {
        logout();
      }
    } catch (e) {
      logout();
    }
  }, [logout]);

  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchMe(token);
    }
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data && data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
        await fetchMe(data.access_token);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, [fetchMe]);

  const register = useCallback(async (newUser: any, password: string) => {
    try {
      const data = await api.post('/auth/signup', { ...newUser, password });
      if (data && data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
        await fetchMe(data.access_token);
      }
    } catch (e) {
      console.error(e);
    }
  }, [fetchMe]);


  const updateUser = useCallback(async (partial: Partial<User>) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const data = await api.post('/users/profile', partial, token);
      if (data && !data.error) {
        setUser(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);

  const showView = useCallback((v: ViewName) => {
    setCurrentView(v);
    closeNotif();
  }, [closeNotif]);

  const addSignalement = useCallback((s: Signalement) => {
    setSignalements(((prev: any) => [s, ...prev]));
  }, []);

  const toggleBot = useCallback(() => setBotOpen(p => !p), []);
  const openBotWith = useCallback((msg: string) => {
    setBotOpen(true);
    setPendingBotMsg(msg);
  }, []);
  const clearPendingBotMsg = useCallback(() => setPendingBotMsg(''), []);

  const toggleNotif = useCallback(() => setNotifOpen(p => !p), []);

  return (
    <AppContext.Provider value={{
      user, isAuthenticated, authView, setAuthView,
      login, register, logout, updateUser,
      currentView, showView,
      signalements, addSignalement,
      toast, showToast,
      botOpen, toggleBot, openBotWith, pendingBotMsg, clearPendingBotMsg,
      notifOpen, toggleNotif, closeNotif,
    }}>
      {children}
    </AppContext.Provider>
  );
};