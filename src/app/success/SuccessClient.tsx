'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchUserPlan } from '@/lib/storage';
import { CheckCircle2, ArrowRight, Shield, Sparkles, Loader2 } from 'lucide-react';
import { useT } from '@/components/I18nProvider';

export default function SuccessClient() {
  const t = useT();
  const [planName, setPlanName] = useState<string | null>(null);

  useEffect(() => {
    // Poll for plan activation (webhook may take a few seconds)
    let attempts = 0;
    const maxAttempts = 10;

    async function checkPlan() {
      const plan = await fetchUserPlan();
      if (plan.tier !== 'free') {
        setPlanName(plan.tier === 'team' ? 'Team' : 'Pro');
        return;
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(checkPlan, 2000);
      } else {
        // After 20s, show success anyway (webhook might be delayed)
        setPlanName('Pro');
      }
    }

    checkPlan();
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          {planName ? (
            <div className="animate-slide-up">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-pulse-glow" />
                <CheckCircle2 className="w-16 h-16 text-emerald-400 relative z-10" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                {t.success_title}
              </h1>

              <p className="text-surface-400 text-lg mb-8">
                <span className="text-primary-400 font-semibold">{planName}</span> {t.success_plan_active}
              </p>

              <div className="bg-surface-900/50 border border-surface-800 rounded-xl p-6 mb-8 text-left">
                <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {t.success_unlocked}
                </h3>
                <ul className="space-y-3">
                  {[
                    t.success_f1,
                    t.success_f2,
                    t.success_f3,
                    t.success_f4,
                    t.success_f5,
                    t.success_f6,
                    ...(planName === 'Team' ? [
                      t.success_f7,
                      t.success_f8,
                      t.success_f9,
                    ] : []),
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-surface-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary-600/25"
              >
                {t.success_start}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-xs text-surface-500 mt-6">
                {t.success_synced}
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <Loader2 className="w-12 h-12 text-primary-500 mx-auto mb-4 animate-spin" />
              <p className="text-surface-400">{t.success_confirming}</p>
              <p className="text-xs text-surface-500 mt-2">{t.success_wait}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
