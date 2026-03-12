'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Phone, Navigation, MapPin, Clock, Wrench, FileText, User, Hash } from 'lucide-react';
import { motion } from 'motion/react';
import { TODAY_ORDERS, RECENT_ORDERS } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import ServiceTypeBadge from '@/components/ServiceTypeBadge';

const ALL_ORDERS = [
  ...TODAY_ORDERS,
  ...RECENT_ORDERS,
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = ALL_ORDERS.find((o) => o.id === id);

  if (!order) notFound();

  const duration = order.durationHours === 0.5 ? '0.5h' : `${order.durationHours}h`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`;

  const fields = [
    { icon: Hash,      label: '工單編號',  value: order.id },
    { icon: Wrench,    label: '機型',      value: order.modelNumber },
    { icon: MapPin,    label: '地址',      value: order.address },
    { icon: Phone,     label: '聯絡電話',  value: order.phone },
    { icon: Clock,     label: '預估時長',  value: duration },
    { icon: FileText,  label: '備註',      value: order.note ?? '—' },
  ];

  const statusActions: Record<string, { label: string; color: string }> = {
    '已指派': { label: '開始作業', color: 'bg-blue-600' },
    '進行中': { label: '標記完成', color: 'bg-emerald-600' },
    '已完成': { label: '已完成', color: 'bg-zinc-300' },
    '延期':   { label: '重新排程', color: 'bg-amber-500' },
  };
  const action = statusActions[order.status];

  return (
    <div className="min-h-screen bg-zinc-50 pb-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-12 pb-4">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-600 active:bg-zinc-100 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-zinc-900 tracking-tight">工單詳情</h1>
          </div>
        </div>

        {/* Customer card */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-6 mb-4 bg-white rounded-2xl border border-zinc-100 shadow-sm p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <StatusBadge status={order.status} />
              <PriorityBadge priority={order.priority} />
              <ServiceTypeBadge type={order.serviceType} />
            </div>
            <span className="text-sm font-medium font-mono text-zinc-400 shrink-0 ml-2">
              {order.timeStart}–{order.timeEnd}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-zinc-400 shrink-0" />
            <p className="font-bold text-zinc-900 text-base">{order.customerName}</p>
          </div>
        </motion.div>

        {/* Info grid */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.06 }}
          className="mx-6 mb-4 bg-white rounded-2xl border border-zinc-100 shadow-sm p-4"
        >
          <div className="grid grid-cols-2 gap-3">
            {fields.map(({ icon: Icon, label, value }) => (
              <div key={label} className={`flex items-start gap-2 ${label === '地址' || label === '備註' ? 'col-span-2' : ''}`}>
                <Icon className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</p>
                  <p className="text-xs font-medium text-zinc-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="mx-6 flex gap-3"
        >
          <a
            href={`tel:${order.phone}`}
            className="w-12 h-12 flex items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 active:bg-zinc-100 transition-colors"
          >
            <Phone className="w-5 h-5" />
          </a>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 active:bg-zinc-100 transition-colors"
          >
            <Navigation className="w-5 h-5" />
          </a>
          <button
            className={`flex-1 h-12 rounded-xl text-white text-xs font-bold ${action.color} transition-opacity active:opacity-80`}
            disabled={order.status === '已完成'}
          >
            {action.label}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
