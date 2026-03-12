import { cn } from '@/lib/cn';
import { OrderStatus } from '@/lib/data';

const STYLES: Record<OrderStatus, string> = {
  '已指派': 'bg-gray-100 text-gray-500',
  '進行中': 'bg-amber-50 text-amber-600',
  '已完成': 'bg-emerald-50 text-emerald-600',
  '延期':   'bg-red-50 text-red-600',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn(
      'text-[9px] font-bold uppercase tracking-widest rounded-lg px-2 py-1',
      STYLES[status]
    )}>
      {status}
    </span>
  );
}
