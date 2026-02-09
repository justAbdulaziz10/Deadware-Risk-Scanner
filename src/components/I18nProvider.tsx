'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Locale,
  Translations,
  DEFAULT_LOCALE,
  loadTranslations,
  getTranslationsSync,
  getSavedLocale,
  saveLocale,
} from '@/lib/i18n';
import en from '@/lib/i18n/en';

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  t: en,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [translations, setTranslations] = useState<Translations>(en);

  useEffect(() => {
    const saved = getSavedLocale();
    if (saved !== DEFAULT_LOCALE) {
      setLocaleState(saved);
      loadTranslations(saved).then(setTranslations);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocale(newLocale);
    loadTranslations(newLocale).then(setTranslations);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t: translations, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useT() {
  const { t } = useContext(I18nContext);
  return t;
}
