import { ServiceType } from '@/lib/data';

const STYLE: Record<string, string> = {
  // 紅 — 故障 / 客訴
  '設備故障':     'bg-red-50 text-red-600',
  '客訴處理':     'bg-red-50 text-red-600',
  '維修':         'bg-red-50 text-red-600',

  // 橘 — 回收 / 搬運
  '設備回收搬運': 'bg-orange-50 text-orange-600',
  '回收':         'bg-orange-50 text-orange-600',

  // 藍 — 保養 / 驗水
  '定期保養':     'bg-blue-50 text-blue-600',
  '驗水服務':     'bg-blue-50 text-blue-600',
  '保養':         'bg-blue-50 text-blue-600',

  // 綠 — 安裝 / 工程
  '設備安裝':     'bg-green-50 text-green-600',
  '水處理工程':   'bg-green-50 text-green-600',
  '裝機':         'bg-green-50 text-green-600',
  '安裝':         'bg-green-50 text-green-600',

  // 紫 — 配送 / 送水
  '耗材配送':     'bg-purple-50 text-purple-600',
  '送水服務':     'bg-purple-50 text-purple-600',
  '送水':         'bg-purple-50 text-purple-600',

  // 黃 — 行政 / 報價 / 延退卡
  '合約行政':     'bg-amber-50 text-amber-600',
  '銷售報價':     'bg-amber-50 text-amber-600',
  '諮詢評估':     'bg-amber-50 text-amber-600',
  '其他行政':     'bg-amber-50 text-amber-600',
  '延卡':         'bg-amber-50 text-amber-600',
  '退卡':         'bg-amber-50 text-amber-600',
  '其他':         'bg-gray-100 text-gray-500',
};

export default function ServiceTypeBadge({ type }: { type: ServiceType }) {
  const cls = STYLE[type] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cls}`}>
      {type}
    </span>
  );
}
