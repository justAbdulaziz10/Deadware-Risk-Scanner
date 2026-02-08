import { ParsedPackage, Ecosystem } from '@/types';

export function detectEcosystem(input: string): Ecosystem {
  const trimmed = input.trim();

  // package.json detection
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.dependencies || parsed.devDependencies || parsed.peerDependencies) {
        return 'npm';
      }
    } catch {
      // not valid JSON, continue
    }
  }

  // Cargo.toml
  if (trimmed.includes('[dependencies]') && (trimmed.includes('version =') || trimmed.includes('version='))) {
    return 'cargo';
  }

  // go.mod
  if (trimmed.startsWith('module ') || trimmed.includes('require (')) {
    return 'go';
  }

  // Gemfile
  if (trimmed.includes("gem '") || trimmed.includes('gem "') || trimmed.includes('source "https://rubygems.org"')) {
    return 'rubygems';
  }

  // requirements.txt (default for simple lists with ==)
  if (trimmed.includes('==') || trimmed.includes('>=')) {
    return 'pypi';
  }

  // Default to npm
  return 'npm';
}

export function parsePackageJson(input: string): ParsedPackage[] {
  const packages: ParsedPackage[] = [];

  try {
    const parsed = JSON.parse(input);
    const allDeps = {
      ...parsed.dependencies,
      ...parsed.devDependencies,
      ...parsed.peerDependencies,
    };

    for (const [name, version] of Object.entries(allDeps)) {
      packages.push({
        name,
        version: String(version).replace(/[\^~>=<]/g, ''),
        ecosystem: 'npm',
      });
    }
  } catch {
    // Try line-by-line for partial input
    const lines = input.split('\n');
    for (const line of lines) {
      const match = line.match(/"([^"]+)":\s*"([^"]+)"/);
      if (match) {
        packages.push({
          name: match[1],
          version: match[2].replace(/[\^~>=<]/g, ''),
          ecosystem: 'npm',
        });
      }
    }
  }

  return packages;
}

export function parseRequirementsTxt(input: string): ParsedPackage[] {
  const packages: ParsedPackage[] = [];
  const lines = input.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('-')) continue;

    // Handle formats: package==1.0.0, package>=1.0.0, package~=1.0.0, package
    const match = trimmed.match(/^([a-zA-Z0-9_.-]+)\s*(?:[>=<!~]+\s*(.+))?$/);
    if (match) {
      packages.push({
        name: match[1],
        version: match[2]?.trim() || 'latest',
        ecosystem: 'pypi',
      });
    }
  }

  return packages;
}

export function parseGemfile(input: string): ParsedPackage[] {
  const packages: ParsedPackage[] = [];
  const lines = input.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/gem\s+['"]([^'"]+)['"](?:,\s*['"]([^'"]+)['"])?/);
    if (match) {
      packages.push({
        name: match[1],
        version: match[2]?.replace(/[\^~>=<]/g, '') || 'latest',
        ecosystem: 'rubygems',
      });
    }
  }

  return packages;
}

export function parseGoMod(input: string): ParsedPackage[] {
  const packages: ParsedPackage[] = [];
  const lines = input.split('\n');
  let inRequire = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === 'require (') {
      inRequire = true;
      continue;
    }
    if (trimmed === ')') {
      inRequire = false;
      continue;
    }

    if (inRequire || trimmed.startsWith('require ')) {
      const requireLine = trimmed.replace('require ', '');
      const match = requireLine.match(/^([^\s]+)\s+v?(.+)$/);
      if (match) {
        packages.push({
          name: match[1],
          version: match[2],
          ecosystem: 'go',
        });
      }
    }
  }

  return packages;
}

export function parseCargoToml(input: string): ParsedPackage[] {
  const packages: ParsedPackage[] = [];
  const lines = input.split('\n');
  let inDeps = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.match(/^\[(.*dependencies.*)\]$/)) {
      inDeps = true;
      continue;
    }
    if (trimmed.startsWith('[') && !trimmed.includes('dependencies')) {
      inDeps = false;
      continue;
    }

    if (inDeps) {
      // Simple format: name = "version"
      const simpleMatch = trimmed.match(/^([a-zA-Z0-9_-]+)\s*=\s*"([^"]+)"/);
      if (simpleMatch) {
        packages.push({
          name: simpleMatch[1],
          version: simpleMatch[2],
          ecosystem: 'cargo',
        });
        continue;
      }

      // Table format: name = { version = "1.0" }
      const tableMatch = trimmed.match(/^([a-zA-Z0-9_-]+)\s*=\s*\{.*version\s*=\s*"([^"]+)"/);
      if (tableMatch) {
        packages.push({
          name: tableMatch[1],
          version: tableMatch[2],
          ecosystem: 'cargo',
        });
      }
    }
  }

  return packages;
}

export function parseInput(input: string): ParsedPackage[] {
  const ecosystem = detectEcosystem(input);

  switch (ecosystem) {
    case 'npm':
      return parsePackageJson(input);
    case 'pypi':
      return parseRequirementsTxt(input);
    case 'rubygems':
      return parseGemfile(input);
    case 'go':
      return parseGoMod(input);
    case 'cargo':
      return parseCargoToml(input);
    default:
      return parsePackageJson(input);
  }
}
