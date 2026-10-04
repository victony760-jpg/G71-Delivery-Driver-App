export const formatDate = (iso) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('en-NG', {
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: true,
    });
  } catch {
    return '-';
  }
};
export const relativeTime = (iso) => {
  if (!iso) return '-';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};
