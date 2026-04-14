'use client';

import Link from 'next/link';
import { Phone, MapPin, Clock, Wrench, Navigation } from 'lucide-react';
import { WorkOrder } from '@/lib/data';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import ServiceTypeBadge from './ServiceTypeBadge';

interface Props {
  order: WorkOrder;
}

export default function OrderCard({ order }: Props) {
  const duration = order.durationHours === 0.5 ? '0.5h' : `${order.durationHours}h`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`;
  const telUrl = `tel:${order.phone}`;
  const showAmount = order.serviceType === '裝機' && order.serviceAmount;

  return (
    <Link href={`/order/${order.id}`}>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors">
        {/* Top row: status badges + amount/time */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge status={order.status} />
            <PriorityBadge priority={order.priority} />
          </div>
          <div className="flex items-center gap-2">
            {showAmount && (
              <span className="text-xs font-semibold text-amber-500">
                $ {order.serviceAmount!.toLocaleString()}
              </span>
            )}
            <span className="text-sm font-medium text-gray-400 tabular-nums">
              {order.timeStart}–{order.timeEnd}
            </span>
          </div>
        </div>

        {/* Service type + customer name */}
        <div className="flex items-center gap-2 mb-1">
          <ServiceTypeBadge type={order.serviceType} />
          <span className="font-bold text-gray-900 text-base leading-snug">{order.customerName}</span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
          <span className="text-xs text-gray-400">{order.address}</span>
        </div>

        {/* Bottom: model, duration, actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" />
              {order.erpNo}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </span>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
            <a
              href={telUrl}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 active:bg-gray-100 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-blue-500 text-white text-xs font-semibold active:bg-blue-600 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              導航
            </a>
          </div>
        </div>
      </div>
    </Link>
  );
}
