export default function Select({
  label,
  error,
  children,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </label>
      <select
        className={`w-full px-4 py-3 rounded-xl border bg-white outline-none text-sm ${error ? 'border-red-500' : 'border-zinc-200 focus:ring-2 focus:ring-black'} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
