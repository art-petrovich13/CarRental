import apiClient from './client';
import type { Summary, MonthData, StatusData, TopCar } from '../types';
 
export const reportsApi = {
  getSummary:        () => apiClient.get<Summary>("/reports/summary").then(r => r.data),
  getRentalsByMonth: () => apiClient.get<MonthData[]>("/reports/rentals-by-month").then(r => r.data),
  getRevenueByMonth: () => apiClient.get<MonthData[]>("/reports/revenue-by-month").then(r => r.data),
  getCarsByStatus:   () => apiClient.get<StatusData[]>("/reports/cars-by-status").then(r => r.data),
  getTopCars:        () => apiClient.get<TopCar[]>("/reports/top-cars").then(r => r.data),
};
