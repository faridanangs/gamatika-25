'use client';

import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggingOut(false);
      signOut({
        callbackUrl: '/',
      });
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
        </>
      ) : (
        <>
          <span>🚪</span>
          <span>LogOut</span>
        </>
      )}
    </button>
  );
}
