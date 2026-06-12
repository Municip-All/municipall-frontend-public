import apiClient from './apiClient';

export interface CityAssociation {
  id: string;
  name: string;
  category: 'association' | 'groupe-parole' | 'autre';
  description?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
}

export interface CityConfig {
  id?: string;
  name: string;
  officialName?: string;
  features: string[];
  contact?: { email?: string; phone?: string; helpText?: string };
  theme: {
    primaryColor: string;
    secondaryColor?: string;
    useGradient: boolean;
    logoUrl?: string;
  };
  wasteConfig?: {
    services: {
      type: string;
      icon: string;
      color: string;
      days: number[];
      time: string;
    }[];
  };
  isTransportFeatureAllowed?: boolean;
  isTransportFeatureEnabled?: boolean;
  associations?: CityAssociation[];
  publicProfile?: {
    mayorName?: string;
    welcomeText?: string;
    description?: string;
    address?: string;
    website?: string;
    openingHours?: string;
  };
  neighborhoods?: { id: string; name: string }[];
}

export const cityService = {
  getAllCities: async () => {
    const { data } = await apiClient.get<
      { id: string; name: string; officialName?: string; logoUrl?: string }[]
    >('city-config');
    return data;
  },

  getCityConfig: async (cityId: string): Promise<CityConfig> => {
    const { data } = await apiClient.get(`city-config/${encodeURIComponent(cityId)}`);
    return data;
  },

  detectCity: async (lat: number, lon: number): Promise<CityConfig | null> => {
    try {
      const { data } = await apiClient.get('city-config/detect', { params: { lat, lon } });
      return data;
    } catch {
      return null;
    }
  },
};
