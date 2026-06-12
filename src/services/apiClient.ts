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

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
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

export default apiClient;
