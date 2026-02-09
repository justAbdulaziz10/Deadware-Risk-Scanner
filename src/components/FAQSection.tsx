'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'What is "deadware" and why should I care?',
    a: 'Deadware refers to software dependencies that are no longer maintained — no updates, no security patches, no bug fixes. If you depend on deadware, you\'re exposed to unpatched vulnerabilities, compatibility issues, and potential supply chain attacks.',
  },
  {
    q: 'How does the risk scoring work?',
    a: 'Each package is scored from 0 (healthy) to 100 (critical risk) based on up to 7 factors: release freshness, bus factor (maintainer count), repository archived status, open issue backlog, license type, known CVE vulnerabilities, and deprecation status. The overall score is a weighted average of these factors.',
  },
  {
    q: 'Is my code or data sent to any server?',
    a: 'No. All analysis runs 100% in your browser. We only make read-only requests to public registries (npm, PyPI) and the OSV vulnerability database. Your dependency files never leave your machine.',
  },
  {
    q: 'What ecosystems are supported?',
    a: 'Currently we support npm (package.json), PyPI (requirements.txt), RubyGems (Gemfile), Go Modules (go.mod), and Cargo (Cargo.toml). More ecosystems are planned.',
  },
  {
    q: 'How does vulnerability scanning work?',
    a: 'We query the OSV.dev database (maintained by Google) for each package and version in your dependency file. OSV aggregates data from GitHub Advisories, npm advisories, PyPI advisories, and other sources to give you a comprehensive view of known security issues.',
  },
  {
    q: 'Do I need a GitHub token?',
    a: 'A GitHub token is optional but recommended. Without it, you get basic registry data. With a token (public_repo scope), you also get repository archived status, open issue counts, and security policy detection — making the risk assessment more accurate.',
  },
  {
    q: 'What does the "replacement suggestions" feature do?',
    a: 'When we detect a known abandoned or deprecated package, we suggest actively-maintained alternatives. For example, if you use "moment" for dates, we\'ll suggest "date-fns", "dayjs", or "luxon" as modern replacements.',
  },
  {
    q: 'Can I use this in my CI/CD pipeline?',
    a: 'Yes! Export your scan results as JSON and integrate them into your CI pipeline. You can also embed a health badge in your README using the CI Badge feature (Pro plan). Full CI/CD integration with GitHub Actions is on our roadmap.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 bg-surface-900/30 border-t border-surface-800">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-surface-400 text-lg">
            Everything you need to know about Deadware Risk Scanner.
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
                  className={`w-5 h-5 text-surface-500 shrink-0 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-sm text-surface-400 leading-relaxed animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
