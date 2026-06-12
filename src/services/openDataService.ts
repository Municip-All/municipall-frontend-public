import axios from 'axios';

const PARIS_API =
  'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/sanisettesparis/records';

export interface PublicToilet {
  id: string;
  adresse: string;
  lat: number;
  lon: number;
}

export async function fetchPublicToilets(limit = 40): Promise<PublicToilet[]> {
  const { data } = await axios.get<{ results: Record<string, unknown>[] }>(PARIS_API, {
    params: { limit },
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
