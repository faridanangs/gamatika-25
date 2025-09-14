// components/NavbarWrapper.js
'use client';

import { NavbarHeader } from '@/components/Navbar';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

export default function NavbarWrapper({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith('/dashboard');

  return (
    <SessionProvider>
      {!hideNavbar && <NavbarHeader />}
      <main>{children}</main>
    </SessionProvider>
  );
}
