'use client';

import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { ALL_ORDERS, getAvailableDates, TODAY, TECHNICIAN_NAME, WorkOrder } from '@/lib/data';

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  return `${y} 年 ${parseInt(m)} 月 ${parseInt(day)} 日`;
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

export default function ReportPage() {
  const dates = getAvailableDates();
  const [selectedDate, setSelectedDate] = useState(TODAY);

  const orders = ALL_ORDERS.filter((o) => o.date === selectedDate);
  const total = orders.reduce((s, o) => s + (o.serviceAmount ?? 0), 0);

  return (
    <>
      <div className="max-w-md mx-auto px-4 pt-6 pb-28">

        {/* 標題 */}
        <div className="mb-4">
          <h1 className="text-base font-bold text-gray-900">營業日報表</h1>
          <p className="text-xs text-gray-400 mt-0.5">業務員：{TECHNICIAN_NAME}</p>
        </div>

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
          {orders.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">當日無工單紀錄</p>
          ) : (
            orders.map((o, i) => {
              const checks = getChecks(o);
              return (
                <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
                  {/* 頂行：項次 + 客戶名 + 金額 */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 shrink-0">#{i + 1}</span>
                      <span className="text-sm font-semibold text-gray-900 leading-tight">{o.customerName}</span>
                    </div>
                    <AmountDisplay o={o} />
                  </div>

                  {/* 品名 + 數量 */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2.5">
                    <span>{o.modelNumber}</span>
                    <span className="text-gray-300">·</span>
                    <span>數量 {o.deviceCount}</span>
                  </div>

                  {/* 勾選標籤 */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {checks.map((tag) => {
                      const isRed = tag === '延卡' || tag === '退卡';
                      return (
                        <span
                          key={tag}
                          className={`text-[11px] rounded-full px-2.5 py-0.5 font-medium ${
                            isRed ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          ✓ {tag}
                        </span>
                      );
                    })}
                  </div>

                  {/* 備註 */}
                  {o.specialNote && (
                    <p className="text-xs text-gray-400 border-t border-gray-50 pt-2 mt-1">{o.specialNote}</p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 當日銷貨合計 */}
        <div className="flex items-center justify-between bg-gray-900 text-white rounded-2xl px-4 py-3">
          <span className="text-sm font-medium">當日銷貨金額合計</span>
          <span className="text-base font-bold">$ {total.toLocaleString()}</span>
        </div>

      </div>
      <BottomNav />
    </>
  );
}
