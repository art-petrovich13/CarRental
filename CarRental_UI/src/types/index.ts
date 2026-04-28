// Car 
export interface CarCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  dailyRate: number;
  status: "available" | "rented" | "maintenance";
  categoryId: number;
  categoryName: string;
}

export type CreateCar = Omit<Car, "id" | "categoryName">;

// Client
export interface Client {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  passportNumber: string;
  driverLicense: string;
  createdAt: string;
  rentalsCount: number;
}

export type CreateClient = Omit<Client, "id" | "createdAt" | "rentalsCount">;

// Employee 
export interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  hireDate: string;
}

export type CreateEmployee = Omit<Employee, "id">;

// Rental
export interface Rental {
  id: number;
  carId: number;
  carName: string;
  carPlate: string;
  clientId: number;
  clientName: string;
  employeeId: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  actualReturnDate?: string;
  totalCost: number;
  status: "active" | "completed" | "cancelled";
}

export interface CreateRental {
  carId: number;
  clientId: number;
  employeeId: number;
  startDate: string;
  endDate: string;
}

// Reports
export interface Summary {
  totalCars: number;
  availableCars: number;
  rentedCars: number;
  completedRental: number;
  totalClients: number;
  activeRentals: number;
  totalRevenue: number;
  monthRevenue: number;
}

export interface MonthData {
  year: number;
  month: number;
  count?: number;
  revenue?: number;
  label?: string;
}

export interface StatusData {
  status: string;
  count: number;
}

export interface TopCar {
  carName: string;
  count: number;
}

export interface Payment {
  id: number;
  rentalId: number;
  clientName: string;
  carName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'online';
}

export interface CreatePayment {
  rentalId: number;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'online';
}

export interface MaintenanceRecord {
  id: number;
  carId: number;
  carName: string;
  plateNumber: string;
  description: string;
  mechanicName: string;
  startDate: string;
  endDate?: string;
  cost: number;
  status: 'in_progress' | 'completed';
}

export interface CreateMaintenanceRecord {
  carId: number;
  description: string;
  mechanicName: string;
  startDate: string;
  cost: number;
}

export interface UpdateMaintenanceRecord {
  description: string;
  mechanicName: string;
  endDate?: string;
  cost: number;
  status: 'in_progress' | 'completed';
}