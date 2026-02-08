'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PackageCard from '@/components/PackageCard';
import ScanSummaryCard from '@/components/ScanSummaryCard';
import ExportPanel from '@/components/ExportPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { parseInput, detectEcosystem } from '@/lib/parsers';
import { analyzeDependencies, createScanResult } from '@/lib/analyzer';
import {
  saveScanResult,
  getScanHistory,
  deleteScanResult,
  getSettings,
  fetchUserPlan,
  incrementScanCount,
  canScan,
} from '@/lib/storage';
import { config, isStripeConfigured, getStripeLink } from '@/lib/config';
import { ScanResult, PackageAnalysis, UserPlan } from '@/types';
import {
  Search,
  Settings,
  History,
  Trash2,
  Loader2,
  AlertTriangle,
  Package,
  ArrowUpDown,
  Crown,
  Coffee,
} from 'lucide-react';

type SortKey = 'risk' | 'name' | 'release';

const SAMPLE_INPUT = `{
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0",
    "moment": "^2.29.4",
    "request": "^2.88.2",
    "lodash": "^4.17.21",
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "chalk": "^5.3.0",
    "uuid": "^9.0.0",
    "left-pad": "^1.3.0"
  }
}`;

export default function ScannerClient() {
  const [input, setInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('risk');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  const [plan, setPlan] = useState<UserPlan>({ tier: 'free', scansUsed: 0, maxScans: 5, features: [] });

  useEffect(() => {
    setHistory(getScanHistory());
    fetchUserPlan().then(setPlan);
  }, []);

  const handleScan = useCallback(async () => {
    if (!input.trim()) {
      setError('Please paste a dependency file to scan.');
      return;
    }

    const allowed = await canScan();
    if (!allowed) {
      setError(
        'You have reached your free scan limit. Upgrade to Pro for unlimited scans.'
      );
      return;
    }

    setError(null);
    setScanning(true);
    setProgress({ completed: 0, total: 0 });
    setResult(null);

    try {
      const packages = parseInput(input);
      if (packages.length === 0) {
        setError(
          'No packages found. Make sure you paste a valid package.json, requirements.txt, Gemfile, go.mod, or Cargo.toml.'
        );
        setScanning(false);
        return;
      }

      setProgress({ completed: 0, total: packages.length });

      const settings = getSettings();
      const analyses = await analyzeDependencies(
        packages,
        settings.githubToken,
        (completed, total) => setProgress({ completed, total })
      );

      const ecosystem = detectEcosystem(input);
      const scanResult = createScanResult(analyses, ecosystem, input);
      setResult(scanResult);
      saveScanResult(scanResult);
      await incrementScanCount();
      fetchUserPlan().then(setPlan);
      setHistory(getScanHistory());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setScanning(false);
    }
  }, [input]);

  function handleLoadHistory(scan: ScanResult) {
    setResult(scan);
    setShowHistory(false);
  }

  function handleDeleteHistory(id: string) {
    deleteScanResult(id);
    setHistory(getScanHistory());
    if (result?.id === id) setResult(null);
  }

  function loadSample() {
    setInput(SAMPLE_INPUT);
    setError(null);
  }

  // Sort and filter
  const sortedPackages = result
    ? [...result.packages]
        .filter((p) => filterLevel === 'all' || p.risk.level === filterLevel)
        .sort((a, b) => {
          switch (sortKey) {
            case 'risk':
              return b.risk.overall - a.risk.overall;
            case 'name':
              return a.package.name.localeCompare(b.package.name);
            case 'release':
              return (
                (b.signals.daysSinceLastRelease ?? 0) -
                (a.signals.daysSinceLastRelease ?? 0)
              );
            default:
              return 0;
          }
        })
    : [];

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 mt-4">
            <div>
              <h1 className="text-2xl font-bold">Dependency Scanner</h1>
              <p className="text-sm text-surface-400 mt-1">
                Paste your dependency file below to scan for deadware risk
              </p>
            </div>
            <div className="flex items-center gap-2">
              {plan.tier === 'free' ? (
                <a
                  href={isStripeConfigured() ? getStripeLink('pro') : '/#pricing'}
                  target={isStripeConfigured() ? '_blank' : undefined}
                  rel={isStripeConfigured() ? 'noopener noreferrer' : undefined}
                  className="text-xs text-surface-400 bg-surface-800 hover:bg-surface-700 px-2 py-1 rounded transition-colors flex items-center gap-1.5"
                >
                  {plan.scansUsed}/{plan.maxScans} free scans
                  <Crown className="w-3 h-3 text-amber-400" />
                </a>
              ) : (
                <span className="text-xs text-primary-400 bg-primary-600/10 border border-primary-500/20 px-2 py-1 rounded flex items-center gap-1.5">
                  <Crown className="w-3 h-3" />
                  {plan.tier.toUpperCase()}
                </span>
              )}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 rounded-lg border border-surface-700 hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
                title="Scan History"
              >
                <History className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg border border-surface-700 hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings panel */}
          {showSettings && (
            <div className="mb-6">
              <SettingsPanel onClose={() => setShowSettings(false)} />
            </div>
          )}

          {/* History panel */}
          {showHistory && (
            <div className="mb-6 bg-surface-900/50 border border-surface-800 rounded-xl p-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-primary-500" />
                Scan History
              </h3>
              {history.length === 0 ? (
                <p className="text-sm text-surface-500">No previous scans.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.map((scan) => (
                    <div
                      key={scan.id}
                      className="flex items-center justify-between bg-surface-800/50 rounded-lg p-3"
                    >
                      <button
                        onClick={() => handleLoadHistory(scan)}
                        className="text-left flex-1 min-w-0"
                      >
                        <span className="text-sm text-surface-200 font-medium">
                          {scan.summary.totalPackages} packages &middot;{' '}
                          {scan.ecosystem.toUpperCase()}
                        </span>
                        <span className="text-xs text-surface-500 block">
                          Health: {scan.summary.overallHealthScore}/100 &middot;{' '}
                          {new Date(scan.createdAt).toLocaleString()}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteHistory(scan.id)}
                        className="p-1.5 text-surface-500 hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Input area */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-surface-300">
                Dependency File Content
              </label>
              <button
                onClick={loadSample}
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                Load sample package.json
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder={`Paste your package.json, requirements.txt, Gemfile, go.mod, or Cargo.toml here...

Example:
{
  "dependencies": {
    "react": "^18.2.0",
    "moment": "^2.29.4",
    "request": "^2.88.2"
  }
}`}
              rows={10}
              className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-200 placeholder:text-surface-600 font-mono focus:outline-none focus:border-primary-500 resize-y"
              spellCheck={false}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-400">{error}</p>
                {error.includes('free scan limit') && (
                  <a
                    href={isStripeConfigured() ? getStripeLink('pro') : '/#pricing'}
                    target={isStripeConfigured() ? '_blank' : undefined}
                    rel={isStripeConfigured() ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 mt-2 bg-primary-600/10 border border-primary-500/20 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <Crown className="w-3 h-3" />
                    Upgrade to Pro — Unlimited scans for ${config.pricing.proPrice}/mo
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Scan button */}
          <button
            onClick={handleScan}
            disabled={scanning || !input.trim()}
            className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-surface-700 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors mb-8"
          >
            {scanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning... ({progress.completed}/{progress.total})
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Scan Dependencies
              </>
            )}
          </button>

          {/* Results */}
          {result && (
            <div className="space-y-6 animate-slide-up">
              {/* Summary */}
              <ScanSummaryCard summary={result.summary} />

              {/* Export */}
              <ExportPanel result={result} />

              {/* Filters & Sort */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-surface-400">Filter:</span>
                  {['all', 'critical', 'high', 'medium', 'low', 'healthy'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFilterLevel(level)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        filterLevel === level
                          ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                          : 'bg-surface-800 text-surface-400 hover:text-surface-200 border border-transparent'
                      }`}
                    >
                      {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-surface-500" />
                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-1.5 text-xs text-surface-300 focus:outline-none focus:border-primary-500"
                  >
                    <option value="risk">Sort by Risk (High first)</option>
                    <option value="name">Sort by Name</option>
                    <option value="release">Sort by Staleness</option>
                  </select>
                </div>
              </div>

              {/* Package list */}
              <div className="space-y-3 stagger-children">
                {sortedPackages.length === 0 ? (
                  <div className="text-center py-12 text-surface-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No packages match this filter.</p>
                  </div>
                ) : (
                  sortedPackages.map((analysis: PackageAnalysis) => (
                    <PackageCard key={analysis.package.name} analysis={analysis} />
                  ))
                )}
              </div>

              {/* Support CTA */}
              <div className="text-center py-8 border-t border-surface-800">
                <p className="text-sm text-surface-500 mb-3">
                  Found this useful? Consider supporting the project.
                </p>
                <a
                  href={config.buyMeACoffeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:text-amber-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Coffee className="w-4 h-4" />
                  Buy Me a Coffee
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
