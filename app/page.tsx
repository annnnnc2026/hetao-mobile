'use client';

import { useState, useMemo } from 'react';
import { Search, X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OrderCard from '@/components/OrderCard';
import BottomNav from '@/components/BottomNav';
import { TODAY_ORDERS, TRAVEL_INFO, TECHNICIAN_NAME, OrderStatus } from '@/lib/data';

const FILTER_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '已指派', value: '已指派' },
  { label: '進行中', value: '進行中' },
  { label: '已完成', value: '已完成' },
  { label: '延期', value: '延期' },
];

export default function TodayPage() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const completedCount = TODAY_ORDERS.filter((o) => o.status === '已完成').length;
  const totalCount = TODAY_ORDERS.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const filteredOrders = useMemo(() => {
    return TODAY_ORDERS.filter((order) => {
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
  }, [activeFilter, searchQuery]);

  const showTravelInfo = activeFilter === 'all' && !searchQuery;

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-4">
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">今日任務</h1>
          <p className="text-xs font-medium text-zinc-400 mt-0.5">{TECHNICIAN_NAME} · {totalCount} 筆工單</p>
        </div>

        {/* Progress */}
        <div className="mx-6 mb-6 bg-white rounded-2xl p-4 shadow-sm border border-zinc-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-zinc-600">已完成 {completedCount} / {totalCount} 筆</span>
            <span className="text-xs font-medium text-zinc-400">{progressPct}%</span>
          </div>
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-zinc-900 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Search */}
        <div className="mx-6 mb-4">
          <div className="flex items-center gap-2 bg-zinc-100 rounded-xl px-4 py-3">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              placeholder="搜尋工單或客戶..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-xs bg-transparent outline-none text-zinc-800 placeholder-zinc-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-zinc-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter pills */}
        <div className="px-6 mb-6 flex gap-2 overflow-x-auto no-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeFilter === tab.value
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Order list */}
        <div className="px-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <p className="text-xs font-medium text-zinc-400">沒有符合條件的工單</p>
              </motion.div>
            ) : (
              filteredOrders.map((order, idx) => {
                const originalIdx = TODAY_ORDERS.findIndex((o) => o.id === order.id);
                const travel = TRAVEL_INFO[originalIdx];
                const isLast = idx === filteredOrders.length - 1;

                return (
                  <div key={order.id}>
                    <OrderCard order={order} index={idx} />
                    {!isLast && travel && showTravelInfo && (
                      <div className="flex items-center justify-center py-2 text-[10px] font-medium text-zinc-400 gap-1">
                        <Navigation className="w-3 h-3" />
                        約 {travel.minutes} 分鐘 · {travel.km} 公里
                      </div>
                    )}
                    {!isLast && !showTravelInfo && <div className="h-3" />}
                  </div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
