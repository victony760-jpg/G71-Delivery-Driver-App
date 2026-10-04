import { STATUS_COLORS } from '../../utils/constants';
export default function Badge({ status }) {
  const cls =
    STATUS_COLORS[status] || 'bg-zinc-100 text-zinc-600 border-zinc-200';
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${cls}`}
    >
      {status?.replaceAll('_', ' ')}
    </span>
  );
}
