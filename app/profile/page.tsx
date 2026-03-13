import BottomNav from '@/components/BottomNav';
import { TECHNICIAN_NAME, MATERIALS } from '@/lib/data';
import { Package, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

function getStatus(received: number, used: number) {
  const remaining = received - used;
  if (remaining === 0) return 'empty';
  if (remaining / received <= 0.3) return 'low';
  return 'ok';
}

const STATUS_CONFIG = {
  ok:    { label: '充足',   color: 'text-emerald-600', bg: 'bg-emerald-50',  bar: 'bg-emerald-400',  Icon: CheckCircle2 },
  low:   { label: '低庫存', color: 'text-amber-500',   bg: 'bg-amber-50',    bar: 'bg-amber-400',    Icon: AlertCircle  },
  empty: { label: '已用完', color: 'text-red-500',     bg: 'bg-red-50',      bar: 'bg-red-400',      Icon: XCircle      },
};

export default function MaterialsPage() {
  const totalItems = MATERIALS.length;
  const totalRemaining = MATERIALS.reduce((s, m) => s + (m.received - m.used), 0);
  const lowOrEmpty = MATERIALS.filter((m) => getStatus(m.received, m.used) !== 'ok').length;

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

        {/* Summary cards */}
        <div className="px-5 pt-4 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">料件種類</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-emerald-600">{totalRemaining}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">總剩餘數</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className={`text-2xl font-bold ${lowOrEmpty > 0 ? 'text-amber-500' : 'text-gray-300'}`}>{lowOrEmpty}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">需補貨</p>
          </div>
        </div>

        {/* Material list */}
        <div className="px-5 pt-4 flex flex-col gap-3">
          {MATERIALS.map((m) => {
            const remaining = m.received - m.used;
            const pct = m.received > 0 ? Math.round((remaining / m.received) * 100) : 0;
            const status = getStatus(m.received, m.used);
            const cfg = STATUS_CONFIG[status];

            return (
              <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                {/* Top row */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="font-semibold text-gray-900 text-sm leading-snug">{m.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{m.partNo}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${cfg.color} ${cfg.bg}`}>
                    <cfg.Icon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-gray-100 mb-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${cfg.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-400">
                    已領 <span className="font-semibold text-gray-700">{m.received}</span> {m.unit}
                  </span>
                  <span className="text-gray-400">
                    已用 <span className="font-semibold text-gray-700">{m.used}</span> {m.unit}
                  </span>
                  <span className="ml-auto text-gray-400">
                    剩餘 <span className={`font-bold text-sm ${cfg.color}`}>{remaining}</span> {m.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
