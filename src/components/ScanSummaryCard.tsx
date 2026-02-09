import { ScanSummary } from '@/types';
import HealthGauge from './HealthGauge';

export default function ScanSummaryCard({ summary }: { summary: ScanSummary }) {
  return (
    <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <HealthGauge score={summary.overallHealthScore} />
        <div className="flex-1 w-full space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <StatBlock label="Total" value={summary.totalPackages} color="text-surface-100" />
            <StatBlock label="Critical" value={summary.critical} color="text-red-400" />
            <StatBlock label="High" value={summary.high} color="text-orange-400" />
            <StatBlock label="Medium" value={summary.medium} color="text-yellow-400" />
            <StatBlock label="Healthy" value={summary.low + summary.healthy} color="text-emerald-400" />
          </div>
          {(summary.totalVulnerabilities > 0 || summary.deprecatedCount > 0) && (
            <div className="flex items-center gap-4 pt-3 border-t border-surface-800 flex-wrap">
              {summary.totalVulnerabilities > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-red-400 font-semibold">{summary.totalVulnerabilities}</span>
                  <span className="text-surface-500">known vulnerabilit{summary.totalVulnerabilities === 1 ? 'y' : 'ies'}</span>
                </div>
              )}
              {summary.deprecatedCount > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-amber-400 font-semibold">{summary.deprecatedCount}</span>
                  <span className="text-surface-500">deprecated package{summary.deprecatedCount === 1 ? '' : 's'}</span>
                </div>
              )}
            </div>
          )}
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
