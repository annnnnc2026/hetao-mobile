'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { ALL_ORDERS, getAvailableDates, TODAY, TECHNICIAN_NAME, WorkOrder } from '@/lib/data';

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  return `${y} 年 ${parseInt(m)} 月 ${parseInt(day)} 日`;
}

function formatShort(d: string) {
  const [, m, day] = d.split('-');
  return `${parseInt(m)}/${parseInt(day)}`;
}

// 取得該日期所在週的週一（YYYY-MM-DD）
function getWeekStart(date: string): string {
  const d = new Date(date);
  const day = d.getDay(); // 0=日, 1=一 ... 6=六
  const diff = (day === 0 ? -6 : 1 - day); // 調整到週一
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

// 取得從 weekStart 開始的 7 天
function getWeekDates(weekStart: string): string[] {
  const result: string[] = [];
  const d = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    result.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return result;
}

function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function getChecks(o: WorkOrder) {
  const amount = o.serviceAmount ?? 0;
  const isNoCharge = o.serviceType === '延卡' || o.serviceType === '退卡';
  const checks: string[] = [];
  if (o.serviceType === '裝機' || o.serviceType === '安裝') checks.push('安裝');
  if (o.serviceType === '維修') checks.push('維修');
  if (o.serviceType === '延卡') checks.push('延卡');
  if (o.serviceType === '退卡') checks.push('退卡');
  if (amount > 0 && !isNoCharge) checks.push('收款');
  if (o.paymentMethod === '現金' || o.paymentMethod === '信用卡') checks.push('現金');
  if (o.paymentMethod === '匯款') checks.push('票據');
  if (o.paymentMethod === '月結') checks.push('應帳');
  if (amount === 0 && !isNoCharge) checks.push('免費');
  return checks;
}

function AmountDisplay({ o }: { o: WorkOrder }) {
  const amount = o.serviceAmount ?? 0;
  if (o.serviceType === '延卡') return <span className="text-sm font-bold text-red-500 shrink-0">延卡</span>;
  if (o.serviceType === '退卡') return <span className="text-sm font-bold text-red-500 shrink-0">退卡</span>;
  if (o.paymentMethod === '月結') return <span className="text-sm font-bold text-blue-500 shrink-0">應帳</span>;
  if (amount === 0) return <span className="text-sm font-bold text-gray-400 shrink-0">$0</span>;
  return <span className="text-sm font-bold text-gray-900 shrink-0">${amount.toLocaleString()}</span>;
}

function OrderCard({ o, idx }: { o: WorkOrder; idx: number }) {
  const checks = getChecks(o);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 shrink-0">#{idx + 1}</span>
          <span className="text-sm font-semibold text-gray-900 leading-tight">{o.customerName}</span>
        </div>
        <AmountDisplay o={o} />
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2.5">
        <span>{o.erpNo}</span>
        <span className="text-gray-300">·</span>
        <span>數量 {o.deviceCount}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {checks.map((tag) => {
          const isRed = tag === '延卡' || tag === '退卡';
          return (
            <span key={tag} className={`text-[11px] rounded-full px-2.5 py-0.5 font-medium ${isRed ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'}`}>
              {tag}
            </span>
          );
        })}
      </div>
      {o.specialNote && (
        <p className="text-xs text-gray-400 border-t border-gray-50 pt-2 mt-1">{o.specialNote}</p>
      )}
    </div>
  );
}

export default function ReportPage() {
  const [mode, setMode] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(TODAY));

  const dates = getAvailableDates();

  // 日模式
  const dayOrders = ALL_ORDERS.filter((o) => o.date === selectedDate);
  const dayTotal = dayOrders.reduce((s, o) => s + (o.serviceAmount ?? 0), 0);

  // 週模式
  const weekDates = getWeekDates(weekStart);
  const weekEnd = weekDates[6];
  const weekOrdersByDay = weekDates.map((d) => ({
    date: d,
    orders: ALL_ORDERS.filter((o) => o.date === d),
  })).filter((g) => g.orders.length > 0);
  const weekTotal = weekOrdersByDay.reduce((s, g) => s + g.orders.reduce((ss, o) => ss + (o.serviceAmount ?? 0), 0), 0);

  return (
    <>
      <div className="max-w-md mx-auto px-4 pt-6 pb-28">

        {/* 標題 */}
        <div className="mb-4">
          <h1 className="text-base font-bold text-gray-900">營業日報表</h1>
          <p className="text-xs text-gray-400 mt-0.5">業務員：{TECHNICIAN_NAME}</p>
        </div>

        {/* 日/週 切換 */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          {(['day', 'week'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              {m === 'day' ? '日' : '週'}
            </button>
          ))}
        </div>

        {mode === 'day' ? (
          <>
            {/* 日期選擇 */}
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-xl px-3 py-2.5 bg-white mb-4"
            >
              {dates.map((d) => (
                <option key={d} value={d}>{formatDate(d)}</option>
              ))}
            </select>

            {/* 卡片清單 */}
            <div className="flex flex-col gap-3 mb-4">
              {dayOrders.length === 0
                ? <p className="text-center text-gray-400 text-sm py-10">當日無工單紀錄</p>
                : dayOrders.map((o, i) => <OrderCard key={o.id} o={o} idx={i} />)
              }
            </div>

            {/* 當日合計 */}
            <div className="flex items-center justify-between bg-gray-900 text-white rounded-2xl px-4 py-3">
              <span className="text-sm font-medium">當日銷貨金額合計</span>
              <span className="text-base font-bold">$ {dayTotal.toLocaleString()}</span>
            </div>
          </>
        ) : (
          <>
            {/* 週導覽 */}
            <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="p-1 text-gray-500">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-900">
                {formatShort(weekStart)} － {formatShort(weekEnd)}
              </span>
              <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="p-1 text-gray-500">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 各日分組 */}
            {weekOrdersByDay.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">本週無工單紀錄</p>
            ) : (
              <div className="flex flex-col gap-5 mb-4">
                {weekOrdersByDay.map((g) => {
                  const dayAmt = g.orders.reduce((s, o) => s + (o.serviceAmount ?? 0), 0);
                  return (
                    <div key={g.date}>
                      {/* 日期標題 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">{formatDate(g.date)}</span>
                        <span className="text-xs text-gray-400">$ {dayAmt.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {g.orders.map((o, i) => <OrderCard key={o.id} o={o} idx={i} />)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 週合計 */}
            <div className="flex items-center justify-between bg-gray-900 text-white rounded-2xl px-4 py-3">
              <span className="text-sm font-medium">本週銷貨金額合計</span>
              <span className="text-base font-bold">$ {weekTotal.toLocaleString()}</span>
            </div>
          </>
        )}

      </div>
      <BottomNav />
    </>
  );
}
