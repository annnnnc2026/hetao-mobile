import { ServiceType } from '@/lib/data';

export default function ServiceTypeBadge({ type }: { type: ServiceType }) {
  const isRed = type === '延卡' || type === '退卡';
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
      isRed ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'
    }`}>
      {type}
    </span>
  );
}
