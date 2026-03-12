import BottomNav from '@/components/BottomNav';
import { TECHNICIAN_NAME, STATION_NAME, ZONE_NAME } from '@/lib/data';

export default function ProfilePage() {
  const firstChar = TECHNICIAN_NAME.charAt(0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-5 pt-12 pb-4 border-b border-gray-200 bg-white">
          <h1 className="text-lg font-bold text-gray-900">個人資訊</h1>
        </div>

        {/* Profile section */}
        <div className="flex flex-col items-center pt-16 pb-8">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-5">
            <span className="text-3xl font-medium text-gray-500">{firstChar}</span>
          </div>

          {/* Name */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{TECHNICIAN_NAME}</h2>

          {/* Role + station */}
          <p className="text-sm text-gray-400">外勤技術人員</p>
          <p className="text-sm text-gray-400">{ZONE_NAME} · {STATION_NAME}</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
