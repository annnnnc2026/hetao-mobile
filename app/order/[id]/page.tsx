'use client';

import { use, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import {
  ChevronLeft, Navigation, Phone, Building2, CreditCard,
  User, Tag, AlertCircle, Wrench, FileText, DollarSign,
  CalendarDays, Clock, Radio, MapPin, Camera, X,
  CheckCircle2, RotateCcw, Timer, ClipboardList, Truck, Package,
  History, Hash, PenLine, Download, QrCode,
} from 'lucide-react';
import { getOrderById, MachineBuilding, MachineFloor } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import ServiceTypeBadge from '@/components/ServiceTypeBadge';

// ─── Mock service history ──────────────────────────────────────────────────────
type HistoryStatus = '已完成' | '進行中' | '已延期';

// 已按日期由新到舊排序；每次保養只換一道濾芯，非每次都換濾芯
const SERVICE_HISTORY: {
  date: string; type: string; desc: string; technician: string; status: HistoryStatus;
}[] = [
  { date: '2026-01-15', type: '維修', desc: '出水管漏水，更換出水閥與止水墊片',       technician: '張志偉', status: '已完成' },
  { date: '2025-11-20', type: '保養', desc: '換第四道濾芯、清缸消毒',                 technician: '張志偉', status: '已完成' },
  { date: '2025-08-10', type: '保養', desc: '換第三道濾芯',                           technician: '李大明', status: '已延期' },
  { date: '2025-05-12', type: '維修', desc: '冷水溫控異常，更換溫控元件',             technician: '張志偉', status: '進行中' },
  { date: '2025-02-18', type: '保養', desc: '換第二道濾芯',                           technician: '王小明', status: '已完成' },
  { date: '2024-11-05', type: '保養', desc: '換第一道濾芯、清缸消毒',                 technician: '張志偉', status: '已完成' },
];

const STATUS_STYLE: Record<HistoryStatus, { dot: string; text: string; label: string }> = {
  '已完成': { dot: 'bg-green-400', text: 'text-green-600', label: '已完成' },
  '進行中': { dot: 'bg-amber-400', text: 'text-amber-500', label: '進行中' },
  '已延期': { dot: 'bg-red-400',   text: 'text-red-500',   label: '已延期' },
};

// ─── Mock parts history (領進料) ───────────────────────────────────────────────
type PartsStatus = '已用料' | '待用料';

const PARTS_HISTORY: {
  date: string; name: string; qty: number; unit: string; status: PartsStatus;
}[] = [
  { date: '2026-03-04', name: '活性碳濾芯 (CTO)',  qty: 1, unit: '支', status: '待用料' },
  { date: '2026-01-15', name: '出水閥',             qty: 1, unit: '個', status: '已用料' },
  { date: '2026-01-15', name: '止水墊片',           qty: 2, unit: '片', status: '已用料' },
  { date: '2025-11-20', name: 'PP 纖維濾芯 5u',    qty: 1, unit: '支', status: '已用料' },
  { date: '2025-08-10', name: 'RO 逆滲透膜 75G',   qty: 1, unit: '支', status: '已用料' },
  { date: '2025-02-18', name: 'UF 中空絲濾芯',     qty: 1, unit: '支', status: '已用料' },
];

// ─── Info field ───────────────────────────────────────────────────────────────
function InfoField({
  icon: Icon, label, value, href, fullWidth = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | null | undefined;
  href?: string;
  fullWidth?: boolean;
}) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className={`flex items-start gap-2 ${fullWidth ? 'col-span-2' : ''}`}>
      <Icon className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-semibold text-blue-500">{String(value)}</a>
        ) : (
          <p className="text-sm font-semibold text-gray-900">{String(value)}</p>
        )}
      </div>
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Section({ title, children, action }: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        {action}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────
type TabKey = 'maintenance' | 'delivery' | 'parts';

function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'maintenance', label: '保養卡資訊', Icon: ClipboardList },
    { key: 'delivery',    label: '送貨單',    Icon: Truck },
    { key: 'parts',       label: '領進料',    Icon: Package },
  ];
  return (
    <div className="bg-gray-100 rounded-2xl p-1 flex gap-1 mb-3">
      {tabs.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            active === key
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────
function BottomSheet({ open, title, onClose, children }: {
  open: boolean; title: string; onClose: () => void; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-w-md mx-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 pb-8">{children}</div>
      </div>
    </>
  );
}

// ─── Pill selector ────────────────────────────────────────────────────────────
function PillGroup({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="mb-5">
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
              value === opt
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Delivery mock data ───────────────────────────────────────────────────────
const DELIVERY_PARTS = [
  { name: '活性碳濾芯 (CTO)', spec: '10 吋標準型', qty: 1, price: 450 },
  { name: 'PP 纖維濾芯 5u',   spec: '10 吋標準型', qty: 1, price: 150 },
];
const DELIVERY_TAX_RATE = 0.05;
const DELIVERY_SUBTOTAL = DELIVERY_PARTS.reduce((s, p) => s + p.price * p.qty, 0);
const DELIVERY_TAX = Math.round(DELIVERY_SUBTOTAL * DELIVERY_TAX_RATE);
const DELIVERY_TOTAL = DELIVERY_SUBTOTAL + DELIVERY_TAX;

// ─── Notification dot ─────────────────────────────────────────────────────────
function NotifDot() {
  return (
    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const order = getOrderById(id);
  if (!order) notFound();

  const buildings: MachineBuilding[] = order.machineBuildings ?? [];

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildings[0]?.id ?? '');
  const [selectedFloorId, setSelectedFloorId] = useState<string>(buildings[0]?.floors[0]?.id ?? '');

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId) ?? buildings[0] ?? null;
  const selectedFloor: MachineFloor | null =
    selectedBuilding?.floors.find((f) => f.id === selectedFloorId) ?? selectedBuilding?.floors[0] ?? null;

  const [sheet, setSheet] = useState<'none' | 'arrived' | 'delay' | 'transfer' | 'complete'>('none');
  const [activeTab, setActiveTab] = useState<TabKey>('maintenance');

  // Delay form
  const [delayReason, setDelayReason] = useState('');
  const [delayDate, setDelayDate] = useState('');

  // Transfer form
  const [transferReason, setTransferReason] = useState('');
  const [transferNote, setTransferNote] = useState('');

  // Complete form
  const [completeResult, setCompleteResult] = useState('');
  const [completeNote, setCompleteNote] = useState('');
  const [actualHours, setActualHours] = useState('0.5');

  // Delivery tab
  const [deliveryPayment, setDeliveryPayment] = useState('現金');

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`;
  const duration = order.durationHours === 0.5 ? '0.5 小時' : `${order.durationHours} 小時`;

  // Machine-level values: prefer selected floor, fall back to order-level
  const machineNo = selectedFloor?.machineNo ?? order.erpNo;
  const modelNumber = selectedFloor?.modelNumber ?? order.modelNumber;
  const workDescription = selectedFloor?.workDescription ?? order.workDescription;
  const specialNote = selectedFloor?.specialNote ?? order.specialNote;

  function handleBuildingSelect(buildingId: string) {
    const b = buildings.find((x) => x.id === buildingId);
    setSelectedBuildingId(buildingId);
    setSelectedFloorId(b?.floors[0]?.id ?? '');
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-28">
        <div className="max-w-md mx-auto">

          {/* ─── Sticky header ─── */}
          <div className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white border-b border-gray-200 sticky top-0 z-30">
            <button onClick={() => router.back()} className="text-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-900 truncate flex-1">
              {order.customerName}
            </span>
          </div>

          <div className="px-4 pt-4 pb-4">

            {/* ─── Title ─── */}
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              <StatusBadge status={order.status} />
              <PriorityBadge priority={order.priority} />
              <ServiceTypeBadge type={order.serviceType} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-1">
              {order.customerName}
            </h1>
            <div className="flex items-center gap-1.5 mb-5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <p className="text-xs text-gray-400">{order.address}</p>
            </div>

            {/* ─── 機器位置（多棟多樓層）─── */}
            {buildings.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 pt-3 pb-4 mb-3">
                <h3 className="text-base font-bold text-gray-900 mb-3">機器位置</h3>

                {/* 建築名稱 tabs */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">建築名稱</p>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {buildings.map((building) => {
                      const hasAlert = building.floors.some((f) => f.needsService);
                      const isActive = selectedBuildingId === building.id;
                      return (
                        <button
                          key={building.id}
                          onClick={() => handleBuildingSelect(building.id)}
                          className={`relative shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                            isActive
                              ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {building.name}
                          {hasAlert && <NotifDot />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 樓層與位置 tags */}
                {selectedBuilding && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">樓層與位置</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedBuilding.floors.map((floor) => {
                        const isActive = selectedFloorId === floor.id;
                        return (
                          <button
                            key={floor.id}
                            onClick={() => setSelectedFloorId(floor.id)}
                            className={`relative px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                              isActive
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-600 border border-gray-200'
                            }`}
                          >
                            {floor.label}
                            {floor.needsService && <NotifDot />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── 舊格式 fallback（無 machineBuildings）─── */}
            {buildings.length === 0 && (order.locationBuilding || order.locationFloor) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
                <h3 className="text-base font-bold text-gray-900 mb-3">機器位置</h3>
                {order.locationBuilding && (
                  <div className="mb-2.5">
                    <p className="text-xs text-gray-400 mb-1.5">建築名稱</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                      {order.locationBuilding}
                    </span>
                  </div>
                )}
                {order.locationFloor && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">樓層與指標物</p>
                    <p className="text-sm font-semibold text-gray-900">{order.locationFloor}</p>
                  </div>
                )}
              </div>
            )}

            {/* ─── Tab bar ─── */}
            <TabBar active={activeTab} onChange={setActiveTab} />

            {/* ─── 保養卡資訊 tab ─── */}
            {activeTab === 'maintenance' && (
              <>
                {/* 基本資訊 + 派工資訊（合併） */}
                <Section title="基本資訊">
                  <InfoField icon={Building2}   label="機號"     value={order.erpNo} />
                  <InfoField icon={CalendarDays} label="派工日期" value={order.date} />
                  <InfoField icon={Tag}          label="派工類型" value={order.serviceType} />
                  <InfoField icon={AlertCircle}  label="優先度"   value={order.priority ?? '一般'} />
                  <InfoField icon={User}         label="指派人"   value={order.assignedBy} />
                  <InfoField icon={User}         label="技術人員" value={order.technician} />
                  <InfoField icon={Clock}        label="排程時段" value={`${order.timeStart}–${order.timeEnd}`} />
                  <InfoField icon={Clock}        label="預估工時" value={duration} />
                </Section>

                {/* 本日服務內容 */}
                {(order.failureCategory || modelNumber) && (
                  <Section title="本日服務內容">
                    {order.failureCategory && (
                      <InfoField icon={Tag}       label="原因分類" value={order.failureCategory} />
                    )}
                    {order.failureType && (
                      <InfoField icon={AlertCircle} label="故障類型" value={order.failureType} />
                    )}
                    <InfoField icon={Wrench} label="設備機號" value={machineNo} />
                    <InfoField icon={Wrench} label="設備型號" value={modelNumber} />
                    <InfoField icon={Building2} label="設備數量" value={`${order.deviceCount} 台`} />
                    {workDescription && (
                      <InfoField icon={FileText} label="工作說明" value={workDescription} fullWidth />
                    )}
                    {specialNote && (
                      <InfoField icon={FileText} label="特別備註" value={specialNote} fullWidth />
                    )}
                  </Section>
                )}

                {/* 完成回報到達時間 */}
                {order.status === '進行中' && order.arrivedAt && (
                  <Section title="完成回報">
                    <InfoField icon={Clock} label="實際到達" value={order.arrivedAt} />
                  </Section>
                )}

                {/* 歷史服務紀錄 */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-gray-400" />
                    <h3 className="text-base font-bold text-gray-900">歷史服務紀錄</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[...SERVICE_HISTORY].sort((a, b) => b.date.localeCompare(a.date)).map((h, i, arr) => {
                      const style = STATUS_STYLE[h.status];
                      return (
                        <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                          <div className="flex flex-col items-center pt-1.5">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                            {i < arr.length - 1 && (
                              <div className="w-px flex-1 bg-gray-100 mt-1.5 min-h-[20px]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs text-gray-400">{h.date}</span>
                              <span className="text-xs font-semibold text-gray-600 px-2 py-0.5 bg-gray-100 rounded-full">{h.type}</span>
                            </div>
                            <p className="text-sm text-gray-800 leading-snug">{h.desc}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{h.technician}</p>
                          </div>
                          <span className={`text-xs font-semibold shrink-0 pt-1 ${style.text}`}>{h.status}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ─── 送貨單 tab ─── */}
            {activeTab === 'delivery' && (
              <>
                {/* 基本資訊 */}
                <Section
                  title="基本資訊"
                  action={
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-semibold">
                      <Download className="w-3.5 h-3.5" />
                      PDF 版本
                    </button>
                  }
                >
                  <InfoField icon={User}         label="客戶名稱"     value={order.customerName} fullWidth />
                  <InfoField icon={User}         label="承辦人"       value={order.contactName} />
                  <InfoField icon={Phone}        label="電話"         value={order.phone} href={`tel:${order.phone}`} />
                  <InfoField icon={MapPin}       label="收款地址"     value={order.address} fullWidth />
                  <InfoField icon={Hash}         label="統編"         value="39503759" />
                  <InfoField icon={CalendarDays} label="日期"         value={order.date} />
                  <InfoField icon={QrCode}       label="客戶卡號（機號）" value={order.cardNo} fullWidth />
                </Section>

                {/* 付款方式 */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
                  <h3 className="text-base font-bold text-gray-900 mb-3">付款方式</h3>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-0.5">
                    {['現金', '刷卡', 'LinePay', '支票', '未收', '合約'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setDeliveryPayment(m)}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          deliveryPayment === m
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">已預收</p>
                  <div className="bg-blue-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-blue-400 mb-1">預計收款日期（未收適用）</p>
                    <p className="text-base font-semibold text-blue-600">2026 年 03 月 15 日</p>
                  </div>
                </div>

                {/* 用料清單 */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
                  <h3 className="text-base font-bold text-gray-900 mb-3">用料清單</h3>
                  <div className="flex items-center text-xs text-gray-400 pb-2 border-b border-gray-100">
                    <span className="flex-1">品名/規格</span>
                    <span className="w-8 text-center">數量</span>
                    <span className="w-14 text-right">單價</span>
                  </div>
                  {DELIVERY_PARTS.map((part, i) => (
                    <div key={i} className="flex items-start py-3 border-b border-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{part.name}</p>
                        <p className="text-xs text-gray-400">{part.spec}</p>
                      </div>
                      <span className="w-8 text-center text-sm text-gray-700 shrink-0">{part.qty}</span>
                      <span className="w-14 text-right text-sm font-semibold text-gray-900 shrink-0">${part.price}</span>
                    </div>
                  ))}
                  <div className="pt-3 text-right space-y-0.5">
                    <p className="text-xs text-gray-400">稅金({Math.round(DELIVERY_TAX_RATE * 100)}%): ${DELIVERY_TAX}</p>
                    <p className="text-sm font-bold text-gray-900">總計: ${DELIVERY_TOTAL}</p>
                  </div>
                </div>

                {/* 備註 */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
                  <h3 className="text-base font-bold text-gray-900 mb-2">備註</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {order.workDescription ?? '客戶反應出水流速稍慢，已更換濾芯並調整壓力。'}
                  </p>
                </div>

                {/* 客戶簽章 */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
                  <h3 className="text-base font-bold text-gray-900 mb-3">客戶簽章</h3>
                  <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-300">
                    <PenLine className="w-8 h-8" />
                    <span className="text-sm">請在此處簽名</span>
                  </div>
                </div>
              </>
            )}

            {/* ─── 領進料 tab ─── */}
            {activeTab === 'parts' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-gray-400" />
                  <h3 className="text-base font-bold text-gray-900">用料紀錄</h3>
                </div>
                <div className="flex flex-col gap-0">
                  {[...PARTS_HISTORY].sort((a, b) => b.date.localeCompare(a.date)).map((p, i, arr) => (
                    <div key={i} className="flex items-start gap-3 pb-3 last:pb-0">
                      <div className="flex flex-col items-center pt-1.5">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === '已用料' ? 'bg-green-400' : 'bg-amber-400'}`} />
                        {i < arr.length - 1 && (
                          <div className="w-px flex-1 bg-gray-100 mt-1.5 min-h-[24px]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-gray-400">{p.date}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            p.status === '已用料'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}>{p.status}</span>
                        </div>
                        <p className="text-sm text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">數量：{p.qty} {p.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ─── Bottom CTA ──────────────────────────────────────────────── */}
      {order.status === '已指派' && (
        <div className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-white border-t border-gray-100 px-4 pt-3 pb-7 flex gap-2">
          <button
            onClick={() => setSheet('delay')}
            className="flex-1 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 flex items-center justify-center gap-1.5"
          >
            <Timer className="w-4 h-4" />
            延期
          </button>
          <button
            onClick={() => setSheet('transfer')}
            className="flex-1 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            轉派
          </button>
          <button
            onClick={() => setSheet('arrived')}
            className="flex-[2] py-3.5 rounded-2xl bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            到達現場
          </button>
        </div>
      )}

      {order.status === '進行中' && (
        <div className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-white border-t border-gray-100 px-4 pt-3 pb-7 flex gap-2">
          <button
            onClick={() => setSheet('delay')}
            className="flex-1 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 flex items-center justify-center gap-1.5"
          >
            <Timer className="w-4 h-4" />
            延期
          </button>
          <button
            onClick={() => setSheet('transfer')}
            className="flex-1 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            轉派
          </button>
          <button
            onClick={() => setSheet('complete')}
            className="flex-[2] py-3.5 rounded-2xl bg-green-500 text-white text-sm font-semibold flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            完成工單
          </button>
        </div>
      )}

      {/* ─── Arrived popup ───────────────────────────────────────────── */}
      {sheet === 'arrived' && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSheet('none')} />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-8">
            <div className="bg-white rounded-2xl p-6 w-full shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-gray-900">已到達現場</h3>
                <button onClick={() => setSheet('none')} className="text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl mb-6">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-sm text-blue-700 font-medium">{order.address}</p>
              </div>
              <button
                onClick={() => setSheet('complete')}
                className="w-full py-3.5 rounded-xl text-sm font-semibold bg-green-500 text-white flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                完成工單
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Delay sheet ─────────────────────────────────────────────── */}
      <BottomSheet open={sheet === 'delay'} title="延期申請" onClose={() => setSheet('none')}>
        <PillGroup
          label="延期原因"
          options={['客戶不在', '零件缺料', '地址錯誤', '設備無法維修', '天候因素', '其他']}
          value={delayReason}
          onChange={setDelayReason}
        />
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-2">改期日期</p>
          <input
            type="date"
            value={delayDate}
            onChange={(e) => setDelayDate(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none"
          />
        </div>
        <button
          disabled={!delayReason || !delayDate}
          className="w-full py-3.5 rounded-xl text-sm font-semibold transition-colors disabled:bg-gray-100 disabled:text-gray-400 enabled:bg-gray-900 enabled:text-white"
        >
          確認延期
        </button>
      </BottomSheet>

      {/* ─── Transfer sheet ───────────────────────────────────────────── */}
      <BottomSheet open={sheet === 'transfer'} title="轉派申請" onClose={() => setSheet('none')}>
        <PillGroup
          label="轉派原因"
          options={['非專業範圍', '需要支援', '區域調度', '人力不足', '其他']}
          value={transferReason}
          onChange={setTransferReason}
        />
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-2">補充說明</p>
          <textarea
            rows={3}
            placeholder="補充轉派原因或備註..."
            value={transferNote}
            onChange={(e) => setTransferNote(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none"
          />
        </div>
        <button
          disabled={!transferReason}
          className="w-full py-3.5 rounded-xl text-sm font-semibold transition-colors disabled:bg-gray-100 disabled:text-gray-400 enabled:bg-gray-900 enabled:text-white"
        >
          確認轉派
        </button>
      </BottomSheet>

      {/* ─── Complete sheet ───────────────────────────────────────────── */}
      <BottomSheet open={sheet === 'complete'} title="完成回報" onClose={() => setSheet('none')}>
        <PillGroup
          label="處理結果"
          options={['已完成', '部分完成', '無法處理', '客戶不在']}
          value={completeResult}
          onChange={setCompleteResult}
        />
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-2">處理說明</p>
          <textarea
            rows={3}
            placeholder="簡述處理過程或發現..."
            value={completeNote}
            onChange={(e) => setCompleteNote(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none"
          />
        </div>
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-2">實際工時（小時）</p>
          <input
            type="number"
            step="0.5"
            min="0"
            value={actualHours}
            onChange={(e) => setActualHours(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none"
          />
        </div>
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-2">現場照片（最多 5 張）</p>
          <button className="w-28 h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 bg-white">
            <Camera className="w-6 h-6" />
            <span className="text-xs">拍照</span>
          </button>
        </div>
        <button
          disabled={!completeResult}
          className="w-full py-3.5 rounded-xl text-sm font-semibold transition-colors disabled:bg-gray-100 disabled:text-gray-400 enabled:bg-gray-900 enabled:text-white"
        >
          提交回報
        </button>
      </BottomSheet>
    </>
  );
}
