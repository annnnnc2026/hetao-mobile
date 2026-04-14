import BottomNav from '@/components/BottomNav';
import { ALL_ORDERS, TODAY, TECHNICIAN_NAME, WorkOrder } from '@/lib/data';

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  return `${y} 年 ${parseInt(m)} 月 ${parseInt(day)} 日`;
}

function getMachineNos(o: WorkOrder): string[] {
  if (o.machineBuildings && o.machineBuildings.length > 0) {
    return o.machineBuildings.flatMap((b) =>
      b.floors.flatMap((f) =>
        f.machines ? f.machines.map((m) => m.machineNo) : [f.machineNo]
      )
    );
  }
  return [o.erpNo];
}

function getTags(o: WorkOrder): string[] {
  const tags: string[] = [];
  if (o.serviceType === '維修') tags.push('維修');
  if (o.serviceType === '裝機' || o.serviceType === '安裝') tags.push('裝機');
  if (o.serviceType === '回收' || o.serviceType === '退卡') tags.push('回機');
  if ((o.serviceAmount ?? 0) > 0) tags.push('收款');
  return tags;
}

function AmountDisplay({ o }: { o: WorkOrder }) {
  const amount = o.serviceAmount ?? 0;
  if (o.serviceType === '延卡') return <span className="text-sm font-bold text-red-500 shrink-0">延卡</span>;
  if (o.serviceType === '退卡') return <span className="text-sm font-bold text-red-500 shrink-0">退卡</span>;
  if (o.paymentMethod === '月結') return <span className="text-sm font-bold text-blue-500 shrink-0">應帳</span>;
  if (amount === 0) return <span className="text-sm font-bold text-gray-400 shrink-0">$0</span>;
  return <span className="text-sm font-bold text-gray-900 shrink-0">${amount.toLocaleString()}</span>;
}

export default function ReportPage() {
  const orders = ALL_ORDERS.filter((o) => o.date === TODAY);

  const cashTotal    = orders.filter((o) => o.paymentMethod === '現金' || o.paymentMethod === '信用卡').reduce((s, o) => s + (o.serviceAmount ?? 0), 0);
  const billTotal    = orders.filter((o) => o.paymentMethod === '匯款').reduce((s, o) => s + (o.serviceAmount ?? 0), 0);
  const accountTotal = orders.filter((o) => o.paymentMethod === '月結').reduce((s, o) => s + (o.serviceAmount ?? 0), 0);

  return (
    <>
      <div className="max-w-md mx-auto px-4 pt-6 pb-28">

        {/* 標題 */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">營業日報表</h1>
          <p className="text-sm text-gray-400 mt-1">{TECHNICIAN_NAME}</p>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(TODAY)}</p>
        </div>

        {/* 工單卡片 */}
        <div className="flex flex-col gap-3 mb-6">
          {orders.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">當日無工單紀錄</p>
          ) : (
            orders.map((o, i) => {
              const tags = getTags(o);
              return (
                <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
                  {/* 項次 + 客戶名 + 金額 */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 shrink-0">#{i + 1}</span>
                      <span className="text-sm font-semibold text-gray-900 leading-tight">{o.customerName}</span>
                    </div>
                    <AmountDisplay o={o} />
                  </div>

                  {/* 機號 + 數量 */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2.5 flex-wrap">
                    <span>{getMachineNos(o).join('、')}</span>
                    <span className="text-gray-300">·</span>
                    <span>數量 {o.deviceCount}</span>
                  </div>

                  {/* 標籤 */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span key={tag} className="text-[11px] bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 審核欄位 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 mb-4">
          <p className="text-xs text-gray-400 mb-3">簽核狀態</p>
          <div className="flex flex-col divide-y divide-gray-50">
            {[
              { role: '營站主管', signed: false },
              { role: '會計',     signed: false },
              { role: '倉管',     signed: false },
              { role: '出納',     signed: false },
              { role: '營業人員', signed: true  },
            ].map(({ role, signed }) => (
              <div key={role} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <span className="text-sm text-gray-700">{role}</span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  signed ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-500'
                }`}>
                  {signed ? '已簽核' : '待簽核'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 當日銷貨金額合計 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
          <p className="text-xs text-gray-400 mb-3">當日銷貨金額合計</p>
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="text-center pr-3">
              <p className="text-xs text-gray-400 mb-1">現金</p>
              <p className="text-base font-bold text-gray-900">${cashTotal.toLocaleString()}</p>
            </div>
            <div className="text-center px-3">
              <p className="text-xs text-gray-400 mb-1">票據</p>
              <p className="text-base font-bold text-gray-900">${billTotal.toLocaleString()}</p>
            </div>
            <div className="text-center pl-3">
              <p className="text-xs text-gray-400 mb-1">應帳</p>
              <p className="text-base font-bold text-gray-900">${accountTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>

      </div>
      <BottomNav />
    </>
  );
}
