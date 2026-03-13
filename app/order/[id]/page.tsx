'use client';

import { use, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import {
  ChevronLeft, Navigation, Phone, Building2, CreditCard,
  User, Tag, AlertCircle, Wrench, FileText, DollarSign,
  CalendarDays, Clock, Radio, MapPin, Camera, X,
  CheckCircle2, RotateCcw, Timer, ClipboardList, Truck, Package,
  History,
} from 'lucide-react';
import { getOrderById } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import ServiceTypeBadge from '@/components/ServiceTypeBadge';

// ─── Mock service history ──────────────────────────────────────────────────────
const SERVICE_HISTORY = [
  { date: '2026-01-15', type: '維修', desc: '出水管漏水修復，更換出水閥', technician: '張志偉', result: '已完成' },
  { date: '2025-11-20', type: '保養', desc: '季度保養：濾芯更換、清潔消毒', technician: '張志偉', result: '已完成' },
  { date: '2025-08-05', type: '保養', desc: '季度保養：濾芯更換', technician: '李大明', result: '已完成' },
  { date: '2025-05-12', type: '維修', desc: '冷水溫控異常，更換溫控元件', technician: '張志偉', result: '已完成' },
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
    { key: 'parts',       label: '用料清單',  Icon: Package },
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

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const order = getOrderById(id);
  if (!order) notFound();

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

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`;
  const duration = order.durationHours === 0.5 ? '0.5 小時' : `${order.durationHours} 小時`;

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

            {/* ─── 基本資訊 (always visible) ─── */}
            <Section title="基本資訊">
              <InfoField icon={Building2}   label="機號"     value={order.erpNo} />
              <InfoField icon={CalendarDays} label="派工日期" value={order.date} />
              <InfoField icon={Tag}          label="派工類型" value={order.serviceType} />
              <InfoField icon={AlertCircle}  label="優先度"   value={order.priority ?? '一般'} />
            </Section>

            {/* ─── 機器位置 (商用客戶才顯示) ─── */}
            {(order.locationBuilding || order.locationFloor) && (
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
                {/* 派工資訊 */}
                <Section title="派工資訊">
                  <InfoField icon={User}         label="指派人"   value={order.assignedBy} />
                  <InfoField icon={User}         label="技術人員" value={order.technician} />
                  <InfoField icon={CalendarDays} label="排程日期" value={order.date} />
                  <InfoField icon={Clock}        label="排程時段" value={`${order.timeStart}–${order.timeEnd}`} />
                  <InfoField icon={Clock}        label="預估工時" value={duration} />
                </Section>

                {/* 服務內容 */}
                {(order.failureCategory || order.modelNumber) && (
                  <Section title="服務內容">
                    {order.failureCategory && (
                      <InfoField icon={Tag}       label="原因分類" value={order.failureCategory} />
                    )}
                    {order.failureType && (
                      <InfoField icon={AlertCircle} label="故障類型" value={order.failureType} />
                    )}
                    <InfoField icon={Wrench} label="設備型號" value={order.modelNumber} />
                    <InfoField icon={Wrench} label="設備數量" value={`${order.deviceCount} 台`} />
                    {order.workDescription && (
                      <InfoField icon={FileText} label="工作說明" value={order.workDescription} fullWidth />
                    )}
                    {order.specialNote && (
                      <InfoField icon={FileText} label="特別備註" value={order.specialNote} fullWidth />
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
                    {SERVICE_HISTORY.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="flex flex-col items-center pt-1">
                          <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                          {i < SERVICE_HISTORY.length - 1 && (
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
                        <span className="text-xs text-green-600 font-medium shrink-0 pt-1">{h.result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ─── 送貨單 tab ─── */}
            {activeTab === 'delivery' && (
              <>
                {/* 客戶資訊 */}
                <Section
                  title="客戶資訊"
                  action={
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-500 text-xs font-semibold"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      導航
                    </a>
                  }
                >
                  <InfoField icon={Building2}  label="客戶類型" value={order.customerType} />
                  <InfoField icon={CreditCard} label="客戶卡號" value={order.cardNo} />
                  <InfoField icon={User}       label="聯絡人"   value={order.contactName} />
                  <InfoField icon={Phone}      label="電話"     value={order.phone} href={`tel:${order.phone}`} />
                  <InfoField icon={MapPin}     label="服務地址" value={order.address} fullWidth />
                </Section>

                {/* 財務資訊 */}
                <Section title="財務資訊（付款資訊）">
                  <InfoField
                    icon={DollarSign}
                    label="服務金額"
                    value={order.serviceAmount !== null ? `$${order.serviceAmount!.toLocaleString()}` : null}
                  />
                  <InfoField icon={CreditCard} label="付款方式" value={order.paymentMethod} />
                  <InfoField icon={Radio}      label="來源管道" value={order.sourceChannel} />
                  <InfoField icon={Building2}  label="所屬營站" value={order.station} />
                </Section>
              </>
            )}

            {/* ─── 用料清單 tab ─── */}
            {activeTab === 'parts' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-3 flex flex-col items-center justify-center gap-2">
                <Package className="w-10 h-10 text-gray-200" />
                <p className="text-sm text-gray-400">尚無用料紀錄</p>
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
