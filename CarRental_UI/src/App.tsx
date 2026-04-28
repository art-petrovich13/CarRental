import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage  from './pages/DashboardPage';
import CarsPage       from './pages/CarsPage';
import ClientsPage    from './pages/ClientsPage';
import RentalsPage    from './pages/RentalsPage';
import EmployeesPage  from './pages/EmployeesPage';
import PaymentsPage from './pages/PaymentsPage';
import MaintenancePage  from './pages/MaintenancePage';
 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="cars"      element={<CarsPage />} />
          <Route path="clients"   element={<ClientsPage />} />
          <Route path="rentals"   element={<RentalsPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="payments"   element={<PaymentsPage />} />
          <Route path="maintenance"   element={<MaintenancePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
