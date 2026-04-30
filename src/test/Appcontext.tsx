import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, ViewName, AuthView, Signalement } from '../types';
import { DEMO_SIGNALEMENTS } from '../data';

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  authView: AuthView;
  setAuthView: (v: AuthView) => void;
  login: (email: string, password: string) => boolean;
  register: (user: User, password: string) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;

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

// Fake stored users (in-memory)
const storedUsers: Array<{ user: User; password: string }> = [
  {
    user: {
      prenom: 'Marie', nom: 'Beaumont',
      email: 'marie.beaumont@email.fr',
      telephone: '06 12 34 56 78',
      dateNaissance: '1985-06-14',
      rue: '12 Rue Pasteur',
      codePostal: '94270',
      ville: 'Kremlin-Bicêtre',
      quartier: 'Paul Hochart',
      avatar: 'MB',
    },
    password: 'demo1234',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentView, setCurrentView] = useState<ViewName>('home');
  const [signalements, setSignalements] = useState<Signalement[]>(DEMO_SIGNALEMENTS);
  const [toast, setToast] = useState('');
  const [botOpen, setBotOpen] = useState(false);
  const [pendingBotMsg, setPendingBotMsg] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const isAuthenticated = user !== null;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const found = storedUsers.find(u => u.user.email === email && u.password === password);
    if (found) { setUser(found.user); return true; }
    return false;
  }, []);

  const register = useCallback((newUser: User, password: string) => {
    storedUsers.push({ user: newUser, password });
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthView('login');
    setCurrentView('home');
  }, []);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev: User | null) => prev ? { ...prev, ...partial } : prev);
  }, []);

  const showView = useCallback((v: ViewName) => {
    setCurrentView(v);
    closeNotif();
  }, []);

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
  const closeNotif = useCallback(() => setNotifOpen(false), []);

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