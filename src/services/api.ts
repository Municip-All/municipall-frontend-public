const API_URL = (process.env.REACT_APP_API_URL || 'https://dev.api.municipall.dev') + '/api/v1';

export const api = {
  baseUrl: API_URL,
  
  async get(endpoint: string, token?: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  async post(endpoint: string, data: any, token?: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  // Add other methods (patch, delete) as needed
};

export default api;
