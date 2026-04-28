import { useState, useEffect } from 'react';
import { maintenanceApi } from '../api/maintenanceRecords';
import { carsApi } from '../api/cars';
import type { MaintenanceRecord, CreateMaintenanceRecord, UpdateMaintenanceRecord, Car } from '../types';

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  in_progress: { label: 'В ремонте',  bg: 'rgba(249,115,22,0.1)',  color: '#c2410c' },
  completed:   { label: 'Завершён',   bg: 'rgba(34,197,94,0.1)',   color: '#15803d' },
};

const today = new Date().toISOString().split('T')[0];

const EMPTY: CreateMaintenanceRecord = {
  carId: 0, description: '', mechanicName: '', startDate: today, cost: 0,
};

const S = {
  page:       { fontFamily: "'DM Sans','Segoe UI',sans-serif" } as React.CSSProperties,
  inp:        { border: '1px solid #e2e8f0', borderRadius: '9px', padding: '9px 12px', fontSize: '13px', width: '100%', outline: 'none', boxSizing: 'border-box' as const, background: '#fafafa', color: '#1e293b' } as React.CSSProperties,
  label:      { display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '5px', letterSpacing: '0.04em', textTransform: 'uppercase' as const } as React.CSSProperties,
  btnPrimary: { background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' } as React.CSSProperties,
  btnGhost:   { background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' } as React.CSSProperties,
};

export default function MaintenancePage() {
  const [records, setRecords]     = useState<MaintenanceRecord[]>([]);
  const [cars, setCars]           = useState<Car[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<MaintenanceRecord | null>(null);
  const [form, setForm]           = useState<CreateMaintenanceRecord>(EMPTY);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const load = async () => {
    const [recordsData, carsData] = await Promise.all([
      maintenanceApi.getAll(),
      carsApi.getAll(),
    ]);
    setRecords(recordsData);
    setCars(carsData);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };

  const openEdit = (r: MaintenanceRecord) => {
    setEditing(r);
    setForm({
      carId: r.carId,
      description: r.description,
      mechanicName: r.mechanicName,
      startDate: r.startDate.split('T')[0],
      cost: r.cost,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editing) {
      const updateDto: UpdateMaintenanceRecord = {
        description:  form.description,
        mechanicName: form.mechanicName,
        cost:         form.cost,
        status:       editing.status,
        endDate:      editing.endDate,
      };
      await maintenanceApi.update(editing.id, updateDto);
    } else {
      await maintenanceApi.create(form);
    }
    await load();
    setShowModal(false);
  };

  const handleComplete = async (id: number) => {
    await maintenanceApi.complete(id);
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить запись о ремонте?')) return;
    await maintenanceApi.delete(id);
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = statusFilter === 'all'
    ? records
    : records.filter(r => r.status === statusFilter);

  const totalCost    = records.reduce((s, r) => s + r.cost, 0);
  const inProgressCt = records.filter(r => r.status === 'in_progress').length;

  const FILTERS = [
    { key: 'all',         label: 'Все' },
    { key: 'in_progress', label: 'В ремонте' },
    { key: 'completed',   label: 'Завершённые' },
  ];

  return (
    <div style={S.page}>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Техническое обслуживание</h1>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Журнал ремонтов и обслуживания автопарка</p>
        </div>
        <button onClick={openCreate} style={S.btnPrimary}>+ Добавить запись</button>
      </div>

      {/* KPI mini-cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Всего записей',    value: records.length,               accent: 'rgba(14,165,233,0.1)',  color: '#0369a1' },
          { label: 'В ремонте сейчас', value: inProgressCt,                 accent: 'rgba(249,115,22,0.1)',  color: '#c2410c' },
          { label: 'Затраты на ТО',    value: `${totalCost.toLocaleString()} ₽`, accent: 'rgba(34,197,94,0.1)', color: '#15803d' },
        ].map((card, idx) => (
          <div key={idx} style={{
            background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{card.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', border: 'none',
            background: statusFilter === f.key ? 'linear-gradient(135deg,#0ea5e9,#06b6d4)' : '#fff',
            color: statusFilter === f.key ? '#fff' : '#64748b',
            boxShadow: statusFilter === f.key ? '0 4px 12px rgba(14,165,233,0.3)' : '0 0 0 1px #e2e8f0',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Автомобиль', 'Описание работ', 'Мастер', 'Начало', 'Окончание', 'Стоимость', 'Статус', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 500, color: '#0f172a' }}>{r.carName}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{r.plateNumber}</div>
                </td>
                <td style={{ padding: '12px 16px', color: '#334155' }}>{r.description}</td>
                <td style={{ padding: '12px 16px', color: '#334155' }}>{r.mechanicName}</td>
                <td style={{ padding: '12px 16px', color: '#475569' }}>{new Date(r.startDate).toLocaleDateString('ru-RU')}</td>
                <td style={{ padding: '12px 16px' }}>
                  {r.endDate ? new Date(r.endDate).toLocaleDateString('ru-RU') : (
                    <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>— идёт —</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{r.cost.toLocaleString()} ₽</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: STATUS[r.status]?.bg || '#f1f5f9',
                    color: STATUS[r.status]?.color || '#475569',
                  }}>
                    {STATUS[r.status]?.label}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button onClick={() => openEdit(r)} style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 600, fontSize: '12px', cursor: 'pointer', marginRight: '10px' }}>
                    Изменить
                  </button>
                  {r.status === 'in_progress' && (
                    <button onClick={() => handleComplete(r.id)} style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 600, fontSize: '12px', cursor: 'pointer', marginRight: '10px' }}>
                      Завершить
                    </button>
                  )}
                  <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            Записей не найдено
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 200,
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', width: '520px', maxHeight: '90vh', overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)', padding: '28px',
          }}>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              {editing ? 'Редактировать запись' : 'Новая запись ТО'}
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={S.label}>Автомобиль</label>
              <select
                style={{ ...S.inp, opacity: editing ? 0.6 : 1 }}
                value={form.carId}
                disabled={!!editing}
                onChange={e => setForm({ ...form, carId: +e.target.value })}
              >
                <option value={0}>Выберите автомобиль...</option>
                {cars.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.brand} {c.model} ({c.plateNumber}) — {c.status === 'available' ? 'Доступен' : c.status === 'rented' ? 'Арендован' : 'В ремонте'}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={S.label}>Описание работ</label>
              <input style={S.inp} value={form.description}
                placeholder="Замена масла, ремонт тормозной системы..."
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={S.label}>Мастер</label>
              <input style={S.inp} value={form.mechanicName}
                placeholder="ФИО мастера"
                onChange={e => setForm({ ...form, mechanicName: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={S.label}>Дата начала</label>
                <input style={S.inp} type="date" value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <label style={S.label}>Стоимость (₽)</label>
                <input style={S.inp} type="number" value={form.cost}
                  onChange={e => setForm({ ...form, cost: +e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} style={S.btnGhost}>Отмена</button>
              <button
                onClick={handleSave}
                disabled={!editing && form.carId === 0}
                style={{ ...S.btnPrimary, opacity: (!editing && form.carId === 0) ? 0.5 : 1 }}
              >
                {editing ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}