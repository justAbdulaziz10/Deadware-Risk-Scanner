import {
  ParsedPackage,
  MaintenanceSignals,
  RiskScore,
  RiskFactor,
  RiskLevel,
  PackageAnalysis,
  ReplacementSuggestion,
  ScanResult,
  ScanSummary,
} from '@/types';

// ---- Registry fetchers (client-side, CORS-friendly) ----

async function fetchNpmSignals(pkg: ParsedPackage): Promise<MaintenanceSignals> {
  const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}`);
  if (!res.ok) throw new Error(`npm registry returned ${res.status}`);
  const data = await res.json();

  const times = data.time || {};
  const versions = Object.keys(times).filter((k) => k !== 'created' && k !== 'modified');
  const lastVersion = versions[versions.length - 1];
  const lastReleaseDate = lastVersion ? times[lastVersion] : times.modified || null;
  const daysSince = lastReleaseDate
    ? Math.floor((Date.now() - new Date(lastReleaseDate).getTime()) / 86400000)
    : null;

  const latest = data['dist-tags']?.latest;
  const latestData = latest ? data.versions?.[latest] : null;
  const maintainers = data.maintainers || [];

  return {
    lastReleaseDate,
    daysSinceLastRelease: daysSince,
    maintainerCount: maintainers.length,
    openIssueCount: null, // would need GitHub API
    weeklyDownloads: null, // would need separate API call
    repositoryArchived: null,
    hasSecurityPolicy: null,
    license: latestData?.license || data.license || null,
    description: data.description || null,
    homepage: data.homepage || null,
    repository:
      typeof data.repository === 'string'
        ? data.repository
        : data.repository?.url?.replace(/^git\+/, '').replace(/\.git$/, '') || null,
  };
}

async function fetchPypiSignals(pkg: ParsedPackage): Promise<MaintenanceSignals> {
  const res = await fetch(`https://pypi.org/pypi/${encodeURIComponent(pkg.name)}/json`);
  if (!res.ok) throw new Error(`PyPI returned ${res.status}`);
  const data = await res.json();

  const info = data.info || {};
  const releases = Object.keys(data.releases || {});
  const latestRelease = releases[releases.length - 1];
  const latestFiles = data.releases?.[latestRelease] || [];
  const lastUpload = latestFiles.length > 0 ? latestFiles[0].upload_time_iso_8601 : null;
  const daysSince = lastUpload
    ? Math.floor((Date.now() - new Date(lastUpload).getTime()) / 86400000)
    : null;

  return {
    lastReleaseDate: lastUpload,
    daysSinceLastRelease: daysSince,
    maintainerCount: info.author ? 1 : null,
    openIssueCount: null,
    weeklyDownloads: null,
    repositoryArchived: null,
    hasSecurityPolicy: null,
    license: info.license || null,
    description: info.summary || null,
    homepage: info.home_page || info.project_url || null,
    repository:
      info.project_urls?.Source ||
      info.project_urls?.Repository ||
      info.project_urls?.GitHub ||
      null,
  };
}

async function fetchRegistrySignals(pkg: ParsedPackage): Promise<MaintenanceSignals> {
  switch (pkg.ecosystem) {
    case 'npm':
      return fetchNpmSignals(pkg);
    case 'pypi':
      return fetchPypiSignals(pkg);
    default:
      // For unsupported ecosystems, return empty signals
      return {
        lastReleaseDate: null,
        daysSinceLastRelease: null,
        maintainerCount: null,
        openIssueCount: null,
        weeklyDownloads: null,
        repositoryArchived: null,
        hasSecurityPolicy: null,
        license: null,
        description: null,
        homepage: null,
        repository: null,
      };
  }
}

// ---- GitHub signals enrichment (optional, requires BYOK) ----

export async function enrichWithGitHub(
  signals: MaintenanceSignals,
  githubToken?: string
): Promise<MaintenanceSignals> {
  if (!signals.repository || !githubToken) return signals;

  const repoMatch = signals.repository.match(/github\.com\/([^/]+\/[^/]+)/);
  if (!repoMatch) return signals;

  const repoPath = repoMatch[1].replace(/\.git$/, '');
  const headers: Record<string, string> = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github.v3+json',
  };

  try {
    const res = await fetch(`https://api.github.com/repos/${repoPath}`, { headers });
    if (!res.ok) return signals;
    const repo = await res.json();

    return {
      ...signals,
      openIssueCount: repo.open_issues_count ?? signals.openIssueCount,
      repositoryArchived: repo.archived ?? signals.repositoryArchived,
      hasSecurityPolicy: repo.has_security_policy ?? signals.hasSecurityPolicy,
    };
  } catch {
    return signals;
  }
}

// ---- Risk scoring ----

function computeRiskScore(signals: MaintenanceSignals): RiskScore {
  const factors: RiskFactor[] = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;

  // Factor 1: Days since last release (weight: 35)
  if (signals.daysSinceLastRelease !== null) {
    const days = signals.daysSinceLastRelease;
    let score: number;
    if (days < 90) score = 0;
    else if (days < 180) score = 20;
    else if (days < 365) score = 45;
    else if (days < 730) score = 70;
    else score = 95;

    factors.push({
      name: 'Release Freshness',
      score,
      weight: 35,
      description:
        days < 90
          ? `Last release ${days} days ago — actively maintained`
          : days < 365
          ? `Last release ${days} days ago — updates slowing`
          : `Last release ${days} days ago — possibly abandoned`,
    });
    totalWeightedScore += score * 35;
    totalWeight += 35;
  }

  // Factor 2: Bus factor / maintainer count (weight: 25)
  if (signals.maintainerCount !== null) {
    const count = signals.maintainerCount;
    let score: number;
    if (count >= 5) score = 0;
    else if (count >= 3) score = 15;
    else if (count === 2) score = 35;
    else if (count === 1) score = 65;
    else score = 95;

    factors.push({
      name: 'Bus Factor',
      score,
      weight: 25,
      description:
        count >= 3
          ? `${count} maintainers — healthy bus factor`
          : count === 1
          ? `Solo maintainer — single point of failure`
          : `No listed maintainers — high risk`,
    });
    totalWeightedScore += score * 25;
    totalWeight += 25;
  }

  // Factor 3: Repository archived (weight: 20)
  if (signals.repositoryArchived !== null) {
    const score = signals.repositoryArchived ? 100 : 0;
    factors.push({
      name: 'Repository Status',
      score,
      weight: 20,
      description: signals.repositoryArchived
        ? 'Repository is archived — no further updates expected'
        : 'Repository is active',
    });
    totalWeightedScore += score * 20;
    totalWeight += 20;
  }

  // Factor 4: Open issues (weight: 10)
  if (signals.openIssueCount !== null) {
    const issues = signals.openIssueCount;
    let score: number;
    if (issues < 50) score = 0;
    else if (issues < 200) score = 25;
    else if (issues < 500) score = 50;
    else score = 75;

    factors.push({
      name: 'Issue Backlog',
      score,
      weight: 10,
      description:
        issues < 50
          ? `${issues} open issues — manageable`
          : `${issues} open issues — significant backlog`,
    });
    totalWeightedScore += score * 10;
    totalWeight += 10;
  }

  // Factor 5: License (weight: 10)
  if (signals.license !== null) {
    const knownPermissive = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'Unlicense'];
    const score = knownPermissive.some((l) => signals.license?.includes(l)) ? 0 : 20;
    factors.push({
      name: 'License',
      score,
      weight: 10,
      description: score === 0 ? `Permissive license (${signals.license})` : `License: ${signals.license} — review terms`,
    });
    totalWeightedScore += score * 10;
    totalWeight += 10;
  }

  // Compute overall
  const overall = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 50;
  const level = riskLevelFromScore(overall);

  return { overall, level, factors };
}

function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  if (score >= 20) return 'low';
  return 'healthy';
}

// ---- Known replacements database ----

const KNOWN_REPLACEMENTS: Record<string, ReplacementSuggestion[]> = {
  // npm
  'request': [
    { name: 'node-fetch', reason: 'Modern, lightweight HTTP client', ecosystem: 'npm', url: 'https://www.npmjs.com/package/node-fetch' },
    { name: 'axios', reason: 'Full-featured HTTP client', ecosystem: 'npm', url: 'https://www.npmjs.com/package/axios' },
    { name: 'undici', reason: 'Official Node.js HTTP/1.1 client', ecosystem: 'npm', url: 'https://www.npmjs.com/package/undici' },
  ],
  'moment': [
    { name: 'date-fns', reason: 'Modular, tree-shakable date utility', ecosystem: 'npm', url: 'https://www.npmjs.com/package/date-fns' },
    { name: 'dayjs', reason: 'Tiny Moment.js alternative with same API', ecosystem: 'npm', url: 'https://www.npmjs.com/package/dayjs' },
    { name: 'luxon', reason: 'Modern date library by Moment.js team', ecosystem: 'npm', url: 'https://www.npmjs.com/package/luxon' },
  ],
  'underscore': [
    { name: 'lodash', reason: 'More complete utility library', ecosystem: 'npm', url: 'https://www.npmjs.com/package/lodash' },
    { name: 'ramda', reason: 'Functional programming utilities', ecosystem: 'npm', url: 'https://www.npmjs.com/package/ramda' },
  ],
  'bower': [
    { name: 'npm', reason: 'Standard Node.js package manager', ecosystem: 'npm', url: 'https://www.npmjs.com/' },
  ],
  'tslint': [
    { name: 'eslint', reason: 'TSLint is deprecated in favor of ESLint', ecosystem: 'npm', url: 'https://www.npmjs.com/package/eslint' },
  ],
  'node-sass': [
    { name: 'sass', reason: 'Dart Sass — the primary Sass implementation', ecosystem: 'npm', url: 'https://www.npmjs.com/package/sass' },
  ],
  'left-pad': [
    { name: 'String.prototype.padStart', reason: 'Native JS method — no dependency needed', ecosystem: 'npm', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart' },
  ],
  'chalk': [],
  'uuid': [],
  // Python
  'nose': [
    { name: 'pytest', reason: 'Modern, feature-rich test framework', ecosystem: 'pypi', url: 'https://pypi.org/project/pytest/' },
  ],
  'optparse': [
    { name: 'argparse', reason: 'Standard library replacement', ecosystem: 'pypi', url: 'https://docs.python.org/3/library/argparse.html' },
  ],
  'pycrypto': [
    { name: 'pycryptodome', reason: 'Maintained fork with security fixes', ecosystem: 'pypi', url: 'https://pypi.org/project/pycryptodome/' },
  ],
};

function getReplacements(pkg: ParsedPackage): ReplacementSuggestion[] {
  return KNOWN_REPLACEMENTS[pkg.name] || [];
}

// ---- Main analysis pipeline ----

export async function analyzePackage(
  pkg: ParsedPackage,
  githubToken?: string
): Promise<PackageAnalysis> {
  try {
    let signals = await fetchRegistrySignals(pkg);
    if (githubToken) {
      signals = await enrichWithGitHub(signals, githubToken);
    }
    const risk = computeRiskScore(signals);
    const replacements = getReplacements(pkg);

    return {
      package: pkg,
      signals,
      risk,
      replacements,
      scannedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      package: pkg,
      signals: {
        lastReleaseDate: null,
        daysSinceLastRelease: null,
        maintainerCount: null,
        openIssueCount: null,
        weeklyDownloads: null,
        repositoryArchived: null,
        hasSecurityPolicy: null,
        license: null,
        description: null,
        homepage: null,
        repository: null,
      },
      risk: {
        overall: 50,
        level: 'medium',
        factors: [
          {
            name: 'Data Unavailable',
            score: 50,
            weight: 100,
            description: `Could not fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      },
      replacements: [],
      scannedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function analyzeDependencies(
  packages: ParsedPackage[],
  githubToken?: string,
  onProgress?: (completed: number, total: number) => void
): Promise<PackageAnalysis[]> {
  const results: PackageAnalysis[] = [];
  const batchSize = 5;

  for (let i = 0; i < packages.length; i += batchSize) {
    const batch = packages.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((pkg) => analyzePackage(pkg, githubToken))
    );
    results.push(...batchResults);
    onProgress?.(Math.min(i + batchSize, packages.length), packages.length);
  }

  return results;
}

export function computeSummary(analyses: PackageAnalysis[]): ScanSummary {
  const summary: ScanSummary = {
    totalPackages: analyses.length,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    healthy: 0,
    overallHealthScore: 0,
  };

  let totalRisk = 0;
  for (const a of analyses) {
    summary[a.risk.level]++;
    totalRisk += a.risk.overall;
  }

  summary.overallHealthScore =
    analyses.length > 0 ? Math.round(100 - totalRisk / analyses.length) : 100;

  return summary;
}

export function createScanResult(
  analyses: PackageAnalysis[],
  ecosystem: string,
  rawInput: string
): ScanResult {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `scan-${Date.now()}`,
    packages: analyses,
    summary: computeSummary(analyses),
    createdAt: new Date().toISOString(),
    ecosystem: ecosystem as PackageAnalysis['package']['ecosystem'],
    rawInput,
  };
}
