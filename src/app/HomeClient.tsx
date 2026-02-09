'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import PricingSection from '@/components/PricingSection';
import { config } from '@/lib/config';
import FAQSection from '@/components/FAQSection';
import ComparisonSection from '@/components/ComparisonSection';
import AnimatedStats from '@/components/AnimatedStats';
import EcosystemShowcase from '@/components/EcosystemShowcase';
import { useT } from '@/components/I18nProvider';
import {
  Shield,
  Search,
  BarChart3,
  Download,
  Zap,
  Lock,
  GitBranch,
  Package,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Coffee,
  Github,
  Star,
  Badge,
  ShieldAlert,
  Upload,
  Table2,
  Eye,
} from 'lucide-react';

export default function HomeClient() {
  const t = useT();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden grid-pattern">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">
                {t.hero_badge}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              {t.hero_title_1}{' '}
              <span className="gradient-text">{t.hero_title_2}</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              {t.hero_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/scanner"
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary-600/25 flex items-center gap-2 animate-pulse-glow"
              >
                {t.hero_cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={config.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-surface-700 hover:border-surface-500 text-surface-300 hover:text-surface-100 px-8 py-3.5 rounded-xl text-base font-medium transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                {t.hero_github}
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-surface-500 text-sm">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>{t.hero_trust_client}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{t.hero_trust_nodata}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>{t.hero_trust_cve}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>{t.hero_trust_ecosystems}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>{t.hero_trust_nosignup}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Stats */}
        <AnimatedStats />

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {t.how_title_1}{' '}
                <span className="gradient-text">{t.how_title_2}</span>
              </h2>
              <p className="text-surface-400 text-lg max-w-2xl mx-auto">
                {t.how_subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', icon: Upload, title: t.how_step1_title, desc: t.how_step1_desc },
                { step: '02', icon: Search, title: t.how_step2_title, desc: t.how_step2_desc },
                { step: '03', icon: BarChart3, title: t.how_step3_title, desc: t.how_step3_desc },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative bg-surface-900/50 border border-surface-800 rounded-2xl p-8 hover:border-primary-500/30 transition-colors group"
                >
                  <span className="text-5xl font-black text-surface-800 absolute top-4 right-6 group-hover:text-surface-700 transition-colors">
                    {item.step}
                  </span>
                  <item.icon className="w-10 h-10 text-primary-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-surface-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Supported Ecosystems */}
        <EcosystemShowcase />

        {/* Features */}
        <section id="features" className="py-24 px-4 bg-surface-900/30 border-y border-surface-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {t.feat_title_1}{' '}
                <span className="gradient-text">{t.feat_title_2}</span>
              </h2>
              <p className="text-surface-400 text-lg max-w-2xl mx-auto">
                {t.feat_subtitle}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: ShieldAlert, title: 'CVE Vulnerability Scanning', desc: 'Checks every dependency against Google\'s OSV database for known security vulnerabilities with CVSS severity ratings.', color: 'text-red-500' },
                { icon: AlertTriangle, title: 'Deadware Risk Score', desc: 'Every package gets a 0-100 risk score based on 7 weighted factors: staleness, bus factor, archived status, CVEs, deprecation, and more.', color: 'text-red-400' },
                { icon: GitBranch, title: 'Bus Factor Analysis', desc: 'Identify single-maintainer packages, the #1 predictor of future abandonment and supply chain incidents.', color: 'text-amber-400' },
                { icon: Package, title: '5 Ecosystems Supported', desc: 'npm (package.json), PyPI (requirements.txt), RubyGems (Gemfile), Go Modules (go.mod), and Cargo (Cargo.toml).', color: 'text-blue-400' },
                { icon: CheckCircle2, title: '50+ Replacement Suggestions', desc: 'Get curated, actively-maintained alternatives for every risky package, from "moment" to "date-fns".', color: 'text-green-400' },
                { icon: Eye, title: 'Deprecation Detection', desc: 'Instantly detect npm deprecated packages with the exact deprecation message from maintainers.', color: 'text-orange-400' },
                { icon: Download, title: 'PDF, JSON & CSV Export', desc: 'Export reports as PDF for stakeholders, JSON for CI/CD, or CSV for spreadsheets.', color: 'text-purple-400' },
                { icon: Lock, title: 'Privacy-First (BYOK)', desc: 'All analysis runs in your browser. Bring your own GitHub token for richer data. Nothing ever leaves your machine.', color: 'text-teal-400' },
                { icon: Github, title: 'GitHub Integration', desc: 'Scan any public repo by URL, or connect your account to browse and scan private repos.', color: 'text-surface-300' },
                { icon: Badge, title: 'CI Health Badge', desc: 'Embed a shields.io badge in your README showing your dependency health score.', color: 'text-indigo-400' },
                { icon: Table2, title: 'Sort, Filter & Search', desc: 'Sort by risk, name, or staleness. Filter by level. Find the most dangerous dependencies instantly.', color: 'text-cyan-400' },
                { icon: Zap, title: 'Instant Results', desc: 'Scans complete in seconds with parallel registry and CVE lookups. No queues or accounts needed.', color: 'text-yellow-400' },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-surface-950/60 border border-surface-800 rounded-xl p-6 hover:border-surface-600 transition-colors"
                >
                  <feature.icon className={`w-8 h-8 ${feature.color} mb-3`} />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-surface-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <PricingSection />

        {/* Comparison */}
        <ComparisonSection />

        {/* FAQ */}
        <FAQSection />

        {/* CTA + Support */}
        <section className="py-24 px-4 bg-surface-900/30 border-t border-surface-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t.cta_title}
            </h2>
            <p className="text-surface-400 text-lg mb-8 max-w-xl mx-auto">
              {t.cta_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/scanner"
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary-600/25 flex items-center gap-2"
              >
                {t.cta_button}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-col items-center gap-3 pt-8 border-t border-surface-800">
              <p className="text-surface-500 text-sm">
                {t.cta_built_by}{' '}
                <a
                  href={config.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {config.authorName}
                </a>
              </p>
              <a
                href={config.buyMeACoffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:text-amber-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Coffee className="w-4 h-4" />
                {t.cta_support}
              </a>
              <div className="flex items-center gap-4 mt-2">
                <a
                  href={config.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-surface-400 hover:text-surface-200 text-sm transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href={config.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-surface-400 hover:text-surface-200 text-sm transition-colors"
                >
                  <Star className="w-4 h-4" />
                  {t.hero_github}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
