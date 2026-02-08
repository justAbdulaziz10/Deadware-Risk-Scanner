import { ScanResult, UserSettings, UserPlan } from '@/types';

const STORAGE_KEYS = {
  SCANS: 'deadware_scans',
  SETTINGS: 'deadware_settings',
  PLAN: 'deadware_plan',
} as const;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// ---- Scan Results ----

export function saveScanResult(result: ScanResult): void {
  if (!isBrowser()) return;
  const existing = getScanHistory();
  existing.unshift(result);
  // Keep last 50 scans
  const trimmed = existing.slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(trimmed));
}

export function getScanHistory(): ScanResult[] {
  if (!isBrowser()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCANS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteScanResult(id: string): void {
  if (!isBrowser()) return;
  const existing = getScanHistory();
  const filtered = existing.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(filtered));
}

export function clearScanHistory(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.SCANS);
}

// ---- User Settings (BYOK tokens) ----

export function saveSettings(settings: UserSettings): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getSettings(): UserSettings {
  if (!isBrowser()) return {};
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// ---- User Plan ----

const DEFAULT_PLAN: UserPlan = {
  tier: 'free',
  scansUsed: 0,
  maxScans: 5,
  features: ['basic_scan', 'risk_dashboard'],
};

export function getUserPlan(): UserPlan {
  if (!isBrowser()) return DEFAULT_PLAN;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAN);
    return data ? JSON.parse(data) : DEFAULT_PLAN;
  } catch {
    return DEFAULT_PLAN;
  }
}

export function saveUserPlan(plan: UserPlan): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
}

export function incrementScanCount(): void {
  const plan = getUserPlan();
  plan.scansUsed++;
  saveUserPlan(plan);
}

export function canScan(): boolean {
  const plan = getUserPlan();
  if (plan.tier !== 'free') return true;
  return plan.scansUsed < plan.maxScans;
}

export function activateProPlan(): void {
  saveUserPlan({
    tier: 'pro',
    scansUsed: 0,
    maxScans: Infinity,
    features: ['basic_scan', 'risk_dashboard', 'export_pdf', 'export_json', 'ci_badge', 'unlimited_scans', 'priority_support'],
  });
}

export function activateTeamPlan(): void {
  saveUserPlan({
    tier: 'team',
    scansUsed: 0,
    maxScans: Infinity,
    features: ['basic_scan', 'risk_dashboard', 'export_pdf', 'export_json', 'ci_badge', 'unlimited_scans', 'priority_support', 'team_dashboard', 'webhooks', 'custom_thresholds'],
  });
}

export function activatePlan(plan: 'pro' | 'team'): void {
  if (plan === 'team') {
    activateTeamPlan();
  } else {
    activateProPlan();
  }
}
