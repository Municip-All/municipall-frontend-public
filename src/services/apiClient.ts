import axios from 'axios';
import { Config } from '../config';

const TOKEN_KEY = 'municipall_token';
const TENANT_KEY = 'municipall_tenant_id';

let activeTenantId = Config.DEFAULT_TENANT_ID;

export function setApiTenantId(tenantId: string) {
  activeTenantId = tenantId;
  localStorage.setItem(TENANT_KEY, tenantId);
}

export function getApiTenantId(): string {
  return activeTenantId;
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (typeof payload.exp !== 'number') return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return false;
  }
}

export function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return token;
}

export function setStoredToken(token: string | null) {
  if (token) {
    if (isTokenExpired(token)) return;
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

const storedTenant = localStorage.getItem(TENANT_KEY);
if (storedTenant) activeTenantId = storedTenant;

const apiClient = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  config.headers['x-tenant-id'] = activeTenantId;
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRedirecting = false;

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      setStoredToken(null);
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
