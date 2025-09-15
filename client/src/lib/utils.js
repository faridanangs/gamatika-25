import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(isoString) {
  const date = new Date(isoString);

  const tgl = date.getDate().toString().padStart(2, '0');
  const bln = (date.getMonth() + 1).toString().padStart(2, '0'); // bulan mulai dari 0
  const thn = date.getFullYear();

  const jam = date.getHours().toString().padStart(2, '0');
  const menit = date.getMinutes().toString().padStart(2, '0');
  const detik = date.getSeconds().toString().padStart(2, '0');

  return `${tgl}-${bln}-${thn} ${jam}:${menit}:${detik}`;
}
