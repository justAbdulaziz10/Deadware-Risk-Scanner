'use client';

import { useState } from 'react';
import { PackageAnalysis } from '@/types';
import RiskBadge from './RiskBadge';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Users,
  AlertCircle,
  Scale,
  Archive,
} from 'lucide-react';

export default function PackageCard({ analysis }: { analysis: PackageAnalysis }) {
  const [expanded, setExpanded] = useState(false);
  const { package: pkg, signals, risk, replacements, error } = analysis;

  return (
    <div className="bg-surface-900/50 border border-surface-800 rounded-xl overflow-hidden hover:border-surface-700 transition-colors">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-800/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-surface-100 truncate">{pkg.name}</span>
              <span className="text-xs text-surface-500 bg-surface-800 px-2 py-0.5 rounded">
                {pkg.version}
              </span>
            </div>
            {signals.description && (
              <p className="text-xs text-surface-500 mt-1 truncate max-w-md">
                {signals.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <RiskBadge level={risk.level} score={risk.overall} />
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-surface-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-surface-500" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-surface-800 p-4 space-y-4 animate-fade-in">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Signals grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <SignalItem
              icon={Clock}
              label="Last Release"
              value={
                signals.daysSinceLastRelease !== null
                  ? `${signals.daysSinceLastRelease} days ago`
                  : 'Unknown'
              }
              warn={signals.daysSinceLastRelease !== null && signals.daysSinceLastRelease > 365}
            />
            <SignalItem
              icon={Users}
              label="Maintainers"
              value={signals.maintainerCount?.toString() ?? 'Unknown'}
              warn={signals.maintainerCount !== null && signals.maintainerCount <= 1}
            />
            <SignalItem
              icon={AlertCircle}
              label="Open Issues"
              value={signals.openIssueCount?.toString() ?? 'N/A'}
              warn={signals.openIssueCount !== null && signals.openIssueCount > 200}
            />
            <SignalItem
              icon={Scale}
              label="License"
              value={signals.license ?? 'Unknown'}
              warn={false}
            />
            <SignalItem
              icon={Archive}
              label="Archived"
              value={
                signals.repositoryArchived === null
                  ? 'N/A'
                  : signals.repositoryArchived
                  ? 'Yes'
                  : 'No'
              }
              warn={signals.repositoryArchived === true}
            />
          </div>

          {/* Risk factors */}
          <div>
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
              Risk Factors
            </h4>
            <div className="space-y-2">
              {risk.factors.map((factor) => (
                <div key={factor.name} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-surface-300">{factor.name}</span>
                      <span className="text-xs text-surface-500">{factor.score}/100</span>
                    </div>
                    <div className="w-full bg-surface-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          factor.score >= 70
                            ? 'bg-red-500'
                            : factor.score >= 40
                            ? 'bg-yellow-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-surface-500 mt-1">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Replacements */}
          {replacements.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                Suggested Replacements
              </h4>
              <div className="space-y-2">
                {replacements.map((r) => (
                  <a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-surface-800/50 border border-surface-700 rounded-lg p-3 hover:border-primary-500/30 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-medium text-surface-200">{r.name}</span>
                      <p className="text-xs text-surface-500">{r.reason}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-surface-500 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-3 pt-2 border-t border-surface-800">
            {signals.repository && (
              <a
                href={signals.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                Repository <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {signals.homepage && (
              <a
                href={signals.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                Homepage <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SignalItem({
  icon: Icon,
  label,
  value,
  warn,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  warn: boolean;
}) {
  return (
    <div className="bg-surface-800/50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3.5 h-3.5 ${warn ? 'text-amber-400' : 'text-surface-500'}`} />
        <span className="text-xs text-surface-500 uppercase tracking-wider">{label}</span>
      </div>
      <span className={`text-sm font-medium ${warn ? 'text-amber-400' : 'text-surface-200'}`}>
        {value}
      </span>
    </div>
  );
}
