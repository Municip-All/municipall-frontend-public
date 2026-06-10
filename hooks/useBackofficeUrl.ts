"use client";

import { useEffect, useState } from "react";
import {
  getBackofficeUrl,
  resolveBackofficeUrlFromHostname,
} from "@/lib/backoffice";

export function useBackofficeUrl(): string {
  const [url, setUrl] = useState(getBackofficeUrl);

  useEffect(() => {
    setUrl(resolveBackofficeUrlFromHostname(window.location.hostname));
  }, []);

  return url;
}
