import { RiskLevel } from '@/types';
import clsx from 'clsx';

const config: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  critical: { bg: 'bg-red-500/15 border-red-500/30', text: 'text-red-400', label: 'CRITICAL' },
  high: { bg: 'bg-orange-500/15 border-orange-500/30', text: 'text-orange-400', label: 'HIGH' },
  medium: { bg: 'bg-yellow-500/15 border-yellow-500/30', text: 'text-yellow-400', label: 'MEDIUM' },
  low: { bg: 'bg-green-500/15 border-green-500/30', text: 'text-green-400', label: 'LOW' },
  healthy: { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400', label: 'HEALTHY' },
};

export default function RiskBadge({ level, score }: { level: RiskLevel; score?: number }) {
  const c = config[level];
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border',
        c.bg,
        c.text
      )}
    >
      {c.label}
      {score !== undefined && <span className="opacity-75">({score})</span>}
    </span>
  );
}
