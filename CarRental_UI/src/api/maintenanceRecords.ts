import apiClient from './client';
import type { MaintenanceRecord, CreateMaintenanceRecord, UpdateMaintenanceRecord } from '../types';

export const maintenanceApi = {
    getAll: () => apiClient.get('/maintenancerecords').then(r => r.data),
    getById: (id: number) => apiClient.get(`/maintenancerecords/${id}`).then(r => r.data),
    create: (dto: CreateMaintenanceRecord) => apiClient.post('/maintenancerecords', dto).then(r => r.data),
    update: (id: number, dto: UpdateMaintenanceRecord) => apiClient.put(`/maintenancerecords/${id}`, dto),
    complete: (id: number) => apiClient.patch(`/maintenancerecords/${id}/complete`),
    delete: (id: number) => apiClient.delete(`/maintenancerecords/${id}`),
};