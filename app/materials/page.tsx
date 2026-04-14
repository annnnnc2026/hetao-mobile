import BottomNav from '@/components/BottomNav';
import { MATERIALS, MATERIAL_TRANSACTIONS, getMaterial } from '@/lib/data';

function calcBalances() {
  const balanceMap = new Map<string, number>();
  for (const t of MATERIAL_TRANSACTIONS) {
    balanceMap.set(t.materialNo, (balanceMap.get(t.materialNo) ?? 0) + t.qty);
  }
  return MATERIALS.map((m) => ({
    ...m,
    balance: balanceMap.get(m.materialNo) ?? 0,
  }));
}

export default function MaterialsPage() {
  const materials = calcBalances();

  return (
    <>
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
      <BottomNav />
    </>
  );
}
