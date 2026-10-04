export default function SystemLogsTable({ logs = [] }) {
  return (
    <div className="bg-white border border-black rounded-[24px] overflow-x-auto">
      <div className="min-w-[620px]">
        <div className="p-4 bg-black text-white text-[11px] font-black tracking-[0.2em]">
          AUDIT LOGS — {logs.length} EVENTS
        </div>
        <table className="w-full text-xs">
          <thead className="text-black/50 text-[10px] tracking-widest">
            <tr>
              <th className="p-3 text-left">TIME</th>
              <th className="text-left">ACTION</th>
              <th className="text-left">DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {logs.length ? (
              logs.map((log, index) => (
                <tr key={index} className="border-t border-black/10">
                  <td className="p-3">
                    {new Date(log.time || log.sentAt).toLocaleString()}
                  </td>
                  <td className="p-3 font-black">
                    {log.action || 'OTP_EMAIL'}
                  </td>
                  <td className="p-3">
                    {log.to || log.user || 'System'}
                    {log.otp ? ` -> OTP ${log.otp}` : ''}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center opacity-50">
                  No audit events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
