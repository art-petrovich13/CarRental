import apiClient from './client';
import type { Client, CreateClient } from '../types';
 
export const clientsApi = {
  getAll:  () => apiClient.get<Client[]>("/clients").then(r => r.data),
  getById: (id: number) => apiClient.get<Client>(`/clients/${id}`).then(r => r.data),
  create:  (dto: CreateClient) => apiClient.post<Client>("/clients", dto).then(r => r.data),
  update:  (id: number, dto: CreateClient) => apiClient.put(`/clients/${id}`, dto),
  delete:  (id: number) => apiClient.delete(`/clients/${id}`),
};
