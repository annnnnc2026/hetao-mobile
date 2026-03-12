import { cn } from '@/lib/cn';
import { OrderStatus } from '@/lib/data';

const STYLES: Record<OrderStatus, string> = {
  '已指派': 'bg-blue-100 text-blue-500',
  '進行中': 'bg-orange-100 text-orange-500',
  '已完成': 'bg-green-100 text-green-600',
  '延期':   'bg-gray-100 text-gray-500',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', STYLES[status])}>
      {status}
    </span>
  );
}
