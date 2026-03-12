'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, ClipboardList, User } from 'lucide-react';

const tabs = [
  { href: '/recent', label: '近期派工', Icon: Calendar },
  { href: '/',      label: '今日派工', Icon: ClipboardList },
  { href: '/profile', label: '我的',   Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-zinc-200 z-50">
      <div className="max-w-md mx-auto flex px-6 py-3">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${active ? 'text-zinc-900' : 'text-zinc-400'}`}
              />
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${active ? 'text-zinc-900' : 'text-zinc-400'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
