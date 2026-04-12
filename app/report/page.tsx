'use client';

import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { ALL_ORDERS, getAvailableDates, TODAY, TECHNICIAN_NAME, WorkOrder } from '@/lib/data';

function Check({ on }: { on: boolean }) {
  return <span className={on ? 'text-gray-900 font-bold' : 'text-gray-200'}>✓</span>;
}

function mapOrder(o: WorkOrder, idx: number) {
  const amount = o.serviceAmount ?? 0;
  return {
    idx: idx + 1,
    customerName: o.customerName,
    modelNumber: o.modelNumber,
    deviceCount: o.deviceCount,
    serviceAmount: amount,
    isInstall: o.serviceType === '裝機' || o.serviceType === '安裝',
    isRepair: o.serviceType === '維修',
    isCollection: amount > 0,
    isCash: o.paymentMethod === '現金' || o.paymentMethod === '信用卡',
    isBill: o.paymentMethod === '匯款',
    isAccount: o.paymentMethod === '月結',
    isFree: amount === 0,
    note: o.specialNote ?? '',
  };
}

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  return `${y} 年 ${parseInt(m)} 月 ${parseInt(day)} 日`;
}

export default function ReportPage() {
  const dates = getAvailableDates();
  const [selectedDate, setSelectedDate] = useState(TODAY);

  const orders = ALL_ORDERS.filter((o) => o.date === selectedDate);
  const rows = orders.map(mapOrder);
  const total = rows.reduce((s, r) => s + r.serviceAmount, 0);

  return (
    <>
      <div className="max-w-md mx-auto px-4 pt-6 pb-28">

        {/* 標題 */}
        <div className="text-center mb-5">
          <h1 className="text-base font-bold text-gray-900 tracking-wide">（個人）營業日報表</h1>
          <p className="text-xs text-gray-400 mt-1">業務員：{TECHNICIAN_NAME}</p>
        </div>

        {/* 日期選擇 */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-sm text-gray-500 shrink-0">日期</span>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 text-sm font-medium text-gray-900 border border-gray-200 rounded-xl px-3 py-2 bg-white"
          >
            {dates.map((d) => (
              <option key={d} value={d}>{formatDate(d)}</option>
            ))}
          </select>
        </div>

        {/* 表格（橫向捲動） */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
          <table className="text-[11px] border-collapse" style={{ minWidth: 660 }}>
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                {['項次','摘要（公司行號）','品名','數量','金額','安裝','維修','收款','現金','票據','應帳','免費','備註'].map((h) => (
                  <th key={h} className="border border-gray-200 px-2 py-2 text-center whitespace-nowrap font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={13} className="border border-gray-200 py-8 text-center text-gray-400 text-sm">
                    當日無工單紀錄
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 px-2 py-2 text-center">{r.idx}</td>
                    <td className="border border-gray-200 px-2 py-2 whitespace-nowrap">{r.customerName}</td>
                    <td className="border border-gray-200 px-2 py-2 whitespace-nowrap">{r.modelNumber}</td>
                    <td className="border border-gray-200 px-2 py-2 text-center">{r.deviceCount}</td>
                    <td className="border border-gray-200 px-2 py-2 text-right whitespace-nowrap">
                      {r.serviceAmount > 0 ? r.serviceAmount.toLocaleString() : '—'}
                    </td>
                    <td className="border border-gray-200 px-2 py-2 text-center"><Check on={r.isInstall} /></td>
                    <td className="border border-gray-200 px-2 py-2 text-center"><Check on={r.isRepair} /></td>
                    <td className="border border-gray-200 px-2 py-2 text-center"><Check on={r.isCollection} /></td>
                    <td className="border border-gray-200 px-2 py-2 text-center"><Check on={r.isCash} /></td>
                    <td className="border border-gray-200 px-2 py-2 text-center"><Check on={r.isBill} /></td>
                    <td className="border border-gray-200 px-2 py-2 text-center"><Check on={r.isAccount} /></td>
                    <td className="border border-gray-200 px-2 py-2 text-center"><Check on={r.isFree} /></td>
                    <td className="border border-gray-200 px-2 py-2 min-w-[72px] text-gray-500">{r.note}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 當日銷貨合計 */}
        <div className="flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-gray-700">當日銷貨金額合計</span>
          <span className="text-base font-bold text-gray-900">$ {total.toLocaleString()}</span>
        </div>

      </div>
      <BottomNav />
    </>
  );
}
