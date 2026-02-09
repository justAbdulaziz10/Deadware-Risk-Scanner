export type Locale = 'en' | 'zh' | 'es' | 'pt' | 'ja' | 'hi' | 'ar' | 'fr' | 'de' | 'ru' | 'ko';

export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'EN' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: 'AR', rtl: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: 'ZH' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'DE' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: 'HI' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: 'JA' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: 'KO' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: 'PT' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: 'RU' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'ES' },
];

export const RTL_LOCALES: Locale[] = ['ar'];

export const DEFAULT_LOCALE: Locale = 'en';

export interface Translations {
  // Navbar
  nav_scanner: string;
  nav_features: string;
  nav_pricing: string;
  nav_faq: string;
  nav_login: string;
  nav_signup: string;
  nav_how_it_works: string;
  nav_logout: string;

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
  eco_npm: string;
  eco_pypi: string;
  eco_ruby: string;
  eco_go: string;
  eco_cargo: string;

  // Feature cards (12)
  feat_title_1: string;
  feat_title_2: string;
  feat_subtitle: string;
  feat_cve_title: string;
  feat_cve_desc: string;
  feat_risk_title: string;
  feat_risk_desc: string;
  feat_bus_title: string;
  feat_bus_desc: string;
  feat_eco_title: string;
  feat_eco_desc: string;
  feat_replace_title: string;
  feat_replace_desc: string;
  feat_deprecation_title: string;
  feat_deprecation_desc: string;
  feat_export_title: string;
  feat_export_desc: string;
  feat_privacy_title: string;
  feat_privacy_desc: string;
  feat_github_title: string;
  feat_github_desc: string;
  feat_badge_title: string;
  feat_badge_desc: string;
  feat_sort_title: string;
  feat_sort_desc: string;
  feat_instant_title: string;
  feat_instant_desc: string;

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
  pricing_forever: string;
  pricing_free_f1: string;
  pricing_free_f2: string;
  pricing_free_f3: string;
  pricing_free_f4: string;
  pricing_free_f5: string;
  pricing_free_f6: string;
  pricing_pro_f1: string;
  pricing_pro_f2: string;
  pricing_pro_f3: string;
  pricing_pro_f4: string;
  pricing_pro_f5: string;
  pricing_pro_f6: string;
  pricing_pro_f7: string;
  pricing_pro_f8: string;
  pricing_team_f1: string;
  pricing_team_f2: string;
  pricing_team_f3: string;
  pricing_team_f4: string;
  pricing_team_f5: string;
  pricing_team_f6: string;
  pricing_team_f7: string;
  pricing_save_vs: string;
  pricing_per_seat: string;
  pricing_payments_msg: string;

  // Comparison
  compare_title_1: string;
  compare_title_2: string;
  compare_subtitle: string;
  compare_feature: string;
  compare_f1: string;
  compare_f2: string;
  compare_f3: string;
  compare_f4: string;
  compare_f5: string;
  compare_f6: string;
  compare_f7: string;
  compare_f8: string;
  compare_f9: string;
  compare_f10: string;
  compare_f11: string;
  compare_f12: string;

  // FAQ
  faq_title_1: string;
  faq_title_2: string;
  faq_subtitle: string;
  faq_q1: string;
  faq_a1: string;
  faq_q2: string;
  faq_a2: string;
  faq_q3: string;
  faq_a3: string;
  faq_q4: string;
  faq_a4: string;
  faq_q5: string;
  faq_a5: string;
  faq_q6: string;
  faq_a6: string;
  faq_q7: string;
  faq_a7: string;
  faq_q8: string;
  faq_a8: string;
  faq_q9: string;
  faq_a9: string;
  faq_q10: string;
  faq_a10: string;

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
  scan_history: string;
  scan_settings: string;
  scan_no_history: string;
  scan_packages: string;
  scan_health: string;
  scan_sort_risk: string;
  scan_sort_vulns: string;
  scan_sort_name: string;
  scan_sort_staleness: string;
  scan_support_text: string;
  scan_buy_coffee: string;
  scan_file_loaded: string;
  scan_remove_file: string;
  scan_drop_file: string;
  scan_supported_files: string;
  scan_public_repo: string;
  scan_auto_find: string;
  scan_connect_github: string;
  scan_add_token: string;
  scan_open_settings: string;
  scan_search_repos: string;
  scan_private: string;
  scan_no_repos_match: string;
  scan_repos_loaded: string;
  scan_refresh: string;
  scan_loading_repos: string;
  scan_tpl_react: string;
  scan_tpl_react_desc: string;
  scan_tpl_legacy: string;
  scan_tpl_legacy_desc: string;
  scan_tpl_python: string;
  scan_tpl_python_desc: string;
  scan_tpl_nextjs: string;
  scan_tpl_nextjs_desc: string;
  scan_error_limit: string;
  scan_error_no_url: string;
  scan_error_select_repo: string;
  scan_error_no_content: string;
  scan_error_no_packages: string;
  scan_paste_placeholder: string;
  scan_upgrade_vulns: string;
  scan_upgrade_high_risk: string;
  scan_upgrade_unlock: string;
  scan_upgrade_desc: string;

  // Export
  export_title: string;
  export_share: string;
  export_copied: string;
  export_unlock: string;
  export_upgrade: string;
  export_json_desc: string;
  export_csv_desc: string;
  export_pdf_desc: string;
  export_sbom_desc: string;
  export_badge_desc: string;
  export_ci_desc: string;
  export_pro_hint: string;
  export_exported: string;

  // Package card
  pkg_deprecated: string;
  pkg_deprecated_label: string;
  pkg_vulns_title: string;
  pkg_more_vulns: string;
  pkg_last_release: string;
  pkg_days_ago: string;
  pkg_unknown: string;
  pkg_maintainers: string;
  pkg_open_issues: string;
  pkg_license: string;
  pkg_weekly_downloads: string;
  pkg_na: string;
  pkg_archived: string;
  pkg_yes: string;
  pkg_no: string;
  pkg_risk_factors: string;
  pkg_replacements: string;
  pkg_repository: string;
  pkg_homepage: string;

  // Animated stats
  stats_ecosystems: string;
  stats_risk_factors: string;
  stats_replacements: string;
  stats_client_side: string;

  // Health gauge
  gauge_health: string;

  // Scan summary card
  summary_total: string;
  summary_critical: string;
  summary_high: string;
  summary_medium: string;
  summary_healthy: string;
  summary_known_vulnerability: string;
  summary_known_vulnerabilities: string;
  summary_deprecated_package: string;
  summary_deprecated_packages: string;

  // Settings panel
  settings_title: string;
  settings_close: string;
  settings_desc: string;
  settings_github_label: string;
  settings_github_help: string;
  settings_github_needs: string;
  settings_save: string;
  settings_saved: string;
  settings_auth_error: string;

  // Login
  login_welcome: string;
  login_subtitle: string;
  login_email: string;
  login_email_placeholder: string;
  login_password: string;
  login_password_placeholder: string;
  login_button: string;
  login_loading: string;
  login_or: string;
  login_github: string;
  login_github_loading: string;
  login_no_account: string;

  // Signup
  signup_title: string;
  signup_subtitle: string;
  signup_email: string;
  signup_email_placeholder: string;
  signup_password: string;
  signup_password_placeholder: string;
  signup_button: string;
  signup_loading: string;
  signup_or: string;
  signup_github: string;
  signup_github_loading: string;
  signup_has_account: string;
  signup_check_email: string;
  signup_confirm_sent: string;
  signup_activate: string;
  signup_back_login: string;

  // Success page
  success_title: string;
  success_plan_active: string;
  success_unlocked: string;
  success_f1: string;
  success_f2: string;
  success_f3: string;
  success_f4: string;
  success_f5: string;
  success_f6: string;
  success_f7: string;
  success_f8: string;
  success_f9: string;
  success_start: string;
  success_synced: string;
  success_confirming: string;
  success_wait: string;

  // Footer
  footer_desc: string;
  footer_product: string;
  footer_support: string;
  footer_source: string;
  footer_report_bug: string;
  footer_coffee: string;
  footer_made_with: string;
  footer_community: string;

  // Common
  common_upgrade_pro: string;
  common_free_scans: string;
}
