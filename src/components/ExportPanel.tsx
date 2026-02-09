'use client';

import { ScanResult } from '@/types';
import {
  exportToJSON,
  exportToPDF,
  exportToCSV,
  exportToSBOM,
  generateBadgeMarkdown,
  copyGitHubActionsYAML,
  shareResults,
} from '@/lib/export';
import { getUserPlan } from '@/lib/storage';
import { config, isPolarConfigured, getCheckoutUrl } from '@/lib/config';
import {
  Download,
  FileJson,
  FileText,
  Table2,
  Badge,
  Lock,
  Share2,
  GitBranch,
  Shield,
  Crown,
} from 'lucide-react';
import { useState } from 'react';

export default function ExportPanel({ result }: { result: ScanResult }) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const plan = getUserPlan();
  const isPaid = plan.tier !== 'free';
  const badgeMarkdown = generateBadgeMarkdown(result.summary.overallHealthScore);

  function handleCopy(key: string, action: () => void) {
    action();
    setCopiedItem(key);
    setTimeout(() => setCopiedItem(null), 2000);
  }

  return (
    <div className="bg-surface-900/50 border border-surface-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Download className="w-5 h-5 text-primary-500" />
          Export, Share &amp; Integrate
        </h3>
        {/* Free share button */}
        <button
          onClick={() => handleCopy('share', () => shareResults(result))}
          className="flex items-center gap-1.5 text-xs bg-primary-600/10 border border-primary-500/20 text-primary-400 hover:text-primary-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          {copiedItem === 'share' ? 'Copied!' : 'Share Results'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {/* JSON */}
        <ExportButton
          onClick={() => isPaid && exportToJSON(result)}
          locked={!isPaid}
          icon={<FileJson className="w-7 h-7 text-blue-400 shrink-0" />}
          label="JSON"
          desc="Machine-readable"
        />

        {/* CSV */}
        <ExportButton
          onClick={() => isPaid && exportToCSV(result)}
          locked={!isPaid}
          icon={<Table2 className="w-7 h-7 text-green-400 shrink-0" />}
          label="CSV"
          desc="For spreadsheets"
        />

        {/* PDF */}
        <ExportButton
          onClick={() => isPaid && exportToPDF(result)}
          locked={!isPaid}
          icon={<FileText className="w-7 h-7 text-purple-400 shrink-0" />}
          label="PDF Report"
          desc="For stakeholders"
        />

        {/* SBOM (CycloneDX) */}
        <ExportButton
          onClick={() => isPaid && exportToSBOM(result)}
          locked={!isPaid}
          icon={<Shield className="w-7 h-7 text-cyan-400 shrink-0" />}
          label={copiedItem === 'sbom' ? 'Exported!' : 'SBOM'}
          desc="CycloneDX format"
        />

        {/* CI Badge */}
        <ExportButton
          onClick={() => isPaid && handleCopy('badge', () => navigator.clipboard.writeText(badgeMarkdown))}
          locked={!isPaid}
          icon={<Badge className="w-7 h-7 text-emerald-400 shrink-0" />}
          label={copiedItem === 'badge' ? 'Copied!' : 'CI Badge'}
          desc="README badge"
        />

        {/* GitHub Actions */}
        <ExportButton
          onClick={() => isPaid && handleCopy('ci', () => copyGitHubActionsYAML(result.ecosystem))}
          locked={!isPaid}
          icon={<GitBranch className="w-7 h-7 text-orange-400 shrink-0" />}
          label={copiedItem === 'ci' ? 'Copied!' : 'CI Workflow'}
          desc="GitHub Actions YAML"
        />
      </div>

      {!isPaid && (
        <div className="mt-4 bg-primary-600/5 border border-primary-500/15 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-surface-300">
              Unlock all exports, SBOM, and CI integrations
            </p>
            <p className="text-xs text-surface-500 mt-0.5">
              Pro plan: just ${config.pricing.proPrice}/mo (vs $399/mo for Snyk)
            </p>
          </div>
          <a
            href={isPolarConfigured() ? getCheckoutUrl('pro') : '/#pricing'}
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            <Crown className="w-3.5 h-3.5" />
            Upgrade
          </a>
        </div>
      )}
    </div>
  );
}

function ExportButton({
  onClick,
  locked,
  icon,
  label,
  desc,
}: {
  onClick: () => void;
  locked: boolean;
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <button
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className={`flex items-center gap-3 p-3.5 rounded-lg border transition-colors text-left ${
        locked
          ? 'border-surface-800 opacity-50 cursor-not-allowed'
          : 'border-surface-700 hover:border-primary-500/30 hover:bg-surface-800/50'
      }`}
    >
      {icon}
      <div>
        <div className="text-sm font-medium text-surface-200 flex items-center gap-1.5">
          {label}
          {locked && <Lock className="w-3 h-3 text-surface-500" />}
        </div>
        <p className="text-xs text-surface-500">{desc}</p>
      </div>
    </button>
  );
}
