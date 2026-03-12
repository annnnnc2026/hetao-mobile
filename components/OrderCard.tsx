'use client';

import Link from 'next/link';
import { Phone, MapPin, Clock, Wrench, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { WorkOrder } from '@/lib/data';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import ServiceTypeBadge from './ServiceTypeBadge';

interface Props {
  order: WorkOrder;
  index?: number;
}

export default function OrderCard({ order, index = 0 }: Props) {
  const duration = order.durationHours === 0.5 ? '0.5h' : `${order.durationHours}h`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`;
  const telUrl = `tel:${order.phone}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Link href={`/order/${order.id}`}>
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 hover:shadow-lg hover:shadow-zinc-900/20 transition-shadow active:scale-[0.99]">
          {/* Top row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <StatusBadge status={order.status} />
              <PriorityBadge priority={order.priority} />
            </div>
            <span className="text-sm font-medium font-mono text-zinc-400">
              {order.timeStart}–{order.timeEnd}
            </span>
          </div>

          {/* Customer name + service type */}
          <div className="flex items-center gap-2 mb-1.5">
            <ServiceTypeBadge type={order.serviceType} />
            <span className="font-bold text-zinc-900 text-base leading-tight">{order.customerName}</span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
            <span className="text-xs font-medium text-zinc-400">{order.address}</span>
          </div>

          {/* Bottom: model, duration, actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-medium text-zinc-400">
              <span className="flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" />
                {order.modelNumber}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {duration}
              </span>
            </div>

            <div
              className="flex items-center gap-2"
              onClick={(e) => e.preventDefault()}
            >
              <a
                href={telUrl}
                onClick={(e) => e.stopPropagation()}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-500 active:bg-zinc-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-blue-600 text-white text-xs font-bold active:bg-blue-700 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                導航
              </a>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
