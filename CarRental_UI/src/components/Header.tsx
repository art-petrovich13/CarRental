import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  ClipboardList,
  UserCircle,
  Gauge,
  CreditCard,
  Wrench
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Дашборд' },
  { to: '/cars', icon: Car, label: 'Автомобили' },
  { to: '/clients', icon: Users, label: 'Клиенты' },
  { to: '/rentals', icon: ClipboardList, label: 'Аренды' },
  { to: '/employees', icon: UserCircle, label: 'Сотрудники' },
  { to: '/payments',    icon: CreditCard,      label: 'Платежи'    },  
  { to: '/maintenance', icon: Wrench,          label: 'Ремонт'     },
];

export default function Header() {
  return (
    <header
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(14,165,233,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* Top accent line – небесный градиент */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #0ea5e9, #06b6d4, #0ea5e9, transparent)',
        }}
      />
      <div
        style={{
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          height: '68px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(14,165,233,0.4)',
            }}
          >
            <Gauge size={22} color="#1a1a2e" strokeWidth={2.5} />
          </div>
          <div>
            <p
              style={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '17px',
                letterSpacing: '0.02em',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              CarRental
            </p>
            <p
              style={{
                color: '#0ea5e980', // небесный с полупрозрачностью
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              Система проката
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '14px',
            padding: '5px',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '0.01em',
                  transition: 'all 0.2s ease',
                  color: isActive ? '#1a1a2e' : 'rgba(255,255,255,0.65)',
                  background: isActive
                    ? 'linear-gradient(135deg, #0ea5e9, #06b6d4)'
                    : 'transparent',
                  boxShadow: isActive ? '0 4px 14px rgba(14,165,233,0.35)' : 'none',
                })}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  if (!el.classList.contains('active') && !el.getAttribute('aria-current')) {
                    el.style.color = 'rgba(255,255,255,0.95)';
                    el.style.background = 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  if (!el.getAttribute('aria-current')) {
                    el.style.color = 'rgba(255,255,255,0.65)';
                    el.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={16} strokeWidth={2} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right side badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 8px rgba(74,222,128,0.6)',
              animation: 'pulse 2s infinite',
            }}
          />
          <span
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '12px',
              letterSpacing: '0.05em',
            }}
          >
            v1.0
          </span>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </header>
  );
}