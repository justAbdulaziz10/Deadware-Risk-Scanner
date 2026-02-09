import {
  ParsedPackage,
  MaintenanceSignals,
  Vulnerability,
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

  // Check deprecation on latest version
  const deprecatedMsg = latestData?.deprecated || null;

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
    deprecated: deprecatedMsg,
    vulnerabilities: [],
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
    deprecated: null,
    vulnerabilities: [],
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
        deprecated: null,
        vulnerabilities: [],
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

// ---- OSV Vulnerability scanning ----

const ECOSYSTEM_MAP: Record<string, string> = {
  npm: 'npm',
  pypi: 'PyPI',
  rubygems: 'RubyGems',
  go: 'Go',
  cargo: 'crates.io',
};

async function fetchVulnerabilities(pkg: ParsedPackage): Promise<Vulnerability[]> {
  const osvEcosystem = ECOSYSTEM_MAP[pkg.ecosystem];
  if (!osvEcosystem) return [];

  try {
    const res = await fetch('https://api.osv.dev/v1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: pkg.version.replace(/^[\^~>=<! ]+/, ''),
        package: { name: pkg.name, ecosystem: osvEcosystem },
      }),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const vulns: Vulnerability[] = (data.vulns || []).map((v: Record<string, unknown>) => {
      const severity = extractSeverity(v);
      const aliases = (v.aliases as string[]) || [];
      return {
        id: v.id as string,
        summary: (v.summary as string) || 'No description available',
        severity,
        aliases,
        url: `https://osv.dev/vulnerability/${v.id}`,
      };
    });
    return vulns;
  } catch {
    return [];
  }
}

function extractSeverity(vuln: Record<string, unknown>): Vulnerability['severity'] {
  const severityArr = vuln.severity as Array<{ type: string; score: string }> | undefined;
  if (severityArr && severityArr.length > 0) {
    const cvss = severityArr.find((s) => s.type === 'CVSS_V3' || s.type === 'CVSS_V4');
    if (cvss) {
      const score = parseFloat(cvss.score);
      if (!isNaN(score)) {
        if (score >= 9.0) return 'CRITICAL';
        if (score >= 7.0) return 'HIGH';
        if (score >= 4.0) return 'MODERATE';
        return 'LOW';
      }
    }
  }

  const dbSpecific = vuln.database_specific as Record<string, unknown> | undefined;
  if (dbSpecific?.severity) {
    const s = (dbSpecific.severity as string).toUpperCase();
    if (s === 'CRITICAL') return 'CRITICAL';
    if (s === 'HIGH') return 'HIGH';
    if (s === 'MODERATE' || s === 'MEDIUM') return 'MODERATE';
    if (s === 'LOW') return 'LOW';
  }

  return 'UNKNOWN';
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

  // Factor 6: Known Vulnerabilities (weight: 30)
  if (signals.vulnerabilities.length > 0) {
    const vulnCount = signals.vulnerabilities.length;
    const hasCritical = signals.vulnerabilities.some((v) => v.severity === 'CRITICAL');
    const hasHigh = signals.vulnerabilities.some((v) => v.severity === 'HIGH');
    let score: number;
    if (hasCritical) score = 100;
    else if (hasHigh) score = 85;
    else if (vulnCount >= 5) score = 75;
    else if (vulnCount >= 2) score = 60;
    else score = 45;

    factors.push({
      name: 'Security Vulnerabilities',
      score,
      weight: 30,
      description: `${vulnCount} known vulnerabilit${vulnCount === 1 ? 'y' : 'ies'}${hasCritical ? ' (includes CRITICAL)' : hasHigh ? ' (includes HIGH)' : ''}`,
    });
    totalWeightedScore += score * 30;
    totalWeight += 30;
  }

  // Factor 7: Deprecated (weight: 25)
  if (signals.deprecated) {
    factors.push({
      name: 'Deprecated',
      score: 90,
      weight: 25,
      description: `Package is deprecated: ${signals.deprecated}`,
    });
    totalWeightedScore += 90 * 25;
    totalWeight += 25;
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
  // ---- npm ----
  'request': [
    { name: 'undici', reason: 'Official Node.js HTTP/1.1 client', ecosystem: 'npm', url: 'https://www.npmjs.com/package/undici' },
    { name: 'node-fetch', reason: 'Lightweight fetch polyfill', ecosystem: 'npm', url: 'https://www.npmjs.com/package/node-fetch' },
    { name: 'axios', reason: 'Full-featured HTTP client', ecosystem: 'npm', url: 'https://www.npmjs.com/package/axios' },
  ],
  'request-promise': [
    { name: 'undici', reason: 'Built-in promise support', ecosystem: 'npm', url: 'https://www.npmjs.com/package/undici' },
    { name: 'axios', reason: 'Promise-based HTTP client', ecosystem: 'npm', url: 'https://www.npmjs.com/package/axios' },
  ],
  'moment': [
    { name: 'date-fns', reason: 'Modular, tree-shakable date utility', ecosystem: 'npm', url: 'https://www.npmjs.com/package/date-fns' },
    { name: 'dayjs', reason: 'Tiny Moment.js alternative with same API', ecosystem: 'npm', url: 'https://www.npmjs.com/package/dayjs' },
    { name: 'luxon', reason: 'Modern date library by Moment.js team', ecosystem: 'npm', url: 'https://www.npmjs.com/package/luxon' },
  ],
  'moment-timezone': [
    { name: 'date-fns-tz', reason: 'Timezone support for date-fns', ecosystem: 'npm', url: 'https://www.npmjs.com/package/date-fns-tz' },
    { name: 'luxon', reason: 'Built-in timezone handling', ecosystem: 'npm', url: 'https://www.npmjs.com/package/luxon' },
  ],
  'underscore': [
    { name: 'lodash-es', reason: 'Tree-shakable utility library', ecosystem: 'npm', url: 'https://www.npmjs.com/package/lodash-es' },
    { name: 'ramda', reason: 'Functional programming utilities', ecosystem: 'npm', url: 'https://www.npmjs.com/package/ramda' },
  ],
  'bower': [
    { name: 'npm', reason: 'Standard Node.js package manager', ecosystem: 'npm', url: 'https://www.npmjs.com/' },
  ],
  'tslint': [
    { name: 'eslint', reason: 'TSLint is deprecated — use ESLint with typescript-eslint', ecosystem: 'npm', url: 'https://www.npmjs.com/package/eslint' },
  ],
  'node-sass': [
    { name: 'sass', reason: 'Dart Sass — the primary Sass implementation', ecosystem: 'npm', url: 'https://www.npmjs.com/package/sass' },
  ],
  'left-pad': [
    { name: 'String.prototype.padStart', reason: 'Native JS method — no dependency needed', ecosystem: 'npm', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart' },
  ],
  'querystring': [
    { name: 'URLSearchParams', reason: 'Native Web API — no dependency needed', ecosystem: 'npm', url: 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams' },
  ],
  'colors': [
    { name: 'chalk', reason: 'Actively maintained terminal styling', ecosystem: 'npm', url: 'https://www.npmjs.com/package/chalk' },
    { name: 'picocolors', reason: 'Tiny and fast terminal colors', ecosystem: 'npm', url: 'https://www.npmjs.com/package/picocolors' },
  ],
  'faker': [
    { name: '@faker-js/faker', reason: 'Community-maintained fork after sabotage incident', ecosystem: 'npm', url: 'https://www.npmjs.com/package/@faker-js/faker' },
  ],
  'istanbul': [
    { name: 'nyc', reason: 'Istanbul CLI replacement', ecosystem: 'npm', url: 'https://www.npmjs.com/package/nyc' },
    { name: 'c8', reason: 'Native V8 code coverage', ecosystem: 'npm', url: 'https://www.npmjs.com/package/c8' },
  ],
  'mocha': [
    { name: 'vitest', reason: 'Modern, fast test framework with ESM support', ecosystem: 'npm', url: 'https://www.npmjs.com/package/vitest' },
  ],
  'jasmine': [
    { name: 'vitest', reason: 'Modern test framework with built-in assertions', ecosystem: 'npm', url: 'https://www.npmjs.com/package/vitest' },
  ],
  'karma': [
    { name: 'vitest', reason: 'Modern browser testing without Karma', ecosystem: 'npm', url: 'https://www.npmjs.com/package/vitest' },
    { name: 'playwright', reason: 'Browser testing by Microsoft', ecosystem: 'npm', url: 'https://www.npmjs.com/package/playwright' },
  ],
  'enzyme': [
    { name: '@testing-library/react', reason: 'Modern React testing utilities', ecosystem: 'npm', url: 'https://www.npmjs.com/package/@testing-library/react' },
  ],
  'protractor': [
    { name: 'playwright', reason: 'Modern E2E testing framework', ecosystem: 'npm', url: 'https://www.npmjs.com/package/playwright' },
    { name: 'cypress', reason: 'Popular E2E testing framework', ecosystem: 'npm', url: 'https://www.npmjs.com/package/cypress' },
  ],
  'phantomjs': [
    { name: 'puppeteer', reason: 'Headless Chrome automation', ecosystem: 'npm', url: 'https://www.npmjs.com/package/puppeteer' },
    { name: 'playwright', reason: 'Multi-browser automation by Microsoft', ecosystem: 'npm', url: 'https://www.npmjs.com/package/playwright' },
  ],
  'phantomjs-prebuilt': [
    { name: 'puppeteer', reason: 'Headless Chrome automation', ecosystem: 'npm', url: 'https://www.npmjs.com/package/puppeteer' },
  ],
  'nightmare': [
    { name: 'playwright', reason: 'Modern browser automation', ecosystem: 'npm', url: 'https://www.npmjs.com/package/playwright' },
  ],
  'jade': [
    { name: 'pug', reason: 'Jade was renamed to Pug', ecosystem: 'npm', url: 'https://www.npmjs.com/package/pug' },
  ],
  'merge': [
    { name: 'deepmerge', reason: 'More robust deep merging', ecosystem: 'npm', url: 'https://www.npmjs.com/package/deepmerge' },
  ],
  'mkdirp': [
    { name: 'fs.mkdirSync', reason: 'Use native fs.mkdirSync with {recursive: true}', ecosystem: 'npm', url: 'https://nodejs.org/api/fs.html#fsmkdirsyncpath-options' },
  ],
  'rimraf': [
    { name: 'fs.rmSync', reason: 'Use native fs.rmSync with {recursive: true}', ecosystem: 'npm', url: 'https://nodejs.org/api/fs.html#fsrmsyncpath-options' },
  ],
  'glob': [
    { name: 'tinyglobby', reason: 'Modern, fast glob implementation', ecosystem: 'npm', url: 'https://www.npmjs.com/package/tinyglobby' },
  ],
  'superagent': [
    { name: 'undici', reason: 'Official Node.js HTTP client', ecosystem: 'npm', url: 'https://www.npmjs.com/package/undici' },
    { name: 'ky', reason: 'Tiny HTTP client based on Fetch API', ecosystem: 'npm', url: 'https://www.npmjs.com/package/ky' },
  ],
  'bluebird': [
    { name: 'Native Promises', reason: 'V8 native promises are now fast — no library needed', ecosystem: 'npm', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' },
  ],
  'async': [
    { name: 'Native async/await', reason: 'Use native async/await instead', ecosystem: 'npm', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function' },
  ],
  'q': [
    { name: 'Native Promises', reason: 'Q is deprecated — use native Promises', ecosystem: 'npm', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' },
  ],
  'when': [
    { name: 'Native Promises', reason: 'Use native Promises/async-await', ecosystem: 'npm', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' },
  ],
  'coffee-script': [
    { name: 'typescript', reason: 'Industry-standard typed JavaScript', ecosystem: 'npm', url: 'https://www.npmjs.com/package/typescript' },
  ],
  'coffeescript': [
    { name: 'typescript', reason: 'Industry-standard typed JavaScript', ecosystem: 'npm', url: 'https://www.npmjs.com/package/typescript' },
  ],
  'nomnom': [
    { name: 'commander', reason: 'Active CLI argument parser', ecosystem: 'npm', url: 'https://www.npmjs.com/package/commander' },
  ],
  'optimist': [
    { name: 'yargs', reason: 'Maintained successor to optimist', ecosystem: 'npm', url: 'https://www.npmjs.com/package/yargs' },
  ],
  'minimatch': [
    { name: 'picomatch', reason: 'Faster, smaller glob matching', ecosystem: 'npm', url: 'https://www.npmjs.com/package/picomatch' },
  ],
  'formidable': [
    { name: 'busboy', reason: 'Faster, streaming multipart parser', ecosystem: 'npm', url: 'https://www.npmjs.com/package/busboy' },
    { name: 'multer', reason: 'Express middleware for file uploads', ecosystem: 'npm', url: 'https://www.npmjs.com/package/multer' },
  ],
  'bcrypt-nodejs': [
    { name: 'bcrypt', reason: 'Maintained native bcrypt binding', ecosystem: 'npm', url: 'https://www.npmjs.com/package/bcrypt' },
    { name: 'bcryptjs', reason: 'Pure JS bcrypt — no native deps', ecosystem: 'npm', url: 'https://www.npmjs.com/package/bcryptjs' },
  ],
  'node-uuid': [
    { name: 'uuid', reason: 'node-uuid was renamed to uuid', ecosystem: 'npm', url: 'https://www.npmjs.com/package/uuid' },
    { name: 'crypto.randomUUID', reason: 'Native Node.js UUID generation', ecosystem: 'npm', url: 'https://nodejs.org/api/crypto.html#cryptorandomuuidoptions' },
  ],
  'gulp': [
    { name: 'npm scripts', reason: 'Native npm scripts or modern bundlers', ecosystem: 'npm', url: 'https://docs.npmjs.com/cli/v10/using-npm/scripts' },
    { name: 'vite', reason: 'Fast modern build tool', ecosystem: 'npm', url: 'https://www.npmjs.com/package/vite' },
  ],
  'grunt': [
    { name: 'npm scripts', reason: 'Native npm scripts or modern bundlers', ecosystem: 'npm', url: 'https://docs.npmjs.com/cli/v10/using-npm/scripts' },
    { name: 'vite', reason: 'Fast modern build tool', ecosystem: 'npm', url: 'https://www.npmjs.com/package/vite' },
  ],
  'webpack': [
    { name: 'vite', reason: 'Faster development with HMR', ecosystem: 'npm', url: 'https://www.npmjs.com/package/vite' },
    { name: 'esbuild', reason: 'Extremely fast JS bundler', ecosystem: 'npm', url: 'https://www.npmjs.com/package/esbuild' },
  ],
  'parcel': [
    { name: 'vite', reason: 'Faster zero-config alternative', ecosystem: 'npm', url: 'https://www.npmjs.com/package/vite' },
  ],
  'rollup': [
    { name: 'tsup', reason: 'TypeScript-first bundler built on esbuild', ecosystem: 'npm', url: 'https://www.npmjs.com/package/tsup' },
  ],
  'body-parser': [
    { name: 'express (built-in)', reason: 'Express 4.16+ has built-in body parsing', ecosystem: 'npm', url: 'https://expressjs.com/en/api.html#express.json' },
  ],
  'connect': [
    { name: 'express', reason: 'Express superseded Connect', ecosystem: 'npm', url: 'https://www.npmjs.com/package/express' },
  ],
  'swig': [
    { name: 'nunjucks', reason: 'Maintained Jinja-like template engine', ecosystem: 'npm', url: 'https://www.npmjs.com/package/nunjucks' },
  ],
  'hogan.js': [
    { name: 'handlebars', reason: 'Actively maintained Mustache superset', ecosystem: 'npm', url: 'https://www.npmjs.com/package/handlebars' },
  ],
  'crossenv': [
    { name: 'cross-env', reason: 'crossenv was a typosquat malware — use cross-env', ecosystem: 'npm', url: 'https://www.npmjs.com/package/cross-env' },
  ],
  'event-stream': [
    { name: 'Highland', reason: 'event-stream was compromised — use Highland or native streams', ecosystem: 'npm', url: 'https://www.npmjs.com/package/highland' },
  ],
  // ---- Python ----
  'nose': [
    { name: 'pytest', reason: 'Modern, feature-rich test framework', ecosystem: 'pypi', url: 'https://pypi.org/project/pytest/' },
  ],
  'optparse': [
    { name: 'argparse', reason: 'Standard library replacement', ecosystem: 'pypi', url: 'https://docs.python.org/3/library/argparse.html' },
  ],
  'pycrypto': [
    { name: 'pycryptodome', reason: 'Maintained fork with security fixes', ecosystem: 'pypi', url: 'https://pypi.org/project/pycryptodome/' },
  ],
  'distribute': [
    { name: 'setuptools', reason: 'distribute merged back into setuptools', ecosystem: 'pypi', url: 'https://pypi.org/project/setuptools/' },
  ],
  'pep8': [
    { name: 'pycodestyle', reason: 'pep8 was renamed to pycodestyle', ecosystem: 'pypi', url: 'https://pypi.org/project/pycodestyle/' },
  ],
  'pep257': [
    { name: 'pydocstyle', reason: 'pep257 was renamed to pydocstyle', ecosystem: 'pypi', url: 'https://pypi.org/project/pydocstyle/' },
  ],
  'sklearn': [
    { name: 'scikit-learn', reason: 'sklearn is the unofficial name — use scikit-learn', ecosystem: 'pypi', url: 'https://pypi.org/project/scikit-learn/' },
  ],
  'BeautifulSoup': [
    { name: 'beautifulsoup4', reason: 'BS3 is unmaintained — use beautifulsoup4', ecosystem: 'pypi', url: 'https://pypi.org/project/beautifulsoup4/' },
  ],
  'PIL': [
    { name: 'Pillow', reason: 'PIL is unmaintained — Pillow is the active fork', ecosystem: 'pypi', url: 'https://pypi.org/project/Pillow/' },
  ],
  'fabric': [
    { name: 'fabric2', reason: 'Fabric 1.x is abandoned — use Fabric 2+', ecosystem: 'pypi', url: 'https://pypi.org/project/fabric/' },
  ],
  'mysql-python': [
    { name: 'mysqlclient', reason: 'Maintained fork of mysql-python', ecosystem: 'pypi', url: 'https://pypi.org/project/mysqlclient/' },
  ],
  'django-nose': [
    { name: 'pytest-django', reason: 'Modern Django test runner', ecosystem: 'pypi', url: 'https://pypi.org/project/pytest-django/' },
  ],
  'httplib2': [
    { name: 'httpx', reason: 'Modern async HTTP client', ecosystem: 'pypi', url: 'https://pypi.org/project/httpx/' },
    { name: 'requests', reason: 'Popular HTTP library', ecosystem: 'pypi', url: 'https://pypi.org/project/requests/' },
  ],
  'urllib3': [
    { name: 'httpx', reason: 'Modern HTTP client with async support', ecosystem: 'pypi', url: 'https://pypi.org/project/httpx/' },
  ],
  // ---- Ruby ----
  'iconv': [
    { name: 'String#encode', reason: 'Ruby stdlib encoding — no gem needed', ecosystem: 'rubygems', url: 'https://ruby-doc.org/core/String.html#method-i-encode' },
  ],
  'test-unit': [
    { name: 'rspec', reason: 'Modern Ruby testing framework', ecosystem: 'rubygems', url: 'https://rubygems.org/gems/rspec' },
  ],
  'therubyracer': [
    { name: 'mini_racer', reason: 'Maintained V8 embedding for Ruby', ecosystem: 'rubygems', url: 'https://rubygems.org/gems/mini_racer' },
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

    // Fetch vulnerabilities and GitHub signals in parallel
    const [vulns, enrichedSignals] = await Promise.all([
      fetchVulnerabilities(pkg),
      githubToken ? enrichWithGitHub(signals, githubToken) : Promise.resolve(signals),
    ]);

    signals = { ...enrichedSignals, vulnerabilities: vulns };
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
        deprecated: null,
        vulnerabilities: [],
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
    totalVulnerabilities: 0,
    deprecatedCount: 0,
  };

  let totalRisk = 0;
  for (const a of analyses) {
    summary[a.risk.level]++;
    totalRisk += a.risk.overall;
    summary.totalVulnerabilities += a.signals.vulnerabilities.length;
    if (a.signals.deprecated) summary.deprecatedCount++;
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
