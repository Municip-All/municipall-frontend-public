import axios from 'axios';
import { Config } from '../config';

export interface PublicToilet {
  id: string;
  adresse: string;
  lat: number;
  lon: number;
}

export interface PublicWaterPoint {
  id: string;
  adresse: string;
  lat: number;
  lon: number;
  dispo: boolean;
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

export async function fetchWaterPoints(limit = 40): Promise<PublicWaterPoint[]> {
  const { data } = await axios.get<{ results: Record<string, unknown>[] }>(Config.PARIS_OPENDATA_WATER_API, {
    params: { limit },
    timeout: 10000,
  });

  const markers: PublicWaterPoint[] = [];
  data.results.forEach((record, index) => {
    const geo = record.geo_point_2d as { lat?: number; lon?: number } | undefined;
    let lat = geo?.lat;
    let lon = geo?.lon;
    if (lat == null || lon == null) {
      const shape = record.geo_shape as { geometry?: { coordinates?: [number, number] } } | undefined;
      if (shape?.geometry?.coordinates) {
        lon = shape.geometry.coordinates[0];
        lat = shape.geometry.coordinates[1];
      }
    }
    if (lat == null || lon == null) return;
    const voie = record.voie ? String(record.voie) : '';
    const commune = record.commune ? String(record.commune) : '';
    markers.push({
      id: `water-${String(record.gid ?? `${lat}-${lon}-${index}`)}`,
      adresse: [voie, commune].filter(Boolean).join(', ') || 'Adresse non disponible',
      lat,
      lon,
      dispo: String(record.dispo ?? 'OUI').toUpperCase() === 'OUI',
    });
  });
  return markers;
}
