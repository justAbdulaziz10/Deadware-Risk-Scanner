'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { config, isStripeConfigured, getStripeLink } from '@/lib/config';

export default function PricingSection() {
  const stripeReady = isStripeConfigured();

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, <span className="gradient-text">Developer-Friendly</span> Pricing
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            Start free. Upgrade when your team needs unlimited scans, exports, and CI integration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Free */}
          <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-1">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-surface-400">/forever</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                'Up to 5 scans per month',
                'Full risk dashboard',
                'Replacement suggestions',
                'npm & PyPI support',
                'Local storage results',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-surface-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/scanner"
              className="w-full py-3 rounded-lg border border-surface-600 text-surface-200 text-center font-medium hover:bg-surface-800 transition-colors text-sm block"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro — highlighted */}
          <div className="bg-surface-900/50 border-2 border-primary-500 rounded-2xl p-8 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-1">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">${config.pricing.proPrice}</span>
                <span className="text-surface-400">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                'Unlimited scans',
                'All 5+ ecosystems',
                'PDF & JSON export',
                'CI health badge embed',
                'Scan history (50 reports)',
                'Priority registry checks',
                'GitHub enrichment (BYOK)',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-surface-300">
                  <CheckCircle2 className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={stripeReady ? getStripeLink('pro') : '#pricing'}
              target={stripeReady ? '_blank' : undefined}
              rel={stripeReady ? 'noopener noreferrer' : undefined}
              onClick={!stripeReady ? (e) => {
                e.preventDefault();
                alert('Stripe checkout is being set up. Check back soon!');
              } : undefined}
              className="w-full py-3 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-center font-medium transition-colors text-sm block"
            >
              Upgrade to Pro
            </a>
          </div>

          {/* Team */}
          <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-1">Team</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">${config.pricing.teamPrice}</span>
                <span className="text-surface-400">/month</span>
              </div>
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
              href={stripeReady ? getStripeLink('team') : '#pricing'}
              target={stripeReady ? '_blank' : undefined}
              rel={stripeReady ? 'noopener noreferrer' : undefined}
              onClick={!stripeReady ? (e) => {
                e.preventDefault();
                alert('Stripe checkout is being set up. Check back soon!');
              } : undefined}
              className="w-full py-3 rounded-lg border border-surface-600 text-surface-200 text-center font-medium hover:bg-surface-800 transition-colors text-sm block"
            >
              Upgrade to Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
