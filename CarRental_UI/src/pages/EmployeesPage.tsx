import { useState, useEffect } from 'react';
import { employeesApi } from '../api/employees';
import type { Employee, CreateEmployee } from '../types';

const today = new Date().toISOString().split('T')[0];
const EMPTY: CreateEmployee = { fullName: '', email: '', phone: '', position: '', hireDate: today };

const POSITION_COLORS = [
  'linear-gradient(135deg,#0ea5e9,#06b6d4)',
  'linear-gradient(135deg,#8b5cf6,#7c3aed)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#d97706)',
  'linear-gradient(135deg,#ef4444,#dc2626)',
];

const S = {
  page:       { fontFamily: "'DM Sans','Segoe UI',sans-serif" } as React.CSSProperties,
  inp:        { border: '1px solid #e2e8f0', borderRadius: '9px', padding: '9px 12px', fontSize: '13px', width: '100%', outline: 'none', boxSizing: 'border-box', background: '#fafafa', color: '#1e293b' } as React.CSSProperties,
  label:      { display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '5px', letterSpacing: '0.04em', textTransform: 'uppercase' } as React.CSSProperties,
  btnPrimary: { background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' } as React.CSSProperties,
  btnGhost:   { background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' } as React.CSSProperties,
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<Employee | null>(null);
  const [form, setForm]           = useState<CreateEmployee>(EMPTY);

  useEffect(() => { employeesApi.getAll().then(setEmployees); }, []);

  const openEdit = (e: Employee) => {
    setEditing(e);
    setForm({ fullName: e.fullName, email: e.email, phone: e.phone, position: e.position, hireDate: e.hireDate.split('T')[0] });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editing) await employeesApi.update(editing.id, form);
    else         await employeesApi.create(form);
    setEmployees(await employeesApi.getAll());
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить сотрудника?')) return;
    await employeesApi.delete(id);
    setEmployees(employees.filter(e => e.id !== id));
  };

  return (
    <div style={S.page}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Сотрудники</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>Персонал компании</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(EMPTY); setShowModal(true); }} style={S.btnPrimary}>
          + Добавить сотрудника
        </button>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {employees.map((e, idx) => (
          <div key={e.id} style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #e8edf3',
            padding: '20px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            transition: 'box-shadow 0.2s',
          }}>
            {/* Card top */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: POSITION_COLORS[idx % POSITION_COLORS.length],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '18px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}>
                {e.fullName.charAt(0)}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openEdit(e)} style={{ background: 'rgba(14,165,233,0.08)', color: '#0ea5e9', border: 'none', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  Изменить
                </button>
                <button onClick={() => handleDelete(e.id)} style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  Удалить
                </button>
              </div>
            </div>

            {/* Info */}
            <p style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b', margin: '0 0 3px' }}>{e.fullName}</p>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#0ea5e9', margin: '0 0 12px' }}>{e.position}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ fontSize: '13px' }}>✉️</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{e.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ fontSize: '13px' }}>📱</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{e.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: '#cbd5e1', background: '#f8fafc', borderRadius: '6px', padding: '3px 8px' }}>
                  С {new Date(e.hireDate).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <p style={{ textAlign: 'center', padding: '60px 0', color: '#cbd5e1', fontSize: '13px' }}>Сотрудников не найдено</p>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', margin: '0 0 20px' }}>
              {editing ? 'Редактировать' : 'Добавить'} сотрудника
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {([
                ['fullName',  'ФИО',        'text'],
                ['email',     'Email',       'email'],
                ['phone',     'Телефон',     'text'],
                ['position',  'Должность',   'text'],
              ] as const).map(([f, l, t]) => (
                <div key={f}>
                  <label style={S.label}>{l}</label>
                  <input style={S.inp} type={t} value={(form as any)[f]}
                    onChange={e => setForm({ ...form, [f]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={S.label}>Дата найма</label>
                <input style={S.inp} type="date" value={form.hireDate}
                  onChange={e => setForm({ ...form, hireDate: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button onClick={() => setShowModal(false)} style={S.btnGhost}>Отмена</button>
              <button onClick={handleSave} style={S.btnPrimary}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}
