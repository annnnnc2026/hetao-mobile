import { cn } from '@/lib/cn';
import { ServiceType } from '@/lib/data';

const STYLES: Record<ServiceType, string> = {
  '維修': 'bg-zinc-100 text-zinc-600',
  '保養': 'bg-zinc-100 text-zinc-600',
  '安裝': 'bg-zinc-100 text-zinc-600',
  '回收': 'bg-zinc-100 text-zinc-600',
};

export default function ServiceTypeBadge({ type }: { type: ServiceType }) {
  return (
    <span className={cn(
      'text-[9px] font-bold uppercase tracking-widest rounded-lg px-2 py-1',
      STYLES[type]
    )}>
      {type}
    </span>
  );
}
