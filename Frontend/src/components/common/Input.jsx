export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </label>
      <input
        className={`w-full px-4 py-3 rounded-xl border bg-white outline-none text-sm ${error ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-zinc-200 focus:ring-2 focus:ring-black focus:border-black'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
