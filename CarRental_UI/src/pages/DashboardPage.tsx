import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { reportsApi } from '../api/reports';
import { formatMonth } from '../utils/months';
import type { Summary, MonthData, StatusData, TopCar } from '../types';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
         WidthType, BorderStyle, ShadingType } from 'docx';

const PIE_COLORS = ['#22C55E', '#0ea5e9', '#F59E0B'];
const STATUS_MAP: Record<string, string> = {
  available: 'Доступен', rented: 'Арендован', maintenance: 'Ремонт',
};

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, accent }: {
  icon: string; label: string; value: string | number; sub?: string; accent: string;
}) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      border: '1px solid #e8edf3',
      padding: '20px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: '2px 0 0' }}>{value}</p>
        {sub && <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '2px 0 0' }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      border: '1px solid #e8edf3',
      padding: '20px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
    }}>
      <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', margin: '0 0 16px', letterSpacing: '0.02em' }}>{title}</h2>
      {children}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [summary, setSummary]               = useState<Summary | null>(null);
  const [rentalsByMonth, setRentalsByMonth] = useState<MonthData[]>([]);
  const [revenueByMonth, setRevenueByMonth] = useState<MonthData[]>([]);
  const [carsByStatus, setCarsByStatus]     = useState<StatusData[]>([]);
  const [topCars, setTopCars]               = useState<TopCar[]>([]);

  useEffect(() => {
    reportsApi.getSummary().then(setSummary);
    reportsApi.getRentalsByMonth().then(d =>
      setRentalsByMonth(d.map(x => ({ ...x, label: formatMonth(x.year, x.month) })))
    );
    reportsApi.getRevenueByMonth().then(d =>
      setRevenueByMonth(d.map(x => ({ ...x, label: formatMonth(x.year, x.month) })))
    );
    reportsApi.getCarsByStatus().then(setCarsByStatus);
    reportsApi.getTopCars().then(setTopCars);
  }, []);

  // ── Export Excel ─────────────────────────────────────────────────────────────
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Показатель', 'Значение'],
      ['Всего автомобилей',     summary?.totalCars ?? 0],
      ['Доступных автомобилей', summary?.availableCars ?? 0],
      ['Арендованных авто',     summary?.rentedCars ?? 0],
      ['Всего клиентов',        summary?.totalClients ?? 0],
      ['Активных аренд',        summary?.activeRentals ?? 0],
      ['Выручка за месяц (₽)',  summary?.monthRevenue ?? 0],
      ['Общая выручка (₽)',     summary?.totalRevenue ?? 0],
    ]), 'Сводка');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Период', 'Кол-во аренд'],
      ...rentalsByMonth.map(m => [m.label, m.count]),
    ]), 'Аренды по месяцам');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Период', 'Выручка (₽)'],
      ...revenueByMonth.map(m => [m.label, m.revenue]),
    ]), 'Выручка по месяцам');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Автомобиль', 'Кол-во аренд'],
      ...topCars.map(c => [c.carName, c.count]),
    ]), 'Топ автомобилей');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'car_rental_report.xlsx');
  };

  // ── Export Word ───────────────────────────────────────────────────────────────
  const exportWord = async () => {
    const gb = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
    const ab = { top: gb, bottom: gb, left: gb, right: gb };
    const mkRow = (cells: string[], isHeader = false) =>
      new TableRow({
        children: cells.map((text, i) =>
          new TableCell({
            borders: ab,
            shading: isHeader ? { fill: '0369a1', type: ShadingType.CLEAR } : (i % 2 === 0 ? { fill: 'F0F9FF', type: ShadingType.CLEAR } : undefined),
            width: { size: Math.floor(9360 / cells.length), type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text, bold: isHeader, size: 20, font: 'Arial', color: isHeader ? 'FFFFFF' : '111827' })] })],
          })
        ),
      });

    const doc = new Document({
      sections: [{
        properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
          new Paragraph({ alignment: 'center', spacing: { after: 300 }, children: [new TextRun({ text: 'Отчёт — Информационная система проката автомобилей', bold: true, size: 32, font: 'Arial', color: '0369a1' })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: `Дата формирования: ${new Date().toLocaleDateString('ru-RU')}`, size: 22, font: 'Arial', color: '6B7280' })] }),
          new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: '1. Сводная статистика', bold: true, size: 28, font: 'Arial', color: '0ea5e9' })] }),
          new Table({
            width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 4680],
            rows: [
              mkRow(['Показатель', 'Значение'], true),
              mkRow(['Всего автомобилей',     String(summary?.totalCars ?? 0)]),
              mkRow(['Доступных автомобилей', String(summary?.availableCars ?? 0)]),
              mkRow(['Арендованных авто',     String(summary?.rentedCars ?? 0)]),
              mkRow(['Всего клиентов',        String(summary?.totalClients ?? 0)]),
              mkRow(['Активных аренд',        String(summary?.activeRentals ?? 0)]),
              mkRow(['Выручка за месяц',      `${(summary?.monthRevenue ?? 0).toLocaleString('ru-RU')} ₽`]),
              mkRow(['Общая выручка',         `${(summary?.totalRevenue ?? 0).toLocaleString('ru-RU')} ₽`]),
            ],
          }),
          new Paragraph({ spacing: { before: 300, after: 160 }, children: [new TextRun({ text: '2. Аренды по месяцам', bold: true, size: 28, font: 'Arial', color: '0ea5e9' })] }),
          new Table({
            width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 4680],
            rows: [mkRow(['Период', 'Кол-во аренд'], true), ...rentalsByMonth.map(m => mkRow([m.label ?? '', String(m.count ?? 0)]))],
          }),
          new Paragraph({ spacing: { before: 300, after: 160 }, children: [new TextRun({ text: '3. Топ-5 автомобилей', bold: true, size: 28, font: 'Arial', color: '0ea5e9' })] }),
          new Table({
            width: { size: 9360, type: WidthType.DXA }, columnWidths: [6240, 3120],
            rows: [mkRow(['Автомобиль', 'Кол-во аренд'], true), ...topCars.map(c => mkRow([c.carName, String(c.count)]))],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'car_rental_report.docx');
  };

  if (!summary) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8', fontSize: '14px' }}>
      Загрузка данных...
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Дашборд</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>Аналитика и отчёты</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={exportWord} style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
            color: '#fff', border: 'none', borderRadius: '10px',
            padding: '9px 16px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
          }}>
            📄 Экспорт Word
          </button>
          <button onClick={exportExcel} style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff', border: 'none', borderRadius: '10px',
            padding: '9px 16px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
          }}>
            📊 Экспорт Excel
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <KpiCard icon="🚗" label="Всего автомобилей"  value={summary.totalCars}    accent="rgba(14,165,233,0.12)" />
        <KpiCard icon="✅" label="Доступных"          value={summary.availableCars} accent="rgba(34,197,94,0.12)"  />
        <KpiCard icon="👥" label="Клиентов"           value={summary.totalClients}  accent="rgba(139,92,246,0.12)" />
        <KpiCard icon="📋" label="Активных аренд"    value={summary.activeRentals} accent="rgba(249,115,22,0.12)" />
        <KpiCard icon="💰" label="Выручка за месяц"  value={`${summary.monthRevenue.toLocaleString()} ₽`} accent="rgba(234,179,8,0.12)" />
        <KpiCard icon="💎" label="Общая выручка"     value={`${summary.totalRevenue.toLocaleString()} ₽`} accent="rgba(14,165,233,0.12)" />
        <KpiCard icon="🔧" label="В аренде сейчас"   value={summary.rentedCars}    accent="rgba(239,68,68,0.12)"  />
        <KpiCard icon="📈" label="Завершённых аренд" value={summary.completedRental}                 accent="rgba(20,184,166,0.12)" />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <Card title="Аренды по месяцам">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={rentalsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="count" name="Аренд" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Выручка по месяцам (₽)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: any) => [`${Number(v).toLocaleString()} ₽`, 'Выручка']}
                contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="revenue" name="Выручка" stroke="#0ea5e9"
                strokeWidth={2.5} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#06b6d4' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Card title="Автомобили по статусам">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={carsByStatus} dataKey="count" nameKey="status"
                cx="50%" cy="50%" outerRadius={80} innerRadius={40}
                label={({ name, percent }) => `${STATUS_MAP[name!] ?? name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {carsByStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip
                formatter={(_, name) => [_, STATUS_MAP[String(name)] ?? name]}
                contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Топ-5 самых арендуемых автомобилей">
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['#', 'Автомобиль', 'Аренд'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Аренд' ? 'right' : 'left', padding: '6px 0', fontSize: '11px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topCars.map((car, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '10px 0', color: '#cbd5e1', fontWeight: 600, width: '28px' }}>{i + 1}</td>
                  <td style={{ padding: '10px 0', fontWeight: 500, color: '#1e293b' }}>{car.carName}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right' }}>
                    <span style={{ background: 'rgba(14,165,233,0.1)', color: '#0369a1', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>
                      {car.count}
                    </span>
                  </td>
                </tr>
              ))}
              {topCars.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '24px 0', color: '#cbd5e1', fontSize: '12px' }}>Нет данных</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}
