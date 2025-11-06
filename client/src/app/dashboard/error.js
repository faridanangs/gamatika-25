'use client'; // Wajib ada

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {}, [error]);

  return (
    <div>
      <h2>Terjadi Kesalahan!</h2>
      <p>{error.message || 'Sesuatu yang tidak beres telah terjadi.'}</p>
      <button onClick={() => reset()}>Coba Lagi</button>
    </div>
  );
}
