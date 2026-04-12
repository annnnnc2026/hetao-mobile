'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, ClipboardList, Package, BarChart2 } from 'lucide-react';

const tabs = [
  { href: '/recent',  label: '近期派工', Icon: Calendar },
  { href: '/',        label: '今日派工', Icon: ClipboardList },
  { href: '/materials', label: '我的餘料', Icon: Package },
  { href: '/report',  label: '營業日報表', Icon: BarChart2 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5"
            >
              <Icon className={`w-5 h-5 transition-colors ${active ? 'text-gray-900' : 'text-gray-400'}`} />
              <span className={`text-[10px] transition-colors ${active ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
