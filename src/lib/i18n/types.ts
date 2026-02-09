export type Locale = 'en' | 'zh' | 'es' | 'pt' | 'ja' | 'hi';

export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

export const LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'EN' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: 'ZH' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'ES' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: 'PT' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: 'JA' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: 'HI' },
];

export const DEFAULT_LOCALE: Locale = 'en';

export interface Translations {
  // Navbar
  nav_scanner: string;
  nav_features: string;
  nav_pricing: string;
  nav_faq: string;
  nav_login: string;
  nav_signup: string;

  // Hero
  hero_badge: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_subtitle: string;
  hero_cta: string;
  hero_github: string;
  hero_trust_client: string;
  hero_trust_nodata: string;
  hero_trust_cve: string;
  hero_trust_ecosystems: string;
  hero_trust_nosignup: string;

  // How it works
  how_title_1: string;
  how_title_2: string;
  how_subtitle: string;
  how_step1_title: string;
  how_step1_desc: string;
  how_step2_title: string;
  how_step2_desc: string;
  how_step3_title: string;
  how_step3_desc: string;

  // Ecosystem
  eco_title_1: string;
  eco_title_2: string;
  eco_subtitle: string;

  // Features
  feat_title_1: string;
  feat_title_2: string;
  feat_subtitle: string;

  // Pricing
  pricing_badge: string;
  pricing_title_1: string;
  pricing_title_2: string;
  pricing_subtitle: string;
  pricing_free: string;
  pricing_free_price: string;
  pricing_no_cc: string;
  pricing_pro: string;
  pricing_per_month: string;
  pricing_team: string;
  pricing_most_popular: string;
  pricing_cancel: string;
  pricing_start_free: string;
  pricing_upgrade_pro: string;
  pricing_upgrade_team: string;
  pricing_trust_text: string;

  // CTA
  cta_title: string;
  cta_subtitle: string;
  cta_button: string;
  cta_built_by: string;
  cta_support: string;

  // Scanner
  scan_title: string;
  scan_subtitle: string;
  scan_paste: string;
  scan_upload: string;
  scan_repo_url: string;
  scan_my_repos: string;
  scan_button: string;
  scan_scanning: string;
  scan_fetching: string;
  scan_template_label: string;
  scan_dep_label: string;
  scan_load_sample: string;
  scan_search: string;
  scan_filter: string;
  scan_all: string;
  scan_no_match: string;

  // Export
  export_title: string;
  export_share: string;
  export_copied: string;
  export_unlock: string;
  export_upgrade: string;

  // Footer
  footer_desc: string;
  footer_product: string;
  footer_support: string;
  footer_source: string;
  footer_report_bug: string;
  footer_coffee: string;
  footer_made_with: string;

  // Common
  common_upgrade_pro: string;
  common_free_scans: string;
}
