'use client';

import { useState, useMemo } from 'react';
import { ArrowUpRight, Package } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { TECHNICIAN_NAME, MATERIAL_TRANSACTIONS, TODAY, type MaterialType } from '@/lib/data';

// Group transactions by date, sorted newest first
function groupByDate(txs: typeof MATERIAL_TRANSACTIONS) {
  const map = new Map<string, typeof MATERIAL_TRANSACTIONS>();
  txs.forEach((t) => {
    const list = map.get(t.date) ?? [];
    list.push(t);
    map.set(t.date, list);
  });
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

function dateLabel(date: string): string {
  if (date === TODAY) return '今日';
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

const TYPE_STYLE: Record<MaterialType, { tag: string; icon: string; qty: string }> = {
  領料: { tag: 'bg-emerald-50 text-emerald-600', icon: 'bg-emerald-50 text-emerald-500', qty: 'text-emerald-500' },
  退料: { tag: 'bg-blue-50 text-blue-600',       icon: 'bg-blue-50 text-blue-500',       qty: 'text-blue-500'   },
  消料: { tag: 'bg-orange-50 text-orange-500',   icon: 'bg-orange-50 text-orange-400',   qty: 'text-orange-500' },
};

export default function MaterialsPage() {
  const [showAll, setShowAll] = useState(false);

  // Stats
  const todayTx = MATERIAL_TRANSACTIONS.filter((t) => t.date === TODAY);
  const todayReceived = todayTx.filter((t) => t.type === '領料').length;
  const todayUsed    = todayTx.filter((t) => t.type === '消料').length;

  const balanceMap = new Map<string, number>();
  MATERIAL_TRANSACTIONS.forEach((t) => {
    balanceMap.set(t.materialNo, (balanceMap.get(t.materialNo) ?? 0) + t.qty);
  });
  const deficitCount = [...balanceMap.values()].filter((v) => v > 0).length;

  // Recent: today + yesterday (max 5 per day shown in preview)
  const allGrouped = useMemo(() => groupByDate(MATERIAL_TRANSACTIONS), []);
  const displayedGroups = showAll ? allGrouped : allGrouped.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="px-5 pt-12 pb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">餘料管理</h1>
          <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {TECHNICIAN_NAME.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="px-5 mb-5">
          <button className="w-full bg-gray-900 rounded-2xl px-5 py-4 flex items-center justify-between active:scale-[0.98] transition-transform">
            <span className="text-sm font-semibold text-white">領料申請</span>
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>

        {/* Stats row */}
        <div className="px-5 mb-5 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-xl font-bold text-gray-900">{todayReceived}</p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">今日已領料</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-xl font-bold text-gray-900">{todayUsed}</p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">今日已消料</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className={`text-xl font-bold ${deficitCount > 0 ? 'text-orange-500' : 'text-gray-300'}`}>
              {deficitCount}
            </p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">欠料</p>
          </div>
        </div>

        {/* Records */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-900">最近紀錄</span>
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-xs text-gray-400 active:text-gray-600"
            >
              {showAll ? '收起' : '查看全部'}
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {displayedGroups.map(([date, txs]) => {
              const items = showAll ? txs : txs.slice(0, 5);
              return (
                <div key={date}>
                  <p className="text-xs font-semibold text-gray-400 mb-2.5">{dateLabel(date)}</p>
                  <div className="flex flex-col gap-3">
                    {[...items].reverse().map((t) => {
                      const style = TYPE_STYLE[t.type];
                      const qtyLabel = t.qty > 0 ? `+${t.qty}` : `${t.qty}`;
                      const isDeficit = (balanceMap.get(t.materialNo) ?? 0) > 0;
                      return (
                        <div
                          key={t.id}
                          className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 flex items-center gap-3"
                        >
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.icon}`}>
                            <Package className="w-5 h-5" />
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{t.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-gray-400">{t.materialNo}</span>
                              {t.machineNo && (
                                <>
                                  <span className="text-gray-200">·</span>
                                  <span className="text-xs text-gray-400">{t.machineNo}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {/* Right: qty + tags */}
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <p className={`text-base font-bold tabular-nums ${style.qty}`}>
                              {qtyLabel} {t.unit}
                            </p>
                            <div className="flex items-center gap-1">
                              {isDeficit && (
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-50 text-red-500">
                                  欠料
                                </span>
                              )}
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${style.tag}`}>
                                {t.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
