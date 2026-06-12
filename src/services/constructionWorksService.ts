import apiClient from './apiClient';

export interface ApiConstructionWork {
  id: number;
  title: string;
  description?: string;
  locationName: string;
  startDate: string;
  endDate: string;
  status: string;
  impactType?: string;
}

export const constructionWorksService = {
  getWorks: async (): Promise<ApiConstructionWork[]> => {
    const { data } = await apiClient.get('construction-works');
    return data;
  },
};
