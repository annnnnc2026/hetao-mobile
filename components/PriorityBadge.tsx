import { AlertTriangle, Info } from 'lucide-react';
import { Priority } from '@/lib/data';

export default function PriorityBadge({ priority }: { priority: Priority }) {
  if (!priority) return null;

  if (priority === '緊急') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-500">
        <AlertTriangle className="w-3 h-3" />
        緊急
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-orange-100 text-orange-500">
      <Info className="w-3 h-3" />
      急件
    </span>
  );
}
