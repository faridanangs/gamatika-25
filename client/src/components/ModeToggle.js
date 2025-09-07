'use client';

import * as React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (resolvedTheme === 'light') setTheme('dark');
    else setTheme('light');
  };

  if (!mounted) return null; // ⛔ Biar gak error pas SSR

  return (
    <Button variant="outline" size="icon" onClick={cycleTheme}>
      {resolvedTheme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
      {resolvedTheme === 'dark' && (
        <Moon className="h-[1.2rem] w-[1.2rem] text-white" />
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
