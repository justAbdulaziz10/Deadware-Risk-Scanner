import type { Metadata } from 'next';
import ScannerClient from './ScannerClient';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Free Dependency Scanner | Scan npm, PyPI, Go, Cargo for CVEs & Abandoned Packages',
  description:
    'Free online tool to scan package.json, requirements.txt, Gemfile, go.mod, or Cargo.toml for CVE vulnerabilities, abandoned packages, and supply chain risks. No signup required. 100% client-side.',
  alternates: {
    canonical: `${config.siteUrl}/scanner`,
  },
  openGraph: {
    title: 'Free Dependency Scanner | CVE & Abandonment Detection',
    description:
      'Scan your npm, PyPI, RubyGems, Go, or Cargo dependencies for vulnerabilities, abandoned packages, and supply chain risks. Instant risk scores and replacement suggestions.',
    url: `${config.siteUrl}/scanner`,
  },
};

export default function ScannerPage() {
  return <ScannerClient />;
}
