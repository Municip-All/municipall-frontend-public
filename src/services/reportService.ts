import apiClient from './apiClient';

export interface ApiReport {
  id?: number;
  category: string;
  description?: string;
  imageUrl?: string;
  lat: number;
  lon: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

function mapReport(r: Record<string, unknown>): ApiReport {
  const location = r.location as { coordinates?: number[] } | undefined;
  return {
    id: typeof r.id === 'number' ? r.id : undefined,
    category: String(r.category ?? ''),
    description: typeof r.description === 'string' ? r.description : undefined,
    imageUrl: typeof r.imageUrl === 'string' ? r.imageUrl : undefined,
    lat: location?.coordinates?.[1] ?? Number(r.lat ?? 0),
    lon: location?.coordinates?.[0] ?? Number(r.lon ?? 0),
    status: String(r.status ?? 'En attente'),
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : undefined,
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : undefined,
  };
}

export const reportService = {
  getReports: async (): Promise<ApiReport[]> => {
    const { data } = await apiClient.get('reports/mine');
    return (data as Record<string, unknown>[]).map(mapReport);
  },
};
