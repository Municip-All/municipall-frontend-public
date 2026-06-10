export const BACKOFFICE_URL_DEV = "https://dev.mairie.municipall.dev";
export const BACKOFFICE_URL_PROD = "https://mairie.municipall.dev";

/** URL du panel mairie — définie au build via NEXT_PUBLIC_BACKOFFICE_URL */
export function getBackofficeUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BACKOFFICE_URL ??
    (process.env.NODE_ENV === "development"
      ? BACKOFFICE_URL_DEV
      : BACKOFFICE_URL_PROD)
  );
}

/** Secours côté client si la variable n'a pas été injectée au build */
export function resolveBackofficeUrlFromHostname(hostname: string): string {
  if (process.env.NEXT_PUBLIC_BACKOFFICE_URL) {
    return process.env.NEXT_PUBLIC_BACKOFFICE_URL;
  }
  if (hostname.includes("dev.") || hostname === "localhost") {
    return BACKOFFICE_URL_DEV;
  }
  return BACKOFFICE_URL_PROD;
}
