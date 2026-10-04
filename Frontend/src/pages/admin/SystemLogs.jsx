import SystemLogsTable from '../../components/admin/SystemLogsTable.jsx';
import BackButton from '../../components/common/BackButton.jsx';

export default function SystemLogs() {
  const logs = [
    { t: '09:02 AM', a: 'Admin approved G71-8392', u: 'admin@g71.com' },
    { t: '09:35 AM', a: 'Driver Emeka picked G71-8392', u: 'driver@g71.com' },
    { t: '11:20 AM', a: 'Status update: G71-8392 → in_transit', u: 'system' },
  ];
  return (
    <div className="p-6 lg:p-10">
      <BackButton />
      <h1 className="text-4xl font-black mt-3">System Logs</h1>
      <p className="text-sm text-black/50 mt-1">
        Audit trail for defence — every action logged
      </p>
      <div className="mt-8">
        <SystemLogsTable
          logs={logs.map((log) => ({
            time: log.t,
            action: log.a,
            user: log.u,
          }))}
        />
      </div>
    </div>
  );
}
