'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/ModeToggle';
import LogoutButton from '@/components/LogoutButton';
// import Navbar from '@/components/Navbar';

const menuItems = [
  { id: 'profile', label: 'Profil', icon: '👤', href: '/dashboard/profile' },
  { id: 'forum', label: 'Forum', icon: '📢', href: '/dashboard/forum' },
  { id: 'jadwal', label: 'Jadwal', icon: '📅', href: '/dashboard/jadwal' },
  { id: 'materi', label: 'Materi', icon: '📚', href: '/dashboard/materi' },
  { id: 'chat', label: 'Chat dengan AI', icon: '🤖', href: '/dashboard/chat' },
];

export default function DashboardPage({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const activeItem =
    menuItems.find((item) => pathname === item.href)?.id || 'dashboard';

  return (
    <div className="flex h-screen bg-card">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
      `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
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

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-card ">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 rounded-lg hover:bg-accent"
                onClick={() => setSidebarOpen(true)}
              >
                ☰
              </button>
              {/* <h2 className="text-xl font-semibold">Dashboard</h2> */}
              <div className="">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                    ∑
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">GAMATIKA 25</h1>
                    <p className="text-xs text-muted-foreground">
                      Dashboard Matematika
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Logo */}
            <div className="flex items-center gap-4">
              <ModeToggle />
              {/* <Navbar /> */}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 dark:bg-card">
          {children}
        </main>
      </div>
    </div>
  );
}
