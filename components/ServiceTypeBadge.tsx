import { ServiceType } from '@/lib/data';

export default function ServiceTypeBadge({ type }: { type: ServiceType }) {
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
      {type}
    </span>
  );
}
