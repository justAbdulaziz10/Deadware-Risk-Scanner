'use client';

import { useState } from 'react';
import { PackageAnalysis } from '@/types';
import RiskBadge from './RiskBadge';
import { useT } from './I18nProvider';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Users,
  AlertCircle,
  Scale,
  Archive,
  ShieldAlert,
  Ban,
  TrendingUp,
} from 'lucide-react';

export default function PackageCard({ analysis }: { analysis: PackageAnalysis }) {
  const [expanded, setExpanded] = useState(false);
  const t = useT();
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
              {signals.deprecated && (
                <span className="text-[10px] font-semibold bg-red-500/15 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Ban className="w-3 h-3" /> {t.pkg_deprecated}
                </span>
              )}
              {signals.vulnerabilities.length > 0 && (
                <span className="text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> {signals.vulnerabilities.length} CVE{signals.vulnerabilities.length > 1 ? 's' : ''}
                </span>
              )}
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

          {/* Deprecation warning */}
          {signals.deprecated && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
              <Ban className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-red-400">{t.pkg_deprecated_label}</span>
                <p className="text-xs text-red-400/80 mt-0.5">{signals.deprecated}</p>
              </div>
            </div>
          )}

          {/* Vulnerabilities */}
          {signals.vulnerabilities.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                {t.pkg_vulns_title} ({signals.vulnerabilities.length})
              </h4>
              <div className="space-y-1.5">
                {signals.vulnerabilities.slice(0, 10).map((vuln) => (
                  <a
                    key={vuln.id}
                    href={vuln.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-red-500/5 border border-red-500/10 rounded-lg p-2.5 hover:border-red-500/30 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-medium text-surface-200">{vuln.id}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          vuln.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          vuln.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                          vuln.severity === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400' :
                          vuln.severity === 'LOW' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-surface-700 text-surface-400'
                        }`}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="text-xs text-surface-500 mt-1 truncate">{vuln.summary}</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-surface-500 shrink-0 ml-2" />
                  </a>
                ))}
                {signals.vulnerabilities.length > 10 && (
                  <p className="text-xs text-surface-500 text-center py-1">
                    +{signals.vulnerabilities.length - 10} {t.pkg_more_vulns}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Signals grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <SignalItem
              icon={Clock}
              label={t.pkg_last_release}
              value={
                signals.daysSinceLastRelease !== null
                  ? `${signals.daysSinceLastRelease} ${t.pkg_days_ago}`
                  : t.pkg_unknown
              }
              warn={signals.daysSinceLastRelease !== null && signals.daysSinceLastRelease > 365}
            />
            <SignalItem
              icon={Users}
              label={t.pkg_maintainers}
              value={signals.maintainerCount?.toString() ?? t.pkg_unknown}
              warn={signals.maintainerCount !== null && signals.maintainerCount <= 1}
            />
            <SignalItem
              icon={AlertCircle}
              label={t.pkg_open_issues}
              value={signals.openIssueCount?.toString() ?? t.pkg_na}
              warn={signals.openIssueCount !== null && signals.openIssueCount > 200}
            />
            <SignalItem
              icon={Scale}
              label={t.pkg_license}
              value={signals.license ?? t.pkg_unknown}
              warn={false}
            />
            <SignalItem
              icon={TrendingUp}
              label={t.pkg_weekly_downloads}
              value={
                signals.weeklyDownloads !== null
                  ? formatDownloads(signals.weeklyDownloads)
                  : t.pkg_na
              }
              warn={signals.weeklyDownloads !== null && signals.weeklyDownloads < 100}
            />
            <SignalItem
              icon={Archive}
              label={t.pkg_archived}
              value={
                signals.repositoryArchived === null
                  ? t.pkg_na
                  : signals.repositoryArchived
                  ? t.pkg_yes
                  : t.pkg_no
              }
              warn={signals.repositoryArchived === true}
            />
          </div>

          {/* Risk factors */}
          <div>
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
              {t.pkg_risk_factors}
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
                {t.pkg_replacements}
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
                {t.pkg_repository} <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {signals.homepage && (
              <a
                href={signals.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                {t.pkg_homepage} <ExternalLink className="w-3 h-3" />
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

function formatDownloads(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}
