'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PackageCard from '@/components/PackageCard';
import ScanSummaryCard from '@/components/ScanSummaryCard';
import ExportPanel from '@/components/ExportPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { parseInput, detectEcosystem } from '@/lib/parsers';
import { analyzeDependencies, createScanResult } from '@/lib/analyzer';
import { fetchDepFilesFromRepo, fetchUserRepos, type GitHubRepo } from '@/lib/github';
import {
  saveScanResult,
  getScanHistory,
  deleteScanResult,
  getSettings,
  saveSettings,
  fetchUserPlan,
  incrementScanCount,
  canScan,
} from '@/lib/storage';
import { config, isPolarConfigured, getCheckoutUrl } from '@/lib/config';
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
  Upload,
  Github,
  Link2,
  FileText,
  FolderOpen,
} from 'lucide-react';

type SortKey = 'risk' | 'name' | 'release' | 'vulns';
type InputMode = 'paste' | 'upload' | 'github-url' | 'github-repos';

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

const QUICK_TEMPLATES: { label: string; desc: string; content: string }[] = [
  {
    label: 'React + Express',
    desc: 'Common full-stack combo',
    content: `{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "moment": "^2.29.4",
    "lodash": "^4.17.21",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2"
  }
}`,
  },
  {
    label: 'Legacy Node.js',
    desc: 'Older packages to test',
    content: `{
  "dependencies": {
    "request": "^2.88.2",
    "moment": "^2.29.4",
    "underscore": "^1.13.6",
    "node-sass": "^9.0.0",
    "coffee-script": "^1.12.7",
    "bower": "^1.8.14",
    "tslint": "^6.1.3",
    "left-pad": "^1.3.0",
    "gulp": "^4.0.2",
    "bluebird": "^3.7.2"
  }
}`,
  },
  {
    label: 'Python ML Stack',
    desc: 'Data science dependencies',
    content: `numpy==1.24.0
pandas==2.0.3
scikit-learn==1.3.0
matplotlib==3.7.2
requests==2.31.0
flask==3.0.0
sqlalchemy==2.0.21
celery==5.3.4
pytest==7.4.3
black==23.9.1`,
  },
  {
    label: 'Next.js Starter',
    desc: 'Modern Next.js app',
    content: `{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "@prisma/client": "^5.6.0",
    "next-auth": "^4.24.5",
    "zod": "^3.22.4",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0"
  }
}`,
  },
];

export default function ScannerClient() {
  const [input, setInput] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('paste');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('risk');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // File upload
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // GitHub URL
  const [repoUrl, setRepoUrl] = useState('');

  // GitHub repos
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [repoSearch, setRepoSearch] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  const [plan, setPlan] = useState<UserPlan>({ tier: 'free', scansUsed: 0, maxScans: 5, features: [] });

  useEffect(() => {
    setHistory(getScanHistory());
    fetchUserPlan().then(setPlan);

    // Auto-save GitHub token from OAuth callback
    const params = new URLSearchParams(window.location.search);
    const providerToken = params.get('provider_token');
    if (providerToken) {
      const settings = getSettings();
      settings.githubToken = providerToken;
      saveSettings(settings);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // --- File handling ---
  function handleFileContent(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      setUploadedFileName(file.name);
      setError(null);
    };
    reader.readAsText(file);
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileContent(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileContent(file);
  }

  // --- GitHub repos loading ---
  async function loadRepos() {
    const settings = getSettings();
    if (!settings.githubToken) {
      setError('Add your GitHub token in Settings first, then come back to select a repo.');
      setShowSettings(true);
      return;
    }

    setLoadingRepos(true);
    setError(null);
    try {
      const data = await fetchUserRepos(settings.githubToken);
      setRepos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load repos.');
    } finally {
      setLoadingRepos(false);
    }
  }

  useEffect(() => {
    if (inputMode === 'github-repos' && repos.length === 0) {
      loadRepos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMode]);

  const filteredRepos = repos.filter((r) =>
    r.full_name.toLowerCase().includes(repoSearch.toLowerCase())
  );

  // --- Scan ---
  const handleScan = useCallback(async () => {
    const allowed = await canScan();
    if (!allowed) {
      setError('You have reached your free scan limit. Upgrade to Pro for unlimited scans.');
      return;
    }

    setError(null);
    setScanning(true);
    setProgress({ completed: 0, total: 0 });
    setResult(null);

    try {
      let contentToScan = input;

      // For GitHub modes, fetch dependency files first
      if (inputMode === 'github-url' || inputMode === 'github-repos') {
        const url = inputMode === 'github-url' ? repoUrl : selectedRepo || '';
        if (!url.trim()) {
          setError(inputMode === 'github-url'
            ? 'Enter a GitHub repository URL.'
            : 'Select a repository first.');
          setScanning(false);
          return;
        }

        const settings = getSettings();
        const files = await fetchDepFilesFromRepo(url, settings.githubToken);
        contentToScan = files.map((f) => f.content).join('\n');
        setInput(contentToScan);
      }

      if (!contentToScan.trim()) {
        setError('No dependency content to scan. Paste, upload, or select a source.');
        setScanning(false);
        return;
      }

      const packages = parseInput(contentToScan);
      if (packages.length === 0) {
        setError(
          'No packages found. Make sure you provide a valid package.json, requirements.txt, Gemfile, go.mod, or Cargo.toml.'
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

      const ecosystem = detectEcosystem(contentToScan);
      const scanResult = createScanResult(analyses, ecosystem, contentToScan);
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
  }, [input, inputMode, repoUrl, selectedRepo]);

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
    setInputMode('paste');
    setError(null);
  }

  const canClickScan =
    inputMode === 'paste' ? input.trim().length > 0 :
    inputMode === 'upload' ? input.trim().length > 0 :
    inputMode === 'github-url' ? repoUrl.trim().length > 0 :
    inputMode === 'github-repos' ? !!selectedRepo :
    false;

  // Sort, filter, and search
  const sortedPackages = result
    ? [...result.packages]
        .filter((p) => filterLevel === 'all' || p.risk.level === filterLevel)
        .filter((p) => !searchQuery || p.package.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
            case 'vulns':
              return b.signals.vulnerabilities.length - a.signals.vulnerabilities.length;
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
                Scan your dependencies for abandoned &amp; risky packages
              </p>
            </div>
            <div className="flex items-center gap-2">
              {plan.tier === 'free' ? (
                <a
                  href={isPolarConfigured() ? getCheckoutUrl('pro') : '/#pricing'}
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

          {/* ===== INPUT MODE TABS ===== */}
          <div className="flex gap-1 mb-4 bg-surface-900/50 border border-surface-800 rounded-xl p-1">
            {([
              { key: 'paste' as const, icon: FileText, label: 'Paste' },
              { key: 'upload' as const, icon: Upload, label: 'Upload File' },
              { key: 'github-url' as const, icon: Link2, label: 'Repo URL' },
              { key: 'github-repos' as const, icon: Github, label: 'My Repos' },
            ]).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => { setInputMode(key); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  inputMode === key
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Quick-scan templates */}
          {inputMode === 'paste' && !input.trim() && !result && (
            <div className="mb-4">
              <p className="text-xs text-surface-500 mb-2">Quick scan a template:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUICK_TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => { setInput(t.content); setError(null); }}
                    className="text-left bg-surface-900/50 border border-surface-800 rounded-lg p-3 hover:border-primary-500/30 transition-colors"
                  >
                    <span className="text-xs font-medium text-surface-200 block">{t.label}</span>
                    <span className="text-[10px] text-surface-500">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== PASTE MODE ===== */}
          {inputMode === 'paste' && (
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
                onChange={(e) => { setInput(e.target.value); setError(null); }}
                placeholder={`Paste your package.json, requirements.txt, Gemfile, go.mod, or Cargo.toml here...`}
                rows={10}
                className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-200 placeholder:text-surface-600 font-mono focus:outline-none focus:border-primary-500 resize-y"
                spellCheck={false}
              />
            </div>
          )}

          {/* ===== UPLOAD MODE ===== */}
          {inputMode === 'upload' && (
            <div className="mb-6">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-primary-500 bg-primary-600/10'
                    : uploadedFileName
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-surface-700 hover:border-surface-500 bg-surface-900/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".json,.txt,.toml,.mod"
                  className="hidden"
                />
                {uploadedFileName ? (
                  <div className="space-y-2">
                    <FolderOpen className="w-10 h-10 text-emerald-400 mx-auto" />
                    <p className="text-surface-200 font-medium">{uploadedFileName}</p>
                    <p className="text-xs text-surface-500">File loaded. Click &quot;Scan Dependencies&quot; below.</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFileName(null);
                        setInput('');
                      }}
                      className="text-xs text-red-400 hover:text-red-300 mt-2"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-10 h-10 text-surface-500 mx-auto" />
                    <p className="text-surface-300 font-medium">
                      Drop a dependency file here or click to browse
                    </p>
                    <p className="text-xs text-surface-500">
                      Supports: package.json, requirements.txt, Gemfile, go.mod, Cargo.toml
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== GITHUB URL MODE ===== */}
          {inputMode === 'github-url' && (
            <div className="mb-6">
              <label className="text-sm font-medium text-surface-300 mb-2 block">
                Public GitHub Repository URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => { setRepoUrl(e.target.value); setError(null); }}
                  placeholder="https://github.com/owner/repo"
                  className="w-full bg-surface-900 border border-surface-700 rounded-xl pl-10 pr-4 py-3 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-primary-500"
                />
              </div>
              <p className="text-xs text-surface-500 mt-2">
                We&apos;ll automatically find and scan dependency files (package.json, requirements.txt, etc.) from the repo.
              </p>
            </div>
          )}

          {/* ===== GITHUB REPOS MODE ===== */}
          {inputMode === 'github-repos' && (
            <div className="mb-6">
              {loadingRepos ? (
                <div className="text-center py-10 bg-surface-900/50 border border-surface-800 rounded-xl">
                  <Loader2 className="w-8 h-8 text-primary-500 mx-auto mb-3 animate-spin" />
                  <p className="text-sm text-surface-400">Loading your repositories...</p>
                </div>
              ) : repos.length === 0 ? (
                <div className="text-center py-10 bg-surface-900/50 border border-surface-800 rounded-xl">
                  <Github className="w-10 h-10 text-surface-500 mx-auto mb-3" />
                  <p className="text-surface-300 font-medium mb-2">Connect your GitHub account</p>
                  <p className="text-xs text-surface-500 mb-4">
                    Add your GitHub token in Settings to see your repos here.
                  </p>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-xs text-primary-400 hover:text-primary-300 bg-primary-600/10 border border-primary-500/20 px-4 py-2 rounded-lg transition-colors"
                  >
                    Open Settings
                  </button>
                </div>
              ) : (
                <div className="bg-surface-900/50 border border-surface-800 rounded-xl p-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="text"
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                      placeholder="Search your repos..."
                      className="w-full bg-surface-800 border border-surface-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div className="space-y-1 max-h-72 overflow-y-auto">
                    {filteredRepos.map((repo) => (
                      <button
                        key={repo.full_name}
                        onClick={() => { setSelectedRepo(repo.full_name); setError(null); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                          selectedRepo === repo.full_name
                            ? 'bg-primary-600/20 border border-primary-500/30 text-primary-400'
                            : 'hover:bg-surface-800 text-surface-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-medium block truncate">{repo.full_name}</span>
                          {repo.description && (
                            <span className="text-xs text-surface-500 block truncate">{repo.description}</span>
                          )}
                        </div>
                        {repo.private && (
                          <span className="text-[10px] bg-surface-700 text-surface-400 px-1.5 py-0.5 rounded shrink-0 ml-2">
                            Private
                          </span>
                        )}
                      </button>
                    ))}
                    {filteredRepos.length === 0 && (
                      <p className="text-sm text-surface-500 text-center py-4">No repos match &quot;{repoSearch}&quot;</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-700">
                    <span className="text-xs text-surface-500">{repos.length} repos loaded</span>
                    <button
                      onClick={loadRepos}
                      className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-400">{error}</p>
                {error.includes('free scan limit') && (
                  <a
                    href={isPolarConfigured() ? getCheckoutUrl('pro') : '/#pricing'}
                    className="inline-flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 mt-2 bg-primary-600/10 border border-primary-500/20 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <Crown className="w-3 h-3" />
                    Upgrade to Pro: Unlimited scans for ${config.pricing.proPrice}/mo
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Scan button */}
          <button
            onClick={handleScan}
            disabled={scanning || !canClickScan}
            className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-surface-700 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors mb-8"
          >
            {scanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress.total > 0
                  ? `Scanning... (${progress.completed}/${progress.total})`
                  : 'Fetching dependencies...'}
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
              <ScanSummaryCard summary={result.summary} />

              {/* Smart upgrade prompt - contextual based on scan findings */}
              {plan.tier === 'free' && (
                <div className="bg-gradient-to-r from-primary-600/10 via-purple-600/10 to-primary-600/10 border border-primary-500/20 rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <p className="text-sm font-semibold text-surface-200">
                          {result.summary.totalVulnerabilities > 0
                            ? `${result.summary.totalVulnerabilities} vulnerabilit${result.summary.totalVulnerabilities === 1 ? 'y' : 'ies'} found. Export a full report`
                            : result.summary.critical + result.summary.high > 0
                            ? `${result.summary.critical + result.summary.high} high-risk packages detected`
                            : 'Unlock PDF reports, SBOM, and CI integration'}
                        </p>
                      </div>
                      <p className="text-xs text-surface-400">
                        Pro gives you PDF/CSV/JSON exports, CycloneDX SBOM, GitHub Actions CI workflow, and unlimited scans for just ${config.pricing.proPrice}/mo
                        <span className="text-surface-600"> (vs $399/mo for Snyk)</span>
                      </p>
                    </div>
                    <a
                      href={isPolarConfigured() ? getCheckoutUrl('pro') : '/#pricing'}
                      className="shrink-0 flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      Upgrade to Pro
                    </a>
                  </div>
                </div>
              )}

              <ExportPanel result={result} />

              {/* Search, Filter, Sort */}
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search packages by name..."
                    className="w-full bg-surface-900 border border-surface-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
                        {level === 'all' ? `All (${result.packages.length})` : `${level.charAt(0).toUpperCase() + level.slice(1)} (${result.packages.filter(p => p.risk.level === level).length})`}
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
                      <option value="vulns">Sort by Vulnerabilities</option>
                      <option value="name">Sort by Name</option>
                      <option value="release">Sort by Staleness</option>
                    </select>
                  </div>
                </div>
              </div>

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
