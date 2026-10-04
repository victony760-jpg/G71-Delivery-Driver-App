export default function Loader({ size = 'md', fullScreen }) {
  const s = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  }[size];
  const spinner = (
    <div
      className={`${s} rounded-full border-black border-t-transparent animate-spin`}
    />
  );
  if (fullScreen)
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    );
  return spinner;
}
