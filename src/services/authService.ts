import apiClient, { setStoredToken, setApiTenantId } from './apiClient';

export interface ApiUser {
  id: number;
  email: string;
  name: string;
  surname?: string;
  role: string;
  phone?: string;
  cityId?: string;
  neighborhood?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  access_token: string;
  user: ApiUser;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('auth/login', { email, password });
    setStoredToken(data.access_token);
    if (data.user.cityId) setApiTenantId(data.user.cityId);
    return data;
  },

  signup: async (payload: {
    name: string;
    surname?: string;
    email: string;
    password: string;
    phone?: string;
    cityId?: string;
  }): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('auth/signup', payload);
    setStoredToken(data.access_token);
    if (data.user.cityId) setApiTenantId(data.user.cityId);
    return data;
  },

  me: async (): Promise<ApiUser & { permissions?: string[] }> => {
    const { data } = await apiClient.get('auth/me');
    return data;
  },

  logout: () => {
    setStoredToken(null);
  },
};
