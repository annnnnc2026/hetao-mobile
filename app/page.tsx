'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OrderCard from '@/components/OrderCard';
import BottomNav from '@/components/BottomNav';
import { ALL_ORDERS, getOrdersByDate, TODAY } from '@/lib/data';

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeekStart(d: Date): Date {
  const s = new Date(d);
  s.setDate(d.getDate() - d.getDay());
  return s;
}

export default function CalendarPage() {
  const initial = new Date(TODAY);
  const [selectedDate, setSelectedDate] = useState<Date>(initial);
  const [weekStart, setWeekStart] = useState<Date>(getWeekStart(initial));

  const datesWithOrders = useMemo(() => {
    const s = new Set<string>();
    ALL_ORDERS.forEach((o) => s.add(o.date));
    return s;
  }, []);

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    }),
    [weekStart],
  );

  const selectedStr = toDateStr(selectedDate);
  const orders = getOrdersByDate(selectedStr);

  const year = weekStart.getFullYear();
  const month = weekStart.getMonth() + 1;
  const monthOrderCount = ALL_ORDERS.filter((o) => {
    const d = new Date(o.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  }).length;

  function prevWeek() {
    const s = new Date(weekStart);
    s.setDate(s.getDate() - 7);
    setWeekStart(s);
    setSelectedDate(s);
  }

  function nextWeek() {
    const s = new Date(weekStart);
    s.setDate(s.getDate() + 7);
    setWeekStart(s);
    setSelectedDate(s);
  }

  const dateLabel = `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}（${WEEKDAY_LABELS[selectedDate.getDay()]}）`;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">

        {/* Title */}
        <div className="px-5 pt-12 pb-3">
          <h1 className="text-3xl font-bold text-gray-900">排程日曆</h1>
        </div>

        {/* Month header */}
        <div className="bg-gray-900 px-5 py-4 flex items-center justify-between">
          <button onClick={prevWeek} className="p-1 text-white active:opacity-60">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-base font-bold text-white">{year} 年 {month} 月</p>
            <p className="text-xs text-gray-400 mt-0.5">{monthOrderCount} 筆工單</p>
          </div>
          <button onClick={nextWeek} className="p-1 text-white active:opacity-60">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week strip */}
        <div className="bg-white border-b border-gray-100 px-4 pt-3 pb-4">
          <div className="grid grid-cols-7 text-center mb-2">
            {WEEKDAY_LABELS.map((d) => (
              <span key={d} className="text-xs text-gray-400">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 text-center">
            {weekDates.map((d) => {
              const ds = toDateStr(d);
              const isSelected = ds === selectedStr;
              const hasOrders = datesWithOrders.has(ds);
              return (
                <button
                  key={ds}
                  onClick={() => setSelectedDate(new Date(d))}
                  className="flex flex-col items-center gap-1 py-1"
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    isSelected ? 'bg-gray-900 text-white' : 'text-gray-700'
                  }`}>
                    {d.getDate()}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasOrders && !isSelected ? 'bg-gray-400' : 'invisible'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Date label */}
        <div className="px-5 pt-4 pb-3">
          <p className="text-sm font-semibold text-gray-700">{dateLabel}</p>
        </div>

        {/* Order list */}
        <div className="px-5 flex flex-col gap-4">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">此日無工單</div>
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
