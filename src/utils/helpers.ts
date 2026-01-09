import { formatDistanceToNow, format } from 'date-fns';

export const formatTimeAgo = (date: string | Date): string =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

export const formatDate = (date: string | Date, formatStr = 'PPP'): string =>
  format(new Date(date), formatStr);

export const getFullName = (user: { firstName: string; lastName: string }): string =>
  `${user.firstName} ${user.lastName}`;

export const getInitials = (user: { firstName: string; lastName: string }): string =>
  `\( {user.firstName[0]} \){user.lastName[0]}`.toUpperCase();

export const formatNumber = (num: number): string =>
  new Intl.NumberFormat().format(num);

export const truncateText = (text: string, length: number): string =>
  text.length > length ? `${text.substring(0, length)}...` : text;

export const generateAvatarColor = (seed: string): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const isImageFile = (file: File) => file.type.startsWith('image/');
export const isVideoFile = (file: File) => file.type.startsWith('video/');
