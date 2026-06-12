import apiClient from './apiClient';

export interface ApiEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  category: string;
  imageUrl?: string;
}

export const eventService = {
  getEvents: async (): Promise<ApiEvent[]> => {
    const { data } = await apiClient.get('events');
    return data;
  },
};
