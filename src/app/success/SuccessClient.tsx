'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { activatePlan, getUserPlan } from '@/lib/storage';
import { CheckCircle2, ArrowRight, Shield, Sparkles } from 'lucide-react';

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const [activated, setActivated] = useState(false);
  const [planName, setPlanName] = useState<string>('Pro');

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan === 'pro' || plan === 'team') {
      activatePlan(plan);
      setPlanName(plan === 'team' ? 'Team' : 'Pro');
      setActivated(true);
    } else {
      // Default to pro if no plan param
      const currentPlan = getUserPlan();
      if (currentPlan.tier === 'free') {
        activatePlan('pro');
        setActivated(true);
      } else {
        setPlanName(currentPlan.tier === 'team' ? 'Team' : 'Pro');
        setActivated(true);
      }
    }
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          {activated ? (
            <div className="animate-slide-up">
              {/* Success icon */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-pulse-glow" />
                <CheckCircle2 className="w-16 h-16 text-emerald-400 relative z-10" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Payment Successful!
              </h1>

              <p className="text-surface-400 text-lg mb-8">
                Your <span className="text-primary-400 font-semibold">{planName}</span> plan is now active. All premium features are unlocked.
              </p>

              {/* Unlocked features */}
              <div className="bg-surface-900/50 border border-surface-800 rounded-xl p-6 mb-8 text-left">
                <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Unlocked Features
                </h3>
                <ul className="space-y-3">
                  {[
                    'Unlimited dependency scans',
                    'PDF & JSON report export',
                    'CI health badge for your README',
                    'All 5+ ecosystems (npm, PyPI, RubyGems, Go, Cargo)',
                    'Full scan history (50 reports)',
                    'GitHub enrichment with BYOK token',
                    ...(planName === 'Team' ? [
                      'Up to 10 team members',
                      'Slack/webhook notifications',
                      'Custom risk thresholds',
                    ] : []),
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-surface-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary-600/25"
              >
                Start Scanning
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-xs text-surface-500 mt-6">
                Your plan is stored locally in your browser. If you clear your browser data, you may need to reactivate.
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <Shield className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400">Processing your payment...</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
