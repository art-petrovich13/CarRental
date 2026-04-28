import apiClient from './client';
import type { Payment, CreatePayment } from '../types';

export const paymentsApi = {
  getAll:  () => apiClient.get('/payments').then(r => r.data),
  getById: (id: number) => apiClient.get(`/payments/${id}`).then(r => r.data),
  create:  (dto: CreatePayment) => apiClient.post('/payments', dto).then(r => r.data),
  delete:  (id: number) => apiClient.delete(`/payments/${id}`),
};