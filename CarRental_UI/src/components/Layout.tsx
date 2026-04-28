import { Outlet } from 'react-router-dom';
import Header from './Header.tsx';
export default function Layout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f5f7',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <main style={{ flex: 1, width: '100%' }}>
        <div style={{ padding: '2rem 2.5rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}