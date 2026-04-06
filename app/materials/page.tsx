'use client';

import { MATERIAL_TRANSACTIONS } from '@/lib/data';

interface MaterialBalance {
  materialNo: string;
  name: string;
  unit: string;
  balance: number;
}

function calcBalances(): MaterialBalance[] {
  const map = new Map<string, MaterialBalance>();
  for (const t of MATERIAL_TRANSACTIONS) {
    if (!map.has(t.materialNo)) {
      map.set(t.materialNo, { materialNo: t.materialNo, name: t.name, unit: t.unit, balance: 0 });
    }
    map.get(t.materialNo)!.balance += t.qty;
  }
  return Array.from(map.values());
}

export default function MaterialsPage() {
  const materials = calcBalances();

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-24">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">我的餘料</h1>

      <div className="flex flex-col gap-3">
        {materials.map((m) => {
          const isShort = m.balance < 0;
          const isZero = m.balance === 0;
          return (
            <div
              key={m.materialNo}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex items-center justify-between"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">{m.materialNo}</span>
                <span className="text-sm font-medium text-gray-800">{m.name}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl font-bold tabular-nums ${
                    isShort ? 'text-red-500' : isZero ? 'text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {m.balance}
                </span>
                <span className="text-xs text-gray-400">{m.unit}</span>
                {isShort && (
                  <span className="ml-1 text-[10px] bg-red-100 text-red-500 rounded-full px-1.5 py-0.5 font-medium">
                    欠料
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
