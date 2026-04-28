import { useState, useEffect } from 'react';
import { carsApi } from '../api/cars';
import type { Car, CreateCar, CarCategory } from '../types';

const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  available:   { label: 'Доступен',  bg: 'rgba(34,197,94,0.1)',    color: '#15803d' },
  rented:      { label: 'Арендован', bg: 'rgba(14,165,233,0.1)',   color: '#0369a1' },
  maintenance: { label: 'Ремонт',    bg: 'rgba(239,68,68,0.1)',    color: '#b91c1c' },
};

const EMPTY: CreateCar = {
  brand: '', model: '', year: new Date().getFullYear(),
  plateNumber: '', color: '', dailyRate: 0, status: 'available', categoryId: 1,
};

const S = {
  page:    { fontFamily: "'DM Sans','Segoe UI',sans-serif" } as React.CSSProperties,
  inp:     { border: '1px solid #e2e8f0', borderRadius: '9px', padding: '9px 12px', fontSize: '13px', width: '100%', outline: 'none', boxSizing: 'border-box', background: '#fafafa', color: '#1e293b' } as React.CSSProperties,
  label:   { display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '5px', letterSpacing: '0.04em', textTransform: 'uppercase' } as React.CSSProperties,
  btnPrimary: { background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' } as React.CSSProperties,
  btnGhost: { background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' } as React.CSSProperties,
};

export default function CarsPage() {
  const [cars, setCars]             = useState<Car[]>([]);
  const [categories, setCategories] = useState<CarCategory[]>([]);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState<Car | null>(null);
  const [form, setForm]             = useState<CreateCar>(EMPTY);
  const [search, setSearch]         = useState('');

  useEffect(() => {
    carsApi.getAll().then(setCars);
    carsApi.getCategories().then(setCategories);
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit   = (c: Car) => {
    setEditing(c);
    setForm({ brand: c.brand, model: c.model, year: c.year, plateNumber: c.plateNumber,
              color: c.color, dailyRate: c.dailyRate, status: c.status, categoryId: c.categoryId });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editing) await carsApi.update(editing.id, form);
    else         await carsApi.create(form);
    setCars(await carsApi.getAll());
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить автомобиль?')) return;
    await carsApi.delete(id);
    setCars(cars.filter(c => c.id !== id));
  };

  const filtered = cars.filter(c =>
    `${c.brand} ${c.model} ${c.plateNumber}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={S.page}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Автомобили</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>Управление автопарком</p>
        </div>
        <button onClick={openCreate} style={S.btnPrimary}>+ Добавить автомобиль</button>
      </div>

      {/* Search */}
      <input
        style={{ ...S.inp, maxWidth: '340px', marginBottom: '16px' }}
        placeholder="Поиск по марке, модели, номеру..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8edf3', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
              {['Автомобиль', 'Год', 'Номер', 'Категория', 'Цена/день', 'Статус', ''].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((car, i) => (
              <tr key={car.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <td style={{ padding: '13px 16px', fontWeight: 600, color: '#1e293b' }}>{car.brand} {car.model}</td>
                <td style={{ padding: '13px 16px', color: '#64748b' }}>{car.year}</td>
                <td style={{ padding: '13px 16px', fontFamily: 'monospace', color: '#475569', letterSpacing: '0.05em' }}>{car.plateNumber}</td>
                <td style={{ padding: '13px 16px', color: '#64748b' }}>{car.categoryName}</td>
                <td style={{ padding: '13px 16px', fontWeight: 600, color: '#0369a1' }}>{car.dailyRate.toLocaleString()} ₽</td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{
                    background: STATUS_LABELS[car.status]?.bg,
                    color: STATUS_LABELS[car.status]?.color,
                    borderRadius: '20px', padding: '3px 10px',
                    fontSize: '12px', fontWeight: 600,
                  }}>
                    {STATUS_LABELS[car.status]?.label}
                  </span>
                </td>
                <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                  <button onClick={() => openEdit(car)} style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 600, fontSize: '12px', cursor: 'pointer', marginRight: '12px' }}>Изменить</button>
                  <button onClick={() => handleDelete(car.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', padding: '40px', color: '#cbd5e1', fontSize: '13px' }}>Автомобилей не найдено</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', margin: '0 0 20px' }}>
              {editing ? 'Редактировать' : 'Добавить'} автомобиль
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {([['brand','Марка','text'],['model','Модель','text'],['year','Год','number'],['plateNumber','Гос. номер','text'],['color','Цвет','text'],['dailyRate','Цена/день (₽)','number']] as const).map(([f, l, t]) => (
                <div key={f}>
                  <label style={S.label}>{l}</label>
                  <input style={S.inp} type={t} value={(form as any)[f]}
                    onChange={e => setForm({ ...form, [f]: t === 'number' ? +e.target.value : e.target.value })} />
                </div>
              ))}
              <div>
                <label style={S.label}>Категория</label>
                <select style={S.inp} value={form.categoryId} onChange={e => setForm({ ...form, categoryId: +e.target.value })}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Статус</label>
                <select style={S.inp} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                  <option value="available">Доступен</option>
                  <option value="rented">Арендован</option>
                  <option value="maintenance">Ремонт</option>
                </select>
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
