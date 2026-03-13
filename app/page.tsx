'use client';

import { useState, useMemo } from 'react';
import { Search, X, Navigation } from 'lucide-react';
import OrderCard from '@/components/OrderCard';
import BottomNav from '@/components/BottomNav';
import { getOrdersByDate, TRAVEL_INFO, TECHNICIAN_NAME, TODAY, OrderStatus } from '@/lib/data';

const FILTER_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: '全部',  value: 'all' },
  { label: '已指派', value: '已指派' },
  { label: '進行中', value: '進行中' },
  { label: '已完成', value: '已完成' },
  { label: '延期',  value: '延期' },
];

export default function TodayPage() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const todayOrders = getOrdersByDate(TODAY);
  const completedCount = todayOrders.filter((o) => o.status === '已完成').length;
  const pendingCount = todayOrders.filter((o) => o.status === '已指派' || o.status === '進行中').length;
  const totalDevices = todayOrders.reduce((sum, o) => sum + o.deviceCount, 0);
  const totalCount = todayOrders.length;
  const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredOrders = useMemo(() => {
    return todayOrders.filter((order) => {
      const matchFilter = activeFilter === 'all' || order.status === activeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        order.customerName.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        order.modelNumber.toLowerCase().includes(q) ||
        order.address.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [activeFilter, searchQuery, todayOrders]);

  const showTravelInfo = activeFilter === 'all' && !searchQuery;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">
        <div className="px-5 pt-12 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">今日任務</h1>
          <p className="text-sm text-gray-400 mt-0.5">{TECHNICIAN_NAME} · {totalCount} 筆工單</p>
        </div>

        {/* Quick dashboard */}
        <div className="mx-5 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="flex flex-col items-center gap-0.5 pr-4">
              <span className="text-2xl font-bold text-gray-900 tabular-nums">{totalDevices}</span>
              <span className="text-xs text-gray-400">設備總數</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4">
              <span className="text-2xl font-bold text-green-500 tabular-nums">{completedCount}</span>
              <span className="text-xs text-gray-400">今日已完工</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 pl-4">
              <span className="text-2xl font-bold text-amber-500 tabular-nums">{pendingCount}</span>
              <span className="text-xs text-gray-400">今日待處理</span>
            </div>
          </div>
        </div>

        <div className="mx-5 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-sm text-gray-700">已完成 {completedCount} / {totalCount} 筆</span>
            <span className="text-sm text-gray-400">{progressPct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-700 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="mx-5 mb-4">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="搜尋工單或客戶..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <div className="px-5 mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === tab.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="px-5">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              沒有符合條件的工單
            </div>
          ) : (
            filteredOrders.map((order, idx) => {
              const originalIdx = todayOrders.findIndex((o) => o.id === order.id);
              const travel = TRAVEL_INFO[originalIdx];
              const isLast = idx === filteredOrders.length - 1;
              return (
                <div key={order.id}>
                  <OrderCard order={order} />
                  {!isLast && travel && showTravelInfo && (
                    <div className="flex items-center gap-3 py-3">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                        <Navigation className="w-3 h-3" />
                        約 {travel.minutes} 分鐘 · {travel.km} 公里
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                  )}
                  {!isLast && !showTravelInfo && <div className="h-4" />}
                </div>
              );
            })
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
