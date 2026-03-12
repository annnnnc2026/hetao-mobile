'use client';

import { motion } from 'motion/react';
import { User, Phone, MapPin, Wrench, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { TECHNICIAN_NAME, TODAY_ORDERS, RECENT_ORDERS } from '@/lib/data';

const PROFILE = {
  name: TECHNICIAN_NAME,
  id: 'T-2024-018',
  phone: '0912-345-678',
  zone: '新竹縣市',
  specialties: ['飲水機維修', '淨水器保養', '管線安裝'],
  joinDate: '2021-03-15',
};

export default function ProfilePage() {
  const completedToday = TODAY_ORDERS.filter((o) => o.status === '已完成').length;
  const completedTotal = RECENT_ORDERS.filter((o) => o.status === '已完成').length;
  const avgDuration = (() => {
    const done = RECENT_ORDERS.filter((o) => o.status === '已完成');
    if (!done.length) return '—';
    const avg = done.reduce((sum, o) => sum + o.durationHours, 0) / done.length;
    return `${avg.toFixed(1)}h`;
  })();

  const stats = [
    { label: '今日完成', value: `${completedToday}`, unit: '筆', icon: CheckCircle2 },
    { label: '本週完成', value: `${completedTotal}`, unit: '筆', icon: Wrench },
    { label: '平均工時', value: avgDuration, unit: '', icon: Clock },
  ];

  const menuItems = [
    { label: '服務技能設定', desc: '管理您的技能標籤' },
    { label: '服務區域', desc: PROFILE.zone },
    { label: '通知設定', desc: '推播與提醒' },
    { label: '關於應用程式', desc: 'v1.0.0' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <div className="max-w-md mx-auto">
        <div className="px-6 pt-12 pb-6">
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">我的</h1>
        </div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-6 mb-6 bg-white rounded-2xl border border-zinc-100 shadow-sm p-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-bold text-zinc-900 text-lg">{PROFILE.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">工號 {PROFILE.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">手機</p>
                <p className="text-xs font-medium text-zinc-800">{PROFILE.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">服務區域</p>
                <p className="text-xs font-medium text-zinc-800">{PROFILE.zone}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">專業技能</p>
            <div className="flex flex-wrap gap-1.5">
              {PROFILE.specialties.map((s) => (
                <span key={s} className="bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest rounded-lg px-2 py-1">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.06 }}
          className="mx-6 mb-6 grid grid-cols-3 gap-2"
        >
          {stats.map(({ label, value, unit, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-3 text-center">
              <Icon className="w-4 h-4 text-zinc-400 mx-auto mb-1" />
              <p className="text-lg font-extrabold text-zinc-900 leading-tight">
                {value}<span className="text-xs font-medium text-zinc-400">{unit}</span>
              </p>
              <p className="text-[10px] font-medium text-zinc-400 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Menu */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="mx-6 bg-white rounded-2xl border border-zinc-100 shadow-sm divide-y divide-zinc-100"
        >
          {menuItems.map(({ label, desc }) => (
            <button key={label} className="w-full flex items-center justify-between px-4 py-3.5 active:bg-zinc-50 transition-colors">
              <div className="text-left">
                <p className="text-sm font-medium text-zinc-800">{label}</p>
                <p className="text-xs font-medium text-zinc-400">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
            </button>
          ))}
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
