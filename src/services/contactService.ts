import apiClient from './apiClient';

export const contactService = {
  createTicket: async (payload: {
    subject: string;
    body: string;
    ticketType?: 'question' | 'suggestion';
  }) => {
    const { data } = await apiClient.post('contact-tickets', payload);
    return data;
  },
};
