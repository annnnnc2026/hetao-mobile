'use client';

import { useMemo } from 'react';
import { ChevronRight, MapPin, Clock, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import StatusBadge from '@/components/StatusBadge';
import ServiceTypeBadge from '@/components/ServiceTypeBadge';
import { RECENT_ORDERS } from '@/lib/data';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const w = weekdays[d.getDay()];
  return `${m}月${day}日（週${w}）`;
}

export default function RecentPage() {
  const grouped = useMemo(() => {
    const map = new Map<string, typeof RECENT_ORDERS>();
    for (const order of RECENT_ORDERS) {
      const arr = map.get(order.date) ?? [];
      arr.push(order);
      map.set(order.date, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <div className="max-w-md mx-auto">
        <div className="px-6 pt-12 pb-6">
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">近期派工</h1>
          <p className="text-xs font-medium text-zinc-400 mt-0.5">過去 7 天的工單記錄</p>
        </div>

        <div className="px-6 space-y-6">
          {grouped.map(([date, orders], gi) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: gi * 0.06 }}
            >
              {/* Date heading */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {formatDate(date)}
                </span>
                <div className="flex-1 h-px bg-zinc-200" />
                <span className="text-[10px] font-bold text-zinc-400">{orders.length} 筆</span>
              </div>

              {/* Orders */}
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link key={order.id} href={`/order/${order.id}`}>
                    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 hover:shadow-lg hover:shadow-zinc-900/20 transition-shadow active:scale-[0.99]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={order.status} />
                          <ServiceTypeBadge type={order.serviceType} />
                        </div>
                        <div className="flex items-center gap-1 text-zinc-400">
                          <span className="text-xs font-medium font-mono">{order.timeStart}–{order.timeEnd}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <p className="font-bold text-zinc-900 text-sm mb-1">{order.customerName}</p>

                      <div className="flex items-start gap-1.5 mb-2">
                        <MapPin className="w-3 h-3 text-zinc-400 mt-0.5 shrink-0" />
                        <span className="text-[11px] font-medium text-zinc-400">{order.address}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Wrench className="w-3 h-3" />
                          {order.modelNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {order.durationHours === 0.5 ? '0.5h' : `${order.durationHours}h`}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
