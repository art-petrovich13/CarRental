import { useState, useEffect } from 'react';
import { rentalsApi } from '../api/rentals';
import { carsApi } from '../api/cars';
import { clientsApi } from '../api/clients';
import { employeesApi } from '../api/employees';
import type { Rental, CreateRental, Car, Client, Employee } from '../types';

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  active:    { label: 'Активна',   bg: 'rgba(14,165,233,0.1)',   color: '#0369a1' },
  completed: { label: 'Завершена', bg: 'rgba(34,197,94,0.1)',    color: '#15803d' },
  cancelled: { label: 'Отменена',  bg: 'rgba(239,68,68,0.1)',    color: '#b91c1c' },
};

const today = new Date().toISOString().split('T')[0];
const EMPTY: CreateRental = { carId: 0, clientId: 0, employeeId: 0, startDate: today, endDate: today };

const S = {
  page:       { fontFamily: "'DM Sans','Segoe UI',sans-serif" } as React.CSSProperties,
  inp:        { border: '1px solid #e2e8f0', borderRadius: '9px', padding: '9px 12px', fontSize: '13px', width: '100%', outline: 'none', boxSizing: 'border-box', background: '#fafafa', color: '#1e293b' } as React.CSSProperties,
  label:      { display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '5px', letterSpacing: '0.04em', textTransform: 'uppercase' } as React.CSSProperties,
  btnPrimary: { background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' } as React.CSSProperties,
  btnGhost:   { background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' } as React.CSSProperties,
};

const FILTERS = [
  { key: 'all',       label: 'Все' },
  { key: 'active',    label: 'Активные' },
  { key: 'completed', label: 'Завершённые' },
  { key: 'cancelled', label: 'Отменённые' },
];

export default function RentalsPage() {
  const [rentals, setRentals]     = useState<Rental[]>([]);
  const [cars, setCars]           = useState<Car[]>([]);
  const [clients, setClients]     = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState<CreateRental>(EMPTY);
  const [statusFilter, setStatusFilter] = useState('all');

  const load = async () => {
    setRentals(await rentalsApi.getAll());
    setCars(await carsApi.getAll());
    setClients(await clientsApi.getAll());
    setEmployees(await employeesApi.getAll());
  };
  useEffect(() => { load(); }, []);

  const handleCreate   = async () => { await rentalsApi.create(form); setRentals(await rentalsApi.getAll()); setShowModal(false); };
  const handleComplete = async (id: number) => { await rentalsApi.complete(id); setRentals(await rentalsApi.getAll()); };
  const handleCancel   = async (id: number) => { if (!confirm('Отменить аренду?')) return; await rentalsApi.cancel(id); setRentals(await rentalsApi.getAll()); };

  const filtered = statusFilter === 'all' ? rentals : rentals.filter(r => r.status === statusFilter);

  return (
    <div style={S.page}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Аренды</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>Договоры аренды автомобилей</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setShowModal(true); }} style={S.btnPrimary}>+ Новая аренда</button>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s', border: 'none',
            background: statusFilter === f.key ? 'linear-gradient(135deg,#0ea5e9,#06b6d4)' : '#fff',
            color: statusFilter === f.key ? '#fff' : '#64748b',
            boxShadow: statusFilter === f.key ? '0 4px 12px rgba(14,165,233,0.3)' : '0 0 0 1px #e2e8f0',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8edf3', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
              {['Автомобиль', 'Клиент', 'Менеджер', 'Начало', 'Конец', 'Стоимость', 'Статус', ''].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{r.carName}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>{r.carPlate}</div>
                </td>
                <td style={{ padding: '13px 16px', color: '#475569', fontWeight: 500 }}>{r.clientName}</td>
                <td style={{ padding: '13px 16px', color: '#94a3b8', fontSize: '12px' }}>{r.employeeName}</td>
                <td style={{ padding: '13px 16px', color: '#64748b' }}>{new Date(r.startDate).toLocaleDateString('ru-RU')}</td>
                <td style={{ padding: '13px 16px', color: '#64748b' }}>{new Date(r.endDate).toLocaleDateString('ru-RU')}</td>
                <td style={{ padding: '13px 16px', fontWeight: 700, color: '#0369a1' }}>{r.totalCost.toLocaleString()} ₽</td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{ background: STATUS[r.status]?.bg, color: STATUS[r.status]?.color, borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>
                    {STATUS[r.status]?.label}
                  </span>
                </td>
                <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                  {r.status === 'active' && (
                    <>
                      <button onClick={() => handleComplete(r.id)} style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 600, fontSize: '12px', cursor: 'pointer', marginRight: '10px' }}>Завершить</button>
                      <button onClick={() => handleCancel(r.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>Отменить</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', padding: '40px', color: '#cbd5e1', fontSize: '13px' }}>Аренд не найдено</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '460px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', margin: '0 0 20px' }}>Новая аренда</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={S.label}>Автомобиль</label>
                <select style={S.inp} value={form.carId} onChange={e => setForm({ ...form, carId: +e.target.value })}>
                  <option value={0}>Выберите автомобиль...</option>
                  {cars.filter(c => c.status === 'available').map(c => (
                    <option key={c.id} value={c.id}>{c.brand} {c.model} ({c.plateNumber}) — {c.dailyRate} ₽/день</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={S.label}>Клиент</label>
                <select style={S.inp} value={form.clientId} onChange={e => setForm({ ...form, clientId: +e.target.value })}>
                  <option value={0}>Выберите клиента...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Менеджер</label>
                <select style={S.inp} value={form.employeeId} onChange={e => setForm({ ...form, employeeId: +e.target.value })}>
                  <option value={0}>Выберите сотрудника...</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={S.label}>Дата начала</label>
                  <input style={S.inp} type="date" value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div>
                  <label style={S.label}>Дата окончания</label>
                  <input style={S.inp} type="date" value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button onClick={() => setShowModal(false)} style={S.btnGhost}>Отмена</button>
              <button onClick={handleCreate} style={S.btnPrimary}>Оформить аренду</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}
