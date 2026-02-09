'use client';

import Link from 'next/link';
import { CheckCircle2, Zap, Shield, Crown, TrendingDown } from 'lucide-react';
import { config, isPolarConfigured, getCheckoutUrl } from '@/lib/config';
import { useT } from './I18nProvider';

const COMPETITORS = [
  { name: 'Snyk', price: '$399', per: '/mo', note: 'Team plan' },
  { name: 'Socket.dev', price: '$200', per: '/mo', note: 'Business plan' },
  { name: 'WhiteSource', price: '$250', per: '/mo', note: 'Per project' },
];

export default function PricingSection() {
  const paymentsReady = isPolarConfigured();
  const proPrice = Number(config.pricing.proPrice);
  const teamPrice = Number(config.pricing.teamPrice);
  const t = useT();

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <TrendingDown className="w-3.5 h-3.5" />
            {t.pricing_badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t.pricing_title_1} <span className="gradient-text">{t.pricing_title_2}</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            {t.pricing_subtitle} <strong className="text-surface-200">{t.pricing_free_price}</strong>.
          </p>
        </div>

        {/* Competitor price comparison strip */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {COMPETITORS.map((c) => (
            <div key={c.name} className="flex items-center gap-2 bg-surface-900/50 border border-surface-800 rounded-full px-4 py-2">
              <span className="text-xs text-surface-500">{c.name}</span>
              <span className="text-xs text-red-400 line-through">{c.price}{c.per}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 bg-primary-600/10 border border-primary-500/20 rounded-full px-4 py-2">
            <span className="text-xs text-primary-400 font-medium">Deadware Scanner</span>
            <span className="text-xs text-emerald-400 font-bold">${proPrice}/mo</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Free */}
          <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-surface-400" />
                <h3 className="text-lg font-semibold">{t.pricing_free}</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{t.pricing_free_price}</span>
                <span className="text-surface-400">/forever</span>
              </div>
              <p className="text-xs text-surface-500 mt-2">{t.pricing_no_cc}</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                '5 scans per month',
                'CVE vulnerability detection',
                'Abandonment risk scoring',
                'Replacement suggestions',
                'npm, PyPI, Go, Cargo, Ruby',
                'Share results link',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-surface-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="w-full py-3 rounded-lg border border-surface-600 text-surface-200 text-center font-medium hover:bg-surface-800 transition-colors text-sm block"
            >
              {t.pricing_start_free}
            </Link>
          </div>

          {/* Pro - highlighted */}
          <div className="bg-surface-900/50 border-2 border-primary-500 rounded-2xl p-8 flex flex-col relative shadow-lg shadow-primary-500/5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              {t.pricing_most_popular}
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold">{t.pricing_pro}</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">${proPrice}</span>
                <span className="text-surface-400">{t.pricing_per_month}</span>
              </div>
              <p className="text-xs text-emerald-400 mt-2">
                Save ${399 - proPrice}/mo vs Snyk
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                'Unlimited scans',
                'All 5+ ecosystems',
                'PDF, CSV & JSON export',
                'SBOM export (CycloneDX)',
                'CI badge & GitHub Actions YAML',
                'Scan history (50 reports)',
                'GitHub enrichment (BYOK)',
                'Priority support',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-surface-300">
                  <CheckCircle2 className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={paymentsReady ? getCheckoutUrl('pro') : '#pricing'}
              onClick={!paymentsReady ? (e: React.MouseEvent) => {
                e.preventDefault();
                alert('Payments are being set up. Check back soon!');
              } : undefined}
              className="w-full py-3.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-center font-semibold transition-colors text-sm block"
            >
              {t.pricing_upgrade_pro}
            </a>
            <p className="text-[10px] text-surface-500 text-center mt-3">{t.pricing_cancel}</p>
          </div>

          {/* Team */}
          <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">{t.pricing_team}</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">${teamPrice}</span>
                <span className="text-surface-400">{t.pricing_per_month}</span>
              </div>
              <p className="text-xs text-emerald-400 mt-2">
                ${Math.round(teamPrice / 10)}/seat, cheaper than a coffee
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                'Everything in Pro',
                'Up to 10 team members',
                'Shared scan dashboard',
                'Slack/webhook notifications',
                'Custom risk thresholds',
                'Priority support',
                'Annual billing discount',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-surface-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={paymentsReady ? getCheckoutUrl('team') : '#pricing'}
              onClick={!paymentsReady ? (e: React.MouseEvent) => {
                e.preventDefault();
                alert('Payments are being set up. Check back soon!');
              } : undefined}
              className="w-full py-3 rounded-lg border border-surface-600 text-surface-200 text-center font-medium hover:bg-surface-800 transition-colors text-sm block"
            >
              {t.pricing_upgrade_team}
            </a>
          </div>
        </div>

        {/* Social proof / trust */}
        <div className="mt-12 text-center">
          <p className="text-xs text-surface-500 mb-4">{t.pricing_trust_text}</p>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { label: 'npm', color: 'text-red-400' },
              { label: 'PyPI', color: 'text-blue-400' },
              { label: 'RubyGems', color: 'text-rose-400' },
              { label: 'Go Modules', color: 'text-cyan-400' },
              { label: 'Cargo', color: 'text-orange-400' },
            ].map((eco) => (
              <span key={eco.label} className={`text-sm font-medium ${eco.color}`}>{eco.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
