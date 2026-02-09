'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Locale,
  Translations,
  DEFAULT_LOCALE,
  loadTranslations,
  getSavedLocale,
  saveLocale,
} from '@/lib/i18n';
import { RTL_LOCALES } from '@/lib/i18n/types';
import en from '@/lib/i18n/en';

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  t: en,
  setLocale: () => {},
  isRTL: false,
});

function applyDirection(locale: Locale) {
  const isRTL = RTL_LOCALES.includes(locale);
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = locale;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [translations, setTranslations] = useState<Translations>(en);
  const isRTL = RTL_LOCALES.includes(locale);

  useEffect(() => {
    const saved = getSavedLocale();
    applyDirection(saved);
    if (saved !== DEFAULT_LOCALE) {
      setLocaleState(saved);
      loadTranslations(saved).then(setTranslations);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocale(newLocale);
    applyDirection(newLocale);
    loadTranslations(newLocale).then(setTranslations);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t: translations, setLocale, isRTL }}>
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
