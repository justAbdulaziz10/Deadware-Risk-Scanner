import { Locale, DEFAULT_LOCALE, Translations } from './types';
import en from './en';

const translationModules: Record<Locale, () => Promise<{ default: Translations }>> = {
  en: () => Promise.resolve({ default: en }),
  ar: () => import('./ar'),
  zh: () => import('./zh'),
  de: () => import('./de'),
  es: () => import('./es'),
  fr: () => import('./fr'),
  hi: () => import('./hi'),
  ja: () => import('./ja'),
  ko: () => import('./ko'),
  pt: () => import('./pt'),
  ru: () => import('./ru'),
};

const cache: Partial<Record<Locale, Translations>> = { en };

export async function loadTranslations(locale: Locale): Promise<Translations> {
  if (cache[locale]) return cache[locale]!;
  const mod = await translationModules[locale]();
  cache[locale] = mod.default;
  return mod.default;
}

export function getTranslationsSync(locale: Locale): Translations {
  return cache[locale] || en;
}

const STORAGE_KEY = 'deadware_locale';

export function getSavedLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && ['en', 'ar', 'zh', 'de', 'es', 'fr', 'hi', 'ja', 'ko', 'pt', 'ru'].includes(saved)) {
    return saved as Locale;
  }
  // Always default to English regardless of browser language
  return DEFAULT_LOCALE;
}

export function saveLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, locale);
}

export { type Locale, type Translations, DEFAULT_LOCALE, LOCALES } from './types';
