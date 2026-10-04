import Loader from './Loader';
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-7 py-3.5 text-sm',
  };
  const variants = {
    primary: 'bg-black text-white hover:bg-zinc-800 border border-black',
    secondary: 'bg-white text-black border border-black hover:bg-zinc-50',
    ghost: 'bg-transparent text-black hover:bg-black/5',
    danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-600',
  };
  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? <Loader size="sm" /> : children}
    </button>
  );
}
