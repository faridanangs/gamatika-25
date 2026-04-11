'use client';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import { useState } from 'react';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';

export function NavbarHeader() {
  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'Forum Diskusi', link: '/forum' },
    { name: 'Ingfo Loker Cok', link: '/loker' },
    { name: 'Buat CV', link: '/cv' },
    { name: 'Blogs', link: '/blogs' },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton className="px-0 py-0 m-0 bg-transparent">
              <ModeToggle />
            </NavbarButton>
            <NavbarButton variant="primary" href="/login">
              Login
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Button
                key={`mobile-link-${idx}`}
                disabled={item.link == '/loker'|| item.link == '/forum' || item.link == '/blogs' ? true : false}
                className="bg-transparent m-0 px-2 hover:bg-transparent relative"
              >
                {item.link == '/loker' && (
                  <p className="bg-gradient-to-br from-[#b58d6b] to-[#da736d] rounded-lg font-bold text-white absolute -right-12 flex items-center justify-center px-2 py-[1px] top-0">
                    soon
                  </p>
                )}
                <a
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              </Button>
            ))}
            <div className="flex w-full flex-col gap-4">
              <ModeToggle />
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
                href="/login"
              >
                Login
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
