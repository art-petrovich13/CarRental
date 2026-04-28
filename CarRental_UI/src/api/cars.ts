import apiClient from './client';
import type { Car, CreateCar, CarCategory } from '../types';
 
export const carsApi = {
  getAll:       ()                  => apiClient.get<Car[]>("/cars").then(r => r.data),
  getById:      (id: number)        => apiClient.get<Car>(`/cars/${id}`).then(r => r.data),
  create:       (dto: CreateCar)    => apiClient.post<Car>("/cars", dto).then(r => r.data),
  update:       (id: number, dto: CreateCar) => apiClient.put(`/cars/${id}`, dto),
  delete:       (id: number)        => apiClient.delete(`/cars/${id}`),
  getCategories:()                  => apiClient.get<CarCategory[]>("/carcategories").then(r => r.data),
};
