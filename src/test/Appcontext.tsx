import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { User, ViewName, AuthView, Signalement, Evenement, Association } from '../types';
import { Config } from '../config';
import { setApiTenantId, getStoredToken } from '../services/apiClient';
import { authService } from '../services/authService';
import { cityService, type CityConfig } from '../services/cityService';
import { reportService } from '../services/reportService';
import { eventService } from '../services/eventService';
import { transportService } from '../services/transportService';
import { constructionWorksService } from '../services/constructionWorksService';
import { weatherService } from '../services/weatherService';
import { fetchPublicToilets } from '../services/openDataService';
import {
  mapApiUserToUser,
  mapReportToSignalement,
  mapEventToEvenement,
  mapAssociation,
  mapConstructionWork,
  mapTransportLine,
  mapWasteServices,
  mapToilet,
  toiletsToMapPoints,
  mapWeather,
  eventToHomePreview,
  transportToAlerts,
  type TravauxItem,
  type TransportLigne,
  type CollecteRow,
  type ToiletRow,
  type MapPoint,
  type HomeWeather,
  type HomeEventPreview,
  type AlertTicker,
} from '../lib/mappers';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isDataLoading: boolean;
  authView: AuthView;
  setAuthView: (v: AuthView) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: User, password: string, cityId?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;

  tenantId: string;
  cityConfig: CityConfig | null;
  availableCities: { id: string; name: string; officialName?: string }[];

  currentView: ViewName;
  showView: (v: ViewName) => void;

  signalements: Signalement[];
  addSignalement: (s: Signalement) => void;
  events: Evenement[];
  associations: Association[];
  travaux: TravauxItem[];
  transportLines: TransportLigne[];
  collecteSchedule: CollecteRow[];
  toilets: ToiletRow[];
  mapPoints: MapPoint[];
  mapCenter: [number, number];
  weather: HomeWeather | null;
  homeEventPreviews: HomeEventPreview[];
  alerts: AlertTicker[];

  refreshData: () => Promise<void>;

  toast: string;
  showToast: (msg: string) => void;

  botOpen: boolean;
  toggleBot: () => void;
  openBotWith: (msg: string) => void;
  pendingBotMsg: string;
  clearPendingBotMsg: () => void;

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

const DEFAULT_CENTER: [number, number] = [48.8141, 2.3611];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentView, setCurrentView] = useState<ViewName>('home');
  const [tenantId, setTenantId] = useState(Config.DEFAULT_TENANT_ID);
  const [cityConfig, setCityConfig] = useState<CityConfig | null>(null);
  const [availableCities, setAvailableCities] = useState<
    { id: string; name: string; officialName?: string }[]
  >([]);

  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [events, setEvents] = useState<Evenement[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [travaux, setTravaux] = useState<TravauxItem[]>([]);
  const [transportLines, setTransportLines] = useState<TransportLigne[]>([]);
  const [collecteSchedule, setCollecteSchedule] = useState<CollecteRow[]>([]);
  const [toilets, setToilets] = useState<ToiletRow[]>([]);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [weather, setWeather] = useState<HomeWeather | null>(null);
  const [homeEventPreviews, setHomeEventPreviews] = useState<HomeEventPreview[]>([]);
  const [alerts, setAlerts] = useState<AlertTicker[]>([]);

  const [toast, setToast] = useState('');
  const [botOpen, setBotOpen] = useState(false);
  const [pendingBotMsg, setPendingBotMsg] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const isAuthenticated = user !== null;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  const loadPublicData = useCallback(
    async (cityId: string, coords: [number, number] = DEFAULT_CENTER) => {
      setIsDataLoading(true);
      try {
        const config = await cityService.getCityConfig(cityId);
        setCityConfig(config);
        setApiTenantId(cityId);
        setTenantId(cityId);

        const [eventsData, worksData, toiletsData] = await Promise.all([
          eventService.getEvents().catch(() => []),
          constructionWorksService.getWorks().catch(() => []),
          fetchPublicToilets(30).catch(() => []),
        ]);

        const mappedEvents = eventsData.map(mapEventToEvenement);
        setEvents(mappedEvents);
        setHomeEventPreviews(mappedEvents.slice(0, 3).map(eventToHomePreview));
        setTravaux(worksData.map(mapConstructionWork));
        setAssociations((config.associations ?? []).map(mapAssociation));
        setCollecteSchedule(mapWasteServices(config));
        setToilets(toiletsData.map(mapToilet));
        setMapPoints(toiletsToMapPoints(toiletsData));
        setMapCenter(coords);

        const transportOn =
          config.isTransportFeatureAllowed && config.isTransportFeatureEnabled;
        let lines: TransportLigne[] = [];
        if (transportOn) {
          try {
            const t = await transportService.getDisruptions(cityId, coords[0], coords[1]);
            lines = (t.lines ?? []).map(mapTransportLine);
          } catch (e) {
            console.warn('Transport fetch failed', e);
          }
        }
        setTransportLines(lines);
        setAlerts(
          transportToAlerts(lines).length
            ? transportToAlerts(lines)
            : [{ text: config.publicProfile?.welcomeText || 'Bienvenue sur Municip\'All', badge: 'info' }]
        );

        if (config.features?.includes('weather')) {
          try {
            const w = await weatherService.getWeather(coords[0], coords[1]);
            setWeather(mapWeather(w));
          } catch {
            setWeather(null);
          }
        } else {
          setWeather(null);
        }
      } catch (error) {
        console.error('loadPublicData failed', error);
      } finally {
        setIsDataLoading(false);
      }
    },
    []
  );

  const loadUserReports = useCallback(async () => {
    try {
      const reports = await reportService.getReports();
      setSignalements(reports.map(mapReportToSignalement));
    } catch (error) {
      console.error('loadUserReports failed', error);
      setSignalements([]);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await loadPublicData(tenantId, mapCenter);
    if (getStoredToken()) await loadUserReports();
  }, [loadPublicData, loadUserReports, tenantId, mapCenter]);

  useEffect(() => {
    const init = async () => {
      try {
        const cities = await cityService.getAllCities();
        setAvailableCities(cities);

        let cityId = Config.DEFAULT_TENANT_ID;
        let coords = DEFAULT_CENTER;

        if (navigator.geolocation) {
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
            });
            coords = [pos.coords.latitude, pos.coords.longitude];
            const detected = await cityService.detectCity(coords[0], coords[1]);
            if (detected?.id) cityId = detected.id;
          } catch {
            // fallback default city
          }
        }

        await loadPublicData(cityId, coords);

        const token = getStoredToken();
        if (token) {
          try {
            const me = await authService.me();
            const cfg = await cityService.getCityConfig(me.cityId || cityId);
            if (me.cityId) {
              setApiTenantId(me.cityId);
              setTenantId(me.cityId);
            }
            setUser(mapApiUserToUser(me, cfg.officialName || cfg.name));
            await loadUserReports();
          } catch {
            authService.logout();
          }
        }
      } catch (error) {
        console.error('App init failed', error);
      } finally {
        setIsAuthLoading(false);
      }
    };
    void init();
  }, [loadPublicData, loadUserReports]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const { user: apiUser } = await authService.login(email, password);
        const cityId = apiUser.cityId || tenantId;
        const cfg = await cityService.getCityConfig(cityId);
        setUser(mapApiUserToUser(apiUser, cfg.officialName || cfg.name));
        setApiTenantId(cityId);
        setTenantId(cityId);
        await loadPublicData(cityId, mapCenter);
        await loadUserReports();
        return true;
      } catch {
        return false;
      }
    },
    [tenantId, mapCenter, loadPublicData, loadUserReports]
  );

  const register = useCallback(
    async (newUser: User, password: string, cityId?: string): Promise<boolean> => {
      try {
        const resolvedCityId =
          cityId ||
          availableCities.find(
            (c) =>
              c.officialName === newUser.ville ||
              c.name === newUser.ville ||
              c.id === newUser.ville
          )?.id ||
          tenantId;

        const { user: apiUser } = await authService.signup({
          name: newUser.prenom,
          surname: newUser.nom,
          email: newUser.email,
          password,
          phone: newUser.telephone,
          cityId: resolvedCityId,
        });

        const cfg = await cityService.getCityConfig(resolvedCityId);
        setUser(mapApiUserToUser(apiUser, cfg.officialName || cfg.name));
        setApiTenantId(resolvedCityId);
        setTenantId(resolvedCityId);
        await loadPublicData(resolvedCityId, mapCenter);
        return true;
      } catch {
        return false;
      }
    },
    [availableCities, tenantId, mapCenter, loadPublicData]
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setSignalements([]);
    setAuthView('login');
    setCurrentView('home');
  }, []);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  const showView = useCallback((v: ViewName) => {
    setCurrentView(v);
    setNotifOpen(false);
  }, []);

  const addSignalement = useCallback((s: Signalement) => {
    setSignalements((prev) => [s, ...prev]);
  }, []);

  const toggleBot = useCallback(() => setBotOpen((p) => !p), []);
  const openBotWith = useCallback((msg: string) => {
    setBotOpen(true);
    setPendingBotMsg(msg);
  }, []);
  const clearPendingBotMsg = useCallback(() => setPendingBotMsg(''), []);

  const toggleNotif = useCallback(() => setNotifOpen((p) => !p), []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        isDataLoading,
        authView,
        setAuthView,
        login,
        register,
        logout,
        updateUser,
        tenantId,
        cityConfig,
        availableCities,
        currentView,
        showView,
        signalements,
        addSignalement,
        events,
        associations,
        travaux,
        transportLines,
        collecteSchedule,
        toilets,
        mapPoints,
        mapCenter,
        weather,
        homeEventPreviews,
        alerts,
        refreshData,
        toast,
        showToast,
        botOpen,
        toggleBot,
        openBotWith,
        pendingBotMsg,
        clearPendingBotMsg,
        notifOpen,
        toggleNotif,
        closeNotif,
      }}>
      {children}
    </AppContext.Provider>
  );
};
