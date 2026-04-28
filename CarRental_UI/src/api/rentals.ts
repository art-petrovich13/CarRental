import apiClient from './client';
import type { Rental, CreateRental } from '../types';
 
export const rentalsApi = {
  getAll:   () => apiClient.get<Rental[]>("/rentals").then(r => r.data),
  getById:  (id: number) => apiClient.get<Rental>(`/rentals/${id}`).then(r => r.data),
  create:   (dto: CreateRental) => apiClient.post<Rental>("/rentals", dto).then(r => r.data),
  complete: (id: number) => apiClient.patch(`/rentals/${id}/complete`),
  cancel:   (id: number) => apiClient.patch(`/rentals/${id}/cancel`),
};
