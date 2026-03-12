import { AlertTriangle, Info } from 'lucide-react';
import { Priority } from '@/lib/data';

export default function PriorityBadge({ priority }: { priority: Priority }) {
  if (!priority) return null;

  if (priority === '緊急') {
    return (
      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest rounded-lg px-2 py-1 bg-red-50 text-red-500">
        <AlertTriangle className="w-3 h-3" />
        緊急
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest rounded-lg px-2 py-1 bg-amber-50 text-amber-500">
      <Info className="w-3 h-3" />
      急件
    </span>
  );
}
