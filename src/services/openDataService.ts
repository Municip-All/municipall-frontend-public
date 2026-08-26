import axios from 'axios';
import { Config } from '../config';

export interface PublicToilet {
  id: string;
  adresse: string;
  lat: number;
  lon: number;
}

export async function fetchPublicToilets(limit = 40): Promise<PublicToilet[]> {
  const { data } = await axios.get<{ results: Record<string, unknown>[] }>(Config.PARIS_OPENDATA_API, {
    params: { limit },
    timeout: 10000,
  });

  const markers: PublicToilet[] = [];
  data.results.forEach((record, index) => {
    const geo = record.geo_point_2d as { lat?: number; lon?: number } | undefined;
    if (geo?.lat == null || geo?.lon == null) return;
    markers.push({
      id: `toilet-${geo.lat}-${geo.lon}-${index}`,
      adresse: String(record.adresse || 'Adresse non disponible'),
      lat: geo.lat,
      lon: geo.lon,
    });
  });
  return markers;
}
