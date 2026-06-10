"use client";

import { useSyncExternalStore } from "react";
import {
  getBackofficeUrl,
  resolveBackofficeUrlFromHostname,
} from "@/lib/backoffice";

function getClientUrl(): string {
  if (process.env.NEXT_PUBLIC_BACKOFFICE_URL) {
    return process.env.NEXT_PUBLIC_BACKOFFICE_URL;
  }
  return resolveBackofficeUrlFromHostname(window.location.hostname);
}

export function useBackofficeUrl(): string {
  return useSyncExternalStore(
    () => () => {},
    getClientUrl,
    getBackofficeUrl,
  );
}
