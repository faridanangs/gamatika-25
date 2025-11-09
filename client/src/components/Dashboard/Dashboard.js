'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/ModeToggle';
import LogoutButton from '@/components/LogoutButton';
// import Navbar from '@/components/Navbar';

const menuItems = [
  { id: 'profile', label: 'Profil', icon: '👤', href: '/dashboard/profile' },
  { id: 'forum', label: 'Forum', icon: '📢', href: '/dashboard/forum' },
  {
    id: 'artikel',
    label: 'Buat Artikel',
    icon: '📰',
    href: '/dashboard/artikel',
  },
  { id: 'cv', label: 'Buat CV', icon: '📄', href: '/dashboard/cv' },
  {
    id: 'E-Book & Jurnal',
    label: 'E-Book & Jurnal',
    icon: '📚',
    href: '/dashboard/materi',
  },
  { id: 'chat', label: 'Chat dengan AI', icon: '🤖', href: '/dashboard/chat' },
  // {
  //   id: 'langganan',
  //   label: 'Berlangganan',
  //   icon: '🈺',
  //   href: '/dashboard/langganan',
  // },
];

export default function DashboardPage({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const activeItem =
    menuItems.find((item) => pathname === item.href)?.id || 'dashboard';

  return (
    <div className="flex min-h-screen bg-card w-full mx-auto max-w-440 overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
      `}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                      ${
                        activeItem === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-border">
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 bg-card ">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 rounded-lg hover:bg-accent"
                onClick={() => setSidebarOpen(true)}
              >
                ☰
              </button>
              <div className="">
                <div className="flex items-center gap-3">
                  <img
                    src="/deltacivitas-icon.png"
                    alt="logo"
                    width={50}
                    height={50}
                  />
                  <div>
                    <h1 className="text-xl font-bold">Delta Civitas</h1>
                    <p className="text-xs text-muted-foreground">
                      Dashboard Science
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 min-h-screen md:p-6 dark:bg-card">
          {children}
        </main>
      </div>
    </div>
  );
}
