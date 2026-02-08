import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import PricingSection from '@/components/PricingSection';
import { config } from '@/lib/config';
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
  FileJson,
  Badge,
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden grid-pattern">
          {/* Gradient orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">
                Dependency Risk Intelligence
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Find Abandoned Dependencies{' '}
              <span className="gradient-text">Before They Break Your Build</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Paste your <code className="text-primary-400 bg-primary-600/10 px-1.5 py-0.5 rounded text-base">package.json</code>,{' '}
              <code className="text-primary-400 bg-primary-600/10 px-1.5 py-0.5 rounded text-base">requirements.txt</code>, or{' '}
              <code className="text-primary-400 bg-primary-600/10 px-1.5 py-0.5 rounded text-base">Gemfile</code>.
              Get an instant risk score, maintenance signals, and replacement suggestions for every dependency.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/scanner"
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary-600/25 flex items-center gap-2"
              >
                Scan Your Dependencies
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={config.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-surface-700 hover:border-surface-500 text-surface-300 hover:text-surface-100 px-8 py-3.5 rounded-xl text-base font-medium transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-surface-500 text-sm">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>100% Client-Side</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>No Data Sent to Servers</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>npm, PyPI, RubyGems &amp; More</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="py-16 border-y border-surface-800 bg-surface-900/50">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-surface-100">5+</div>
              <div className="text-sm text-surface-400 mt-1">Ecosystems Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-surface-100">100%</div>
              <div className="text-sm text-surface-400 mt-1">Client-Side Processing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-surface-100">5</div>
              <div className="text-sm text-surface-400 mt-1">Risk Factors Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-surface-100">Free</div>
              <div className="text-sm text-surface-400 mt-1">To Get Started</div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Three Steps to <span className="gradient-text">Safer Dependencies</span>
              </h2>
              <p className="text-surface-400 text-lg max-w-2xl mx-auto">
                No sign-up required. No data leaves your browser. Just paste and scan.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  icon: FileJson,
                  title: 'Paste Your Dependencies',
                  desc: 'Drop your package.json, requirements.txt, Gemfile, go.mod, or Cargo.toml content into the scanner.',
                },
                {
                  step: '02',
                  icon: Search,
                  title: 'Automated Analysis',
                  desc: 'We check release freshness, maintainer count, repository status, issue backlogs, and licensing across public registries.',
                },
                {
                  step: '03',
                  icon: BarChart3,
                  title: 'Get Your Risk Report',
                  desc: 'View a prioritized dashboard with risk scores, detailed factors, and actionable replacement suggestions.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative bg-surface-900/50 border border-surface-800 rounded-2xl p-8 hover:border-primary-500/30 transition-colors"
                >
                  <span className="text-5xl font-black text-surface-800 absolute top-4 right-6">
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

        {/* Features */}
        <section id="features" className="py-24 px-4 bg-surface-900/30 border-y border-surface-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything You Need to <span className="gradient-text">Audit Your Stack</span>
              </h2>
              <p className="text-surface-400 text-lg max-w-2xl mx-auto">
                Purpose-built for developers and engineering teams who refuse to gamble on dead dependencies.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: AlertTriangle,
                  title: 'Deadware Risk Score',
                  desc: 'Every package gets a 0-100 risk score based on release freshness, bus factor, repository status, and more.',
                  color: 'text-red-400',
                },
                {
                  icon: GitBranch,
                  title: 'Bus Factor Analysis',
                  desc: 'Identify packages with a single maintainer — the #1 predictor of future abandonment.',
                  color: 'text-amber-400',
                },
                {
                  icon: Package,
                  title: 'Multi-Ecosystem',
                  desc: 'Supports npm, PyPI, RubyGems, Go modules, and Cargo. Paste any dependency file.',
                  color: 'text-blue-400',
                },
                {
                  icon: CheckCircle2,
                  title: 'Replacement Suggestions',
                  desc: 'Get curated, actively-maintained alternatives for every risky package in your stack.',
                  color: 'text-green-400',
                },
                {
                  icon: Download,
                  title: 'PDF & JSON Export',
                  desc: 'Export your risk report as PDF for management or JSON for integration into your CI pipeline.',
                  color: 'text-purple-400',
                },
                {
                  icon: Lock,
                  title: 'Privacy-First (BYOK)',
                  desc: 'All analysis runs in your browser. Optionally bring your own GitHub token for richer data. Nothing leaves your machine.',
                  color: 'text-teal-400',
                },
                {
                  icon: Badge,
                  title: 'CI Health Badge',
                  desc: 'Embed a shields.io badge in your README showing your dependency health score.',
                  color: 'text-indigo-400',
                },
                {
                  icon: BarChart3,
                  title: 'Risk Dashboard',
                  desc: 'Visual breakdown of your entire dependency tree — critical, high, medium, low, and healthy at a glance.',
                  color: 'text-orange-400',
                },
                {
                  icon: Zap,
                  title: 'Instant Results',
                  desc: 'No queues, no waiting. Scans complete in seconds with parallel registry lookups.',
                  color: 'text-yellow-400',
                },
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

        {/* CTA + Support */}
        <section className="py-24 px-4 bg-surface-900/30 border-t border-surface-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Secure Your Dependencies?
            </h2>
            <p className="text-surface-400 text-lg mb-8 max-w-xl mx-auto">
              Don&apos;t wait for a dead dependency to take down your production. Start scanning for free today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/scanner"
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary-600/25 flex items-center gap-2"
              >
                Start Free Scan
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-col items-center gap-3 pt-8 border-t border-surface-800">
              <p className="text-surface-500 text-sm">
                Built and maintained by{' '}
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
                Support this project — Buy Me a Coffee
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
                  Star on GitHub
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
