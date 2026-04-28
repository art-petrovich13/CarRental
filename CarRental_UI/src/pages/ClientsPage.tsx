import { useState, useEffect } from 'react';
import { clientsApi } from '../api/clients';
import type { Client, CreateClient } from '../types';

const EMPTY: CreateClient = { fullName: '', email: '', phone: '', passportNumber: '', driverLicense: '' };

const S = {
  page:       { fontFamily: "'DM Sans','Segoe UI',sans-serif" } as React.CSSProperties,
  inp:        { border: '1px solid #e2e8f0', borderRadius: '9px', padding: '9px 12px', fontSize: '13px', width: '100%', outline: 'none', boxSizing: 'border-box', background: '#fafafa', color: '#1e293b' } as React.CSSProperties,
  label:      { display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '5px', letterSpacing: '0.04em', textTransform: 'uppercase' } as React.CSSProperties,
  btnPrimary: { background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' } as React.CSSProperties,
  btnGhost:   { background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' } as React.CSSProperties,
};

export default function ClientsPage() {
  const [clients, setClients]   = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState<Client | null>(null);
  const [form, setForm]         = useState<CreateClient>(EMPTY);
  const [search, setSearch]     = useState('');

  useEffect(() => { clientsApi.getAll().then(setClients); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit   = (c: Client) => {
    setEditing(c);
    setForm({ fullName: c.fullName, email: c.email, phone: c.phone,
              passportNumber: c.passportNumber, driverLicense: c.driverLicense });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editing) await clientsApi.update(editing.id, form);
    else         await clientsApi.create(form);
    setClients(await clientsApi.getAll());
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить клиента?')) return;
    await clientsApi.delete(id);
    setClients(clients.filter(c => c.id !== id));
  };

  const filtered = clients.filter(c =>
    `${c.fullName} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={S.page}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Клиенты</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>База клиентов компании</p>
        </div>
        <button onClick={openCreate} style={S.btnPrimary}>+ Добавить клиента</button>
      </div>

      {/* Search */}
      <input
        style={{ ...S.inp, maxWidth: '340px', marginBottom: '16px' }}
        placeholder="Поиск по имени, email, телефону..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8edf3', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e8edf3' }}>
              {['ФИО', 'Email', 'Телефон', 'Паспорт', 'Аренд', ''].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                      {c.fullName.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{c.fullName}</span>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', color: '#64748b' }}>{c.email}</td>
                <td style={{ padding: '13px 16px', color: '#64748b' }}>{c.phone}</td>
                <td style={{ padding: '13px 16px', fontFamily: 'monospace', color: '#94a3b8', fontSize: '12px' }}>{c.passportNumber}</td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{ background: 'rgba(14,165,233,0.1)', color: '#0369a1', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>
                    {c.rentalsCount}
                  </span>
                </td>
                <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                  <button onClick={() => openEdit(c)} style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 600, fontSize: '12px', cursor: 'pointer', marginRight: '12px' }}>Изменить</button>
                  <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', padding: '40px', color: '#cbd5e1', fontSize: '13px' }}>Клиентов не найдено</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', margin: '0 0 20px' }}>
              {editing ? 'Редактировать' : 'Добавить'} клиента
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {([
                ['fullName',        'ФИО',                          'text'],
                ['email',           'Email',                         'email'],
                ['phone',           'Телефон',                       'text'],
                ['passportNumber',  'Серия и номер паспорта',        'text'],
                ['driverLicense',   'Водительское удостоверение',    'text'],
              ] as const).map(([field, label, type]) => (
                <div key={field}>
                  <label style={S.label}>{label}</label>
                  <input style={S.inp} type={type} value={(form as any)[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })} />
                </div>
              ))}
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
