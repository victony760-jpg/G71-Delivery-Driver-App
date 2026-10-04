export default function Table({ columns, data, emptyText = 'No data' }) {
  if (!data?.length)
    return (
      <div className="py-16 text-center text-sm text-zinc-500 border border-dashed rounded-2xl">
        {emptyText}
      </div>
    );
  return (
    <div className="overflow-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 text-[11px] uppercase tracking-widest text-zinc-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-5 py-3 text-left whitespace-nowrap">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {data.map((row, i) => (
            <tr key={row._id || i} className="hover:bg-zinc-50/50">
              {columns.map((c) => (
                <td key={c.key} className="px-5 py-3.5">
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
