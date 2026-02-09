export type Ecosystem = 'npm' | 'pypi' | 'rubygems' | 'go' | 'cargo';

export interface ParsedPackage {
  name: string;
  version: string;
  ecosystem: Ecosystem;
}

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'healthy';

export interface Vulnerability {
  id: string;
  summary: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'UNKNOWN';
  aliases: string[];
  url: string;
}

export interface MaintenanceSignals {
  lastReleaseDate: string | null;
  daysSinceLastRelease: number | null;
  maintainerCount: number | null;
  openIssueCount: number | null;
  weeklyDownloads: number | null;
  repositoryArchived: boolean | null;
  hasSecurityPolicy: boolean | null;
  license: string | null;
  description: string | null;
  homepage: string | null;
  repository: string | null;
  deprecated: string | null;
  vulnerabilities: Vulnerability[];
}

export interface RiskScore {
  overall: number; // 0-100, higher = riskier
  level: RiskLevel;
  factors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

export interface ReplacementSuggestion {
  name: string;
  reason: string;
  ecosystem: Ecosystem;
  url: string;
}

export interface PackageAnalysis {
  package: ParsedPackage;
  signals: MaintenanceSignals;
  risk: RiskScore;
  replacements: ReplacementSuggestion[];
  scannedAt: string;
  error?: string;
}

export interface ScanResult {
  id: string;
  packages: PackageAnalysis[];
  summary: ScanSummary;
  createdAt: string;
  ecosystem: Ecosystem;
  rawInput: string;
}

export interface ScanSummary {
  totalPackages: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  healthy: number;
  overallHealthScore: number; // 0-100, higher = healthier
  totalVulnerabilities: number;
  deprecatedCount: number;
}

export interface UserSettings {
  npmToken?: string;
  githubToken?: string;
  pypiToken?: string;
}

export interface UserPlan {
  tier: 'free' | 'pro' | 'team';
  scansUsed: number;
  maxScans: number;
  features: string[];
}
