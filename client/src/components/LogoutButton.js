'use client';

import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      console.log('Logging out...');
      setIsLoggingOut(false);
      redirect('/');
      // Implementasi logout sebenarnya
    }, 1000);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`
        w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-colors
        ${
          isLoggingOut
            ? 'bg-muted text-muted-foreground'
            : 'bg-destructive text-destructive-foreground hover:bg-destructive/80'
        }
      `}
    >
      {isLoggingOut ? (
        <>
          <span className="animate-spin">⏳</span>
          <span>Mengeluarkan...</span>
        </>
      ) : (
        <>
          <span>🚪</span>
          <span>Keluar</span>
        </>
      )}
    </button>
  );
}
