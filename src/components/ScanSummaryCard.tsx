import { ScanSummary } from '@/types';
import HealthGauge from './HealthGauge';

export default function ScanSummaryCard({ summary }: { summary: ScanSummary }) {
  return (
    <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <HealthGauge score={summary.overallHealthScore} />
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
          <StatBlock label="Total" value={summary.totalPackages} color="text-surface-100" />
          <StatBlock label="Critical" value={summary.critical} color="text-red-400" />
          <StatBlock label="High" value={summary.high} color="text-orange-400" />
          <StatBlock label="Medium" value={summary.medium} color="text-yellow-400" />
          <StatBlock label="Healthy" value={summary.low + summary.healthy} color="text-emerald-400" />
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-surface-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
