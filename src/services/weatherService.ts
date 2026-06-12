import apiClient from './apiClient';

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
}

export const weatherService = {
  getWeather: async (lat: number, lon: number): Promise<WeatherData> => {
    const { data } = await apiClient.get('weather', { params: { lat, lon } });
    return data;
  },
};
