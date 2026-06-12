/** API dev par défaut — y compris builds prod / branche main */
export const DEV_API_ORIGIN = 'https://dev.api.municipall.dev';
export const DEV_API_BASE_URL = `${DEV_API_ORIGIN}/api/v1/`;

/** Normalise toute URL vers …/api/v1/ (évite les 401 si /api/v1 manque) */
export function normalizeApiBaseUrl(raw?: string): string {
  const fallback = DEV_API_BASE_URL;
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
