import apiClient from './apiClient';

export interface TransportLineDisruption {
  lineId: string;
  lineName: string;
  mode: string;
  status: 'normal' | 'disrupted';
  messages: string[];
}

export interface TransportDisruptionsResponse {
  lines: TransportLineDisruption[];
  stops: unknown[];
  fetchedAt: string;
}

export const transportService = {
  getDisruptions: async (
    cityId: string,
    lat: number,
    lon: number
  ): Promise<TransportDisruptionsResponse> => {
    const { data } = await apiClient.get(
      `municipalities/${encodeURIComponent(cityId)}/transports/disruptions`,
      { params: { lat, lon }, timeout: 30000 }
    );
    return data;
  },
};
