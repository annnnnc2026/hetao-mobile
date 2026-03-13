import BottomNav from '@/components/BottomNav';
import { TECHNICIAN_NAME, MATERIAL_TRANSACTIONS, TODAY } from '@/lib/data';
import { Package } from 'lucide-react';

export default function MaterialsPage() {
  const todayTx = MATERIAL_TRANSACTIONS.filter((t) => t.date === TODAY);
  const otherTx  = MATERIAL_TRANSACTIONS.filter((t) => t.date !== TODAY);

  // 本日已領料：今日所有 qty>0 的筆數
  const todayReceivedCount = todayTx.filter((t) => t.qty > 0).length;
  // 本日已使用：今日所有 qty<0 的筆數
  const todayUsedCount = todayTx.filter((t) => t.qty < 0).length;

  // 欠料：累計每種料的淨量（領 - 用），餘額 < 0 即為欠料
  const balanceMap = new Map<string, number>();
  MATERIAL_TRANSACTIONS.forEach((t) => {
    balanceMap.set(t.name, (balanceMap.get(t.name) ?? 0) + t.qty);
  });
  const deficitItems = [...balanceMap.entries()].filter(([, v]) => v > 0);
  const deficitCount = deficitItems.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">餘料管理</h1>
            <span className="text-xs text-gray-400">{TECHNICIAN_NAME}</span>
          </div>
        </div>

        {/* Dashboard */}
        <div className="px-5 pt-4 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{todayReceivedCount}</p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">本日已領料</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{todayUsedCount}</p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">已使用</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className={`text-2xl font-bold ${deficitCount > 0 ? 'text-orange-500' : 'text-gray-300'}`}>
              {deficitCount}
            </p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">欠料</p>
          </div>
        </div>

        {/* Transaction list */}
        <div className="px-5 pt-5 flex flex-col gap-5">
          {/* 今日 */}
          {todayTx.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-3">今日</p>
              <div className="flex flex-col gap-3">
                {[...todayTx].reverse().map((t) => (
                  <TxCard key={t.id} tx={t} />
                ))}
              </div>
            </div>
          )}

          {/* 昨天 / 較早 */}
          {otherTx.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-3">較早</p>
              <div className="flex flex-col gap-3">
                {otherTx.map((t) => (
                  <TxCard key={t.id} tx={t} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  );
}

function TxCard({ tx }: { tx: import('@/lib/data').MaterialTransaction }) {
  const isReceived = tx.qty > 0;
  const qtyLabel = isReceived ? `+${tx.qty}` : `${tx.qty}`;

  return (
    <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 flex items-center gap-3">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
        isReceived ? 'bg-emerald-50' : 'bg-orange-50'
      }`}>
        <Package className={`w-5 h-5 ${isReceived ? 'text-emerald-500' : 'text-orange-400'}`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{tx.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{tx.timeLabel}</p>
      </div>

      {/* Qty */}
      <p className={`text-base font-bold tabular-nums shrink-0 ${
        isReceived ? 'text-emerald-500' : 'text-orange-500'
      }`}>
        {qtyLabel} {tx.unit}
      </p>
    </div>
  );
}
