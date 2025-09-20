'use client'; // Wajib ada

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error ke layanan monitoring (contoh: Sentry, LogRocket)
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Terjadi Kesalahan!</h2>
      <p>{error.message || 'Sesuatu yang tidak beres telah terjadi.'}</p>
      <button
        onClick={
          // Mencoba untuk me-render ulang segmen
          () => reset()
        }
      >
        Coba Lagi
      </button>
    </div>
  );
}
