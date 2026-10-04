export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 rounded-xl border text-sm disabled:opacity-40"
      >
        Prev
      </button>
      <span className="text-xs font-bold">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 rounded-xl border text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
