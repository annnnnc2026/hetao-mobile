'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Navigation, Phone, MapPin, Clock, Wrench } from 'lucide-react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import ServiceTypeBadge from '@/components/ServiceTypeBadge';
import { ALL_ORDERS, getOrdersByDate, getAvailableDates, TODAY } from '@/lib/data';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function parseDate(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatYM(year: number, month: number) {
  return `${year} 年 ${month + 1} 月`;
}

function getDaysInMonth(year: number, month: number) {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// Build a 10-day window centered around selected date (3 before, 6 after)
function getWindowDays(selected: Date): Date[] {
  const days: Date[] = [];
  const start = new Date(selected);
  start.setDate(start.getDate() - 3);
  for (let i = 0; i < 10; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function toDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function RecentPage() {
  const today = parseDate(TODAY);
  const [selectedDate, setSelectedDate] = useState(today);
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const dateRowRef = useRef<HTMLDivElement>(null);

  const availableDates = new Set(getAvailableDates());

  const windowDays = useMemo(() => getWindowDays(selectedDate), [selectedDate]);

  const selectedDateStr = toDateStr(selectedDate);
  const orders = getOrdersByDate(selectedDateStr);

  // Count orders per month for header
  const monthOrderCount = useMemo(() => {
    return ALL_ORDERS.filter((o) => {
      const d = parseDate(o.date);
      return d.getFullYear() === displayYear && d.getMonth() === displayMonth;
    }).length;
  }, [displayYear, displayMonth]);

  function prevMonth() {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear((y) => y - 1);
    } else {
      setDisplayMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear((y) => y + 1);
    } else {
      setDisplayMonth((m) => m + 1);
    }
  }

  function selectDate(d: Date) {
    setSelectedDate(d);
    setDisplayYear(d.getFullYear());
    setDisplayMonth(d.getMonth());
  }

  const selectedWeekday = WEEKDAYS[selectedDate.getDay()];
  const selectedM = selectedDate.getMonth() + 1;
  const selectedD = selectedDate.getDate();

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col flex-1">
        {/* Dark month navigation header */}
        <div className="sticky top-0 z-30 bg-gray-800 text-white px-5 py-4 flex items-center justify-between">
          <button onClick={prevMonth} className="p-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-base font-semibold">{formatYM(displayYear, displayMonth)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{monthOrderCount} 筆工單</p>
          </div>
          <button onClick={nextMonth} className="p-1">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Date strip */}
        <div
          ref={dateRowRef}
          className="sticky top-[72px] z-30 bg-white border-b border-gray-200 overflow-x-auto no-scrollbar"
        >
          <div className="flex px-2 py-3 gap-1 min-w-max">
            {windowDays.map((d) => {
              const ds = toDateStr(d);
              const isSelected = ds === selectedDateStr;
              const hasOrders = availableDates.has(ds);
              const wd = WEEKDAYS[d.getDay()];
              const dayNum = d.getDate();

              return (
                <button
                  key={ds}
                  onClick={() => selectDate(d)}
                  className="flex flex-col items-center px-3 py-1 rounded-xl min-w-[52px]"
                >
                  <span className="text-xs text-gray-400 mb-1">{wd}</span>
                  <div className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold ${
                    isSelected ? 'bg-gray-900 text-white' : 'text-gray-700'
                  }`}>
                    {dayNum}
                  </div>
                  <div className="mt-1 h-1.5 flex items-center justify-center">
                    {hasOrders && !isSelected && (
                      <div className="w-1 h-1 rounded-full bg-gray-400" />
                    )}
                    {hasOrders && isSelected && (
                      <div className="w-1 h-1 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected date label */}
        <div className="px-5 py-3">
          <p className="text-sm font-semibold text-gray-500">
            {selectedM}/{selectedD}（{selectedWeekday}）
          </p>
        </div>

        {/* Orders for selected date */}
        <div className="px-5 pb-4 flex flex-col gap-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              當日無工單
            </div>
          ) : (
            orders.map((order) => {
              const duration = order.durationHours === 0.5 ? '0.5h' : `${order.durationHours}h`;
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`;
              const telUrl = `tel:${order.phone}`;
              const showAmount = order.serviceType === '裝機' && order.serviceAmount;

              return (
                <Link key={order.id} href={`/order/${order.id}`}>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50">
                    {/* Top */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusBadge status={order.status} />
                        <PriorityBadge priority={order.priority} />
                      </div>
                      <div className="flex items-center gap-2">
                        {showAmount && (
                          <span className="text-xs font-semibold text-amber-500">
                            $ {order.serviceAmount!.toLocaleString()}
                          </span>
                        )}
                        <span className="text-sm font-medium text-gray-400 tabular-nums">
                          {order.timeStart}–{order.timeEnd}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <ServiceTypeBadge type={order.serviceType} />
                      <span className="font-bold text-gray-900 text-base">{order.customerName}</span>
                    </div>
                    <div className="flex items-start gap-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-xs text-gray-400">{order.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Wrench className="w-3.5 h-3.5" />
                          {order.erpNo}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                        <a
                          href={telUrl}
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-blue-500 text-white text-xs font-semibold"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          導航
                        </a>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
