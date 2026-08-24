const DEV_API_ORIGIN = 'https://dev.api.municipall.dev';
const DEV_API_BASE_URL = `${DEV_API_ORIGIN}/api/v1/`;

const PROD_API_ORIGIN = 'https://api.municipall.dev';
const PROD_API_BASE_URL = `${PROD_API_ORIGIN}/api/v1/`;

function getDefaultApiBaseUrl(): string {
  if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL) {
    return PROD_API_BASE_URL;
  }
  return DEV_API_BASE_URL;
}

export function normalizeApiBaseUrl(raw?: string): string {
  const fallback = getDefaultApiBaseUrl();
  if (!raw?.trim()) return fallback;

  let url = raw.trim().replace(/\/+$/, '');
  if (url.endsWith('/api/v1')) return `${url}/`;
  if (url.endsWith('/api')) return `${url}/v1/`;
  if (!url.includes('/api/v1')) return `${url}/api/v1/`;
  return `${url}/`;
}

export const Config = {
  API_BASE_URL: normalizeApiBaseUrl(process.env.REACT_APP_API_URL),
  DEFAULT_TENANT_ID: process.env.REACT_APP_DEFAULT_TENANT_ID || 'le-kremlin-bicetre',
};
