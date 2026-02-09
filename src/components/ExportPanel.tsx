'use client';

import { ScanResult } from '@/types';
import { exportToJSON, exportToPDF, exportToCSV, generateBadgeMarkdown } from '@/lib/export';
import { getUserPlan } from '@/lib/storage';
import { Download, FileJson, FileText, Table2, Badge, Copy, Lock } from 'lucide-react';
import { useState } from 'react';

export default function ExportPanel({ result }: { result: ScanResult }) {
  const [copied, setCopied] = useState(false);
  const plan = getUserPlan();
  const isPaid = plan.tier !== 'free';
  const badgeMarkdown = generateBadgeMarkdown(result.summary.overallHealthScore);

  function handleCopyBadge() {
    navigator.clipboard.writeText(badgeMarkdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="bg-surface-900/50 border border-surface-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-primary-500" />
        Export & Share
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* JSON Export */}
        <button
          onClick={() => isPaid ? exportToJSON(result) : undefined}
          disabled={!isPaid}
          className={`flex items-center gap-3 p-4 rounded-lg border transition-colors text-left ${
            isPaid
              ? 'border-surface-700 hover:border-primary-500/30 hover:bg-surface-800/50'
              : 'border-surface-800 opacity-50 cursor-not-allowed'
          }`}
        >
          <FileJson className="w-8 h-8 text-blue-400 shrink-0" />
          <div>
            <div className="text-sm font-medium text-surface-200 flex items-center gap-1.5">
              Export JSON
              {!isPaid && <Lock className="w-3 h-3 text-surface-500" />}
            </div>
            <p className="text-xs text-surface-500">Machine-readable report</p>
          </div>
        </button>

        {/* CSV Export */}
        <button
          onClick={() => isPaid ? exportToCSV(result) : undefined}
          disabled={!isPaid}
          className={`flex items-center gap-3 p-4 rounded-lg border transition-colors text-left ${
            isPaid
              ? 'border-surface-700 hover:border-primary-500/30 hover:bg-surface-800/50'
              : 'border-surface-800 opacity-50 cursor-not-allowed'
          }`}
        >
          <Table2 className="w-8 h-8 text-green-400 shrink-0" />
          <div>
            <div className="text-sm font-medium text-surface-200 flex items-center gap-1.5">
              Export CSV
              {!isPaid && <Lock className="w-3 h-3 text-surface-500" />}
            </div>
            <p className="text-xs text-surface-500">Spreadsheet-ready data</p>
          </div>
        </button>

        {/* PDF Export */}
        <button
          onClick={() => isPaid ? exportToPDF(result) : undefined}
          disabled={!isPaid}
          className={`flex items-center gap-3 p-4 rounded-lg border transition-colors text-left ${
            isPaid
              ? 'border-surface-700 hover:border-primary-500/30 hover:bg-surface-800/50'
              : 'border-surface-800 opacity-50 cursor-not-allowed'
          }`}
        >
          <FileText className="w-8 h-8 text-purple-400 shrink-0" />
          <div>
            <div className="text-sm font-medium text-surface-200 flex items-center gap-1.5">
              Export PDF
              {!isPaid && <Lock className="w-3 h-3 text-surface-500" />}
            </div>
            <p className="text-xs text-surface-500">Printable report for teams</p>
          </div>
        </button>

        {/* CI Badge */}
        <button
          onClick={isPaid ? handleCopyBadge : undefined}
          disabled={!isPaid}
          className={`flex items-center gap-3 p-4 rounded-lg border transition-colors text-left ${
            isPaid
              ? 'border-surface-700 hover:border-primary-500/30 hover:bg-surface-800/50'
              : 'border-surface-800 opacity-50 cursor-not-allowed'
          }`}
        >
          <Badge className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <div className="text-sm font-medium text-surface-200 flex items-center gap-1.5">
              {copied ? 'Copied!' : 'CI Badge'}
              {!isPaid && <Lock className="w-3 h-3 text-surface-500" />}
            </div>
            <p className="text-xs text-surface-500">Copy badge markdown</p>
          </div>
        </button>
      </div>

      {!isPaid && (
        <p className="text-xs text-surface-500 mt-3">
          Export features and CI badge require a <span className="text-primary-400">Pro</span> plan.{' '}
          <a href="/#pricing" className="text-primary-400 hover:text-primary-300 underline">
            Upgrade now
          </a>
        </p>
      )}
    </div>
  );
}
