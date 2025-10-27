import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

// Format waktu yang lebih mudah dibaca
export const formatReadableTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Baru saja';
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: id,
  });
};
