import { ScanResult, UserSettings, UserPlan } from '@/types';
import { createClient } from '@/lib/supabase/client';

const STORAGE_KEYS = {
  SCANS: 'deadware_scans',
  SETTINGS: 'deadware_settings',
} as const;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// ---- Scan Results (localStorage, user-local, no auth needed) ----

export function saveScanResult(result: ScanResult): void {
  if (!isBrowser()) return;
  const existing = getScanHistory();
  existing.unshift(result);
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

// ---- User Settings (localStorage, BYOK tokens stay local) ----

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

// ---- User Plan (Supabase, server-verified) ----

const FREE_PLAN: UserPlan = {
  tier: 'free',
  scansUsed: 0,
  maxScans: 5,
  features: ['basic_scan', 'risk_dashboard'],
};

const PRO_PLAN: UserPlan = {
  tier: 'pro',
  scansUsed: 0,
  maxScans: Infinity,
  features: ['basic_scan', 'risk_dashboard', 'export_pdf', 'export_json', 'ci_badge', 'unlimited_scans', 'priority_support'],
};

const TEAM_PLAN: UserPlan = {
  tier: 'team',
  scansUsed: 0,
  maxScans: Infinity,
  features: ['basic_scan', 'risk_dashboard', 'export_pdf', 'export_json', 'ci_badge', 'unlimited_scans', 'priority_support', 'team_dashboard', 'webhooks', 'custom_thresholds'],
};

function planFromTier(tier: string): UserPlan {
  switch (tier) {
    case 'pro': return { ...PRO_PLAN };
    case 'team': return { ...TEAM_PLAN };
    default: return { ...FREE_PLAN };
  }
}

// Fetch user's plan from Supabase
export async function fetchUserPlan(): Promise<UserPlan> {
  if (!isBrowser()) return FREE_PLAN;

  try {
    const supabase = createClient();
    if (!supabase) return FREE_PLAN;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return FREE_PLAN;

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, scans_used')
      .eq('id', user.id)
      .single();

    if (!profile) return FREE_PLAN;

    const plan = planFromTier(profile.plan);
    plan.scansUsed = profile.scans_used || 0;
    return plan;
  } catch {
    return FREE_PLAN;
  }
}

// Increment scan count in Supabase
export async function incrementScanCount(): Promise<void> {
  if (!isBrowser()) return;

  try {
    const supabase = createClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.rpc('increment_scan_count', { user_id: user.id });
  } catch {
    // Silently fail, don't block scanning
  }
}

// Check if user can scan (plan-based)
export async function canScan(): Promise<boolean> {
  const plan = await fetchUserPlan();
  if (plan.tier !== 'free') return true;
  return plan.scansUsed < plan.maxScans;
}

// Synchronous fallback for components that can't await
export function getUserPlan(): UserPlan {
  return FREE_PLAN;
}
