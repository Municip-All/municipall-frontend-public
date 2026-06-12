/** Toujours l'API dev par défaut (y compris builds prod) — surcharge via REACT_APP_API_URL */
export const Config = {
  API_BASE_URL:
    process.env.REACT_APP_API_URL?.replace(/\/?$/, '/') ||
    'https://dev.api.municipall.dev/api/v1/',
  DEFAULT_TENANT_ID: process.env.REACT_APP_DEFAULT_TENANT_ID || 'le-kremlin-bicetre',
};
