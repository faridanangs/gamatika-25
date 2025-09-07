'use client';

import { NavbarHeader } from '@/components/Navbar';
import { usePathname } from 'next/navigation';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith('/dashboard');

  if (hideNavbar) return null;

  return <NavbarHeader />;
}
