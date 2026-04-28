import apiClient from './client';
import type { Employee, CreateEmployee } from '../types';
 
export const employeesApi = {
  getAll:  () => apiClient.get<Employee[]>("/employees").then(r => r.data),
  getById: (id: number) => apiClient.get<Employee>(`/employees/${id}`).then(r => r.data),
  create:  (dto: CreateEmployee) => apiClient.post<Employee>("/employees", dto).then(r => r.data),
  update:  (id: number, dto: CreateEmployee) => apiClient.put(`/employees/${id}`, dto),
  delete:  (id: number) => apiClient.delete(`/employees/${id}`),
};
