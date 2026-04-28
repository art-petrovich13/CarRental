import { useState, useEffect } from 'react';
import { paymentsApi } from '../api/payments';
import { rentalsApi } from '../api/rentals';
import type { Payment, CreatePayment, Rental } from '../types';

const METHOD_LABELS: Record<string, { label: string; bg: string; color: string }> = {
    cash: { label: 'Наличные', bg: 'rgba(34,197,94,0.1)', color: '#15803d' },
    card: { label: 'Карта', bg: 'rgba(14,165,233,0.1)', color: '#0369a1' },
    online: { label: 'Онлайн', bg: 'rgba(139,92,246,0.1)', color: '#7c3aed' },
};

const EMPTY: CreatePayment = { rentalId: 0, amount: 0, paymentMethod: 'cash' };

const S = {
    page: { fontFamily: "'DM Sans','Segoe UI',sans-serif" } as React.CSSProperties,
    inp: { border: '1px solid #e2e8f0', borderRadius: '9px', padding: '9px 12px', fontSize: '13px', width: '100%', outline: 'none', boxSizing: 'border-box' as const, background: '#fafafa', color: '#1e293b' } as React.CSSProperties,
    label: { display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '5px', letterSpacing: '0.04em', textTransform: 'uppercase' as const } as React.CSSProperties,
    btnPrimary: { background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' } as React.CSSProperties,
    btnGhost: { background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' } as React.CSSProperties,
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<CreatePayment>(EMPTY);
    const [methodFilter, setMethodFilter] = useState<string>('all');

    const load = async () => {
        const [paymentsData, rentalsData] = await Promise.all([
            paymentsApi.getAll(),
            rentalsApi.getAll(),
        ]);
        setPayments(paymentsData);
        setRentals(rentalsData);
    };
    useEffect(() => { load(); }, []);

    const handleCreate = async () => {
        await paymentsApi.create(form);
        await load();
        setShowModal(false);
        setForm(EMPTY);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить запись об оплате?')) return;
        await paymentsApi.delete(id);
        setPayments(prev => prev.filter(p => p.id !== id));
    };

    const paidRentalIds = new Set(payments.map(p => p.rentalId));
    const unpaidRentals = rentals.filter(r => r.status === 'completed' && !paidRentalIds.has(r.id));

    const filtered = methodFilter === 'all'
        ? payments
        : payments.filter(p => p.paymentMethod === methodFilter);

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    const FILTERS = [
        { key: 'all', label: 'Все' },
        { key: 'cash', label: 'Наличные' },
        { key: 'card', label: 'Карта' },
        { key: 'online', label: 'Онлайн' },
    ];

    return (
        <div style={S.page}>
            {/* Page header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Платежи</h1>
                    <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>История оплат аренды</p>
                </div>
                <button onClick={() => { setForm(EMPTY); setShowModal(true); }} style={S.btnPrimary}>
                    + Добавить оплату
                </button>
            </div>

            {/* Summary card */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Общая сумма платежей</span>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{totalAmount.toLocaleString()} ₽</div>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    {['cash', 'card', 'online'].map(m => {
                        const cnt = payments.filter(p => p.paymentMethod === m);
                        const sum = cnt.reduce((s, p) => s + p.amount, 0);
                        return (
                            <div key={m} style={{ flex: 1, background: METHOD_LABELS[m].bg, borderRadius: '12px', padding: '12px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: METHOD_LABELS[m].color, marginBottom: '4px' }}>{METHOD_LABELS[m].label}</div>
                                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{sum.toLocaleString()} ₽</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>{cnt.length} опл.</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {FILTERS.map(f => (
                    <button key={f.key} onClick={() => setMethodFilter(f.key)} style={{
                        padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', border: 'none',
                        background: methodFilter === f.key ? 'linear-gradient(135deg,#0ea5e9,#06b6d4)' : '#fff',
                        color: methodFilter === f.key ? '#fff' : '#64748b',
                        boxShadow: methodFilter === f.key ? '0 4px 12px rgba(14,165,233,0.3)' : '0 0 0 1px #e2e8f0',
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
                            {['№ аренды', 'Клиент', 'Автомобиль', 'Сумма', 'Метод', 'Дата оплаты', ''].map(h => (
                                <th key={h} style={{ textAlign: h === 'Сумма' ? 'right' : 'left', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p, i) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', ...(i % 2 === 0 ? { background: '#ffffff' } : { background: '#fafafa' }) }}>
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: '#334155', fontWeight: 600 }}>#{p.rentalId}</span>
                                </td>
                                <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>{p.clientName}</td>
                                <td style={{ padding: '12px 16px', color: '#475569' }}>{p.carName}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{p.amount.toLocaleString()} ₽</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        background: METHOD_LABELS[p.paymentMethod]?.bg || '#f1f5f9',
                                        color: METHOD_LABELS[p.paymentMethod]?.color || '#475569',
                                    }}>
                                        {METHOD_LABELS[p.paymentMethod]?.label}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 16px', color: '#475569' }}>{new Date(p.paymentDate).toLocaleDateString('ru-RU')}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                    <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        Платежей не найдено
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
                        background: '#fff', borderRadius: '20px', width: '460px', maxHeight: '90vh', overflow: 'auto',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.15)', padding: '28px',
                    }}>
                        <h2 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Зарегистрировать оплату</h2>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={S.label}>Аренда</label>
                            <select style={S.inp} value={form.rentalId} onChange={e => {
                                const rental = unpaidRentals.find(r => r.id === +e.target.value);
                                setForm({ ...form, rentalId: +e.target.value, amount: rental ? rental.totalCost : 0 });
                            }}>
                                <option value={0}>Выберите завершённую аренду...</option>
                                {unpaidRentals.map(r => (
                                    <option key={r.id} value={r.id}>
                                        #{r.id} — {r.clientName} / {r.carName} — {r.totalCost.toLocaleString()} ₽
                                    </option>
                                ))}
                            </select>
                            {unpaidRentals.length === 0 && (
                                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>⚠ Нет завершённых аренд без оплаты</p>
                            )}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={S.label}>Сумма (₽)</label>
                            <input style={S.inp} type="number" value={form.amount}
                                onChange={e => setForm({ ...form, amount: +e.target.value })} />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={S.label}>Способ оплаты</label>
                            <select style={S.inp} value={form.paymentMethod}
                                onChange={e => setForm({ ...form, paymentMethod: e.target.value as any })}>
                                <option value="cash">Наличные</option>
                                <option value="card">Банковская карта</option>
                                <option value="online">Онлайн</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setShowModal(false)} style={S.btnGhost}>Отмена</button>
                            <button
                                onClick={handleCreate}
                                disabled={form.rentalId === 0}
                                style={{ ...S.btnPrimary, opacity: form.rentalId === 0 ? 0.5 : 1 }}
                            >
                                Сохранить
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