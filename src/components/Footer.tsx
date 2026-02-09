'use client';

import { Shield, Github, Heart, Coffee } from 'lucide-react';
import Link from 'next/link';
import { config } from '@/lib/config';
import { useT } from './I18nProvider';
import LanguageSwitcher from './LanguageSwitcher';

export default function Footer() {
  const t = useT();

  return (
    <footer className="border-t border-surface-800 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary-500" />
              <span className="font-bold text-lg">
                <span className="text-surface-100">Deadware</span>
                <span className="text-primary-500">Scanner</span>
              </span>
            </Link>
            <p className="text-surface-400 text-sm max-w-md mb-4">
              {t.footer_desc}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-surface-400 hover:text-surface-100 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={config.buyMeACoffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-surface-400 hover:text-amber-400 transition-colors"
                aria-label="Buy Me a Coffee"
              >
                <Coffee className="w-5 h-5" />
              </a>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-4">
              {t.footer_product}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/scanner" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
                  {t.nav_scanner}
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
                  {t.nav_features}
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
                  {t.nav_pricing}
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
                  {t.nav_how_it_works}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
                  {t.nav_faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-4">
              {t.footer_support}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={config.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-surface-400 hover:text-surface-100 transition-colors"
                >
                  {t.footer_source}
                </a>
              </li>
              <li>
                <a
                  href={`${config.githubRepo}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-surface-400 hover:text-surface-100 transition-colors"
                >
                  {t.footer_report_bug}
                </a>
              </li>
              <li>
                <a
                  href={config.buyMeACoffeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-surface-400 hover:text-surface-100 transition-colors"
                >
                  {t.footer_coffee}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            &copy; {new Date().getFullYear()} Deadware Risk Scanner. {t.cta_built_by}{' '}
            <a
              href={config.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              {config.authorName}
            </a>
          </p>
          <p className="text-sm text-surface-500 flex items-center gap-1">
            {t.footer_made_with} <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {t.footer_community}
          </p>
        </div>
      </div>
    </footer>
  );
}
