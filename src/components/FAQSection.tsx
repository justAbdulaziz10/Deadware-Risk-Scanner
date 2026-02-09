'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'What is "deadware" and why should I care?',
    a: 'Deadware refers to software dependencies that are no longer maintained — no updates, no security patches, no bug fixes. If you depend on deadware, you\'re exposed to unpatched vulnerabilities, compatibility issues, and potential supply chain attacks. Studies show that over 20% of npm packages haven\'t been updated in 2+ years.',
  },
  {
    q: 'How does the risk scoring work?',
    a: 'Each package is scored from 0 (healthy) to 100 (critical risk) based on up to 7 weighted factors: release freshness (35%), bus factor/maintainer count (25%), repository archived status (20%), open issue backlog (10%), license type (10%), known CVE vulnerabilities (30%), and deprecation status (25%). The overall score is a weighted average of all available factors.',
  },
  {
    q: 'Is my code or data sent to any server?',
    a: 'No. All analysis runs 100% in your browser. We only make read-only requests to public registries (npm, PyPI) and the OSV vulnerability database. Your dependency files, source code, and tokens never leave your machine. This makes Deadware Risk Scanner the most privacy-friendly dependency scanner available.',
  },
  {
    q: 'What ecosystems and file formats are supported?',
    a: 'We support 5 ecosystems: npm (package.json, package-lock.json), PyPI (requirements.txt, Pipfile), RubyGems (Gemfile), Go Modules (go.mod), and Cargo/Rust (Cargo.toml). You can paste content, upload files, scan any public GitHub repo by URL, or connect your GitHub account to scan private repos.',
  },
  {
    q: 'How does CVE vulnerability scanning work?',
    a: 'We query the OSV.dev database (maintained by Google) for each package and version in your dependency file. OSV aggregates vulnerability data from GitHub Security Advisories, npm advisories, PyPI advisories, RustSec, and other sources. Each vulnerability is rated by severity (Critical, High, Moderate, Low) based on its CVSS score.',
  },
  {
    q: 'How is this different from Snyk, Dependabot, or Socket.dev?',
    a: 'Most security tools focus only on known CVEs. Deadware Risk Scanner goes further by detecting abandoned and unmaintained packages BEFORE they become a security risk. We analyze bus factor, release frequency, repository status, and deprecation — risks that CVE-only tools miss entirely. Plus, we\'re 100% client-side and free to use, with no signup required.',
  },
  {
    q: 'Do I need a GitHub token?',
    a: 'A GitHub token is optional but recommended. Without it, you get registry data and CVE scanning. With a token (public_repo scope), you also get repository archived status, open issue counts, security policy detection, and the ability to scan your private repositories — making the risk assessment significantly more accurate.',
  },
  {
    q: 'What does the "replacement suggestions" feature do?',
    a: 'We maintain a curated database of 50+ known abandoned or deprecated packages with actively-maintained alternatives. For example, if you use "moment" for dates, we suggest "date-fns", "dayjs", or "luxon". If you use "request" for HTTP, we suggest "undici", "node-fetch", or "axios". Each suggestion includes a link and reason.',
  },
  {
    q: 'Can I use this in my CI/CD pipeline?',
    a: 'Yes! Export your scan results as JSON and integrate them into your CI pipeline. You can also embed a shields.io health badge in your README using the CI Badge feature (Pro plan). We also provide CSV export for spreadsheet analysis. Full CI/CD GitHub Actions integration is on our roadmap.',
  },
  {
    q: 'Is Deadware Risk Scanner open source?',
    a: 'Yes! The entire codebase is open source and available on GitHub. You can inspect every line of code, contribute improvements, or self-host it. We believe security tools should be transparent and community-driven.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // FAQPage structured data for Google rich results
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <section id="faq" className="py-24 px-4 bg-surface-900/30 border-t border-surface-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-surface-400 text-lg">
            Everything you need to know about scanning your dependencies for risks.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="bg-surface-950/60 border border-surface-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-800/30 transition-colors"
              >
                <span className="text-sm sm:text-base font-medium text-surface-200 pr-4">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-surface-500 shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5 text-sm text-surface-400 leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
