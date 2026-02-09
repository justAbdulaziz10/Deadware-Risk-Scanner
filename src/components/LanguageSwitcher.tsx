'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from './I18nProvider';
import { LOCALES } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = LOCALES.find((l) => l.code === locale);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-surface-400 hover:text-surface-100 transition-colors text-xs px-2 py-1.5 rounded-md border border-surface-800 hover:border-surface-600"
        aria-label="Change language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{current?.flag || 'EN'}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-surface-900 border border-surface-700 rounded-lg shadow-xl py-1 min-w-[140px] z-50 animate-fade-in">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
                locale === l.code
                  ? 'text-primary-400 bg-primary-600/10'
                  : 'text-surface-300 hover:bg-surface-800'
              }`}
            >
              <span className="text-xs font-mono w-6">{l.flag}</span>
              <span>{l.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
