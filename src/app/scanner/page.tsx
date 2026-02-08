import type { Metadata } from 'next';
import ScannerClient from './ScannerClient';

export const metadata: Metadata = {
  title: 'Dependency Scanner — Deadware Risk Scanner',
  description:
    'Paste your package.json, requirements.txt, Gemfile, go.mod, or Cargo.toml to scan for abandoned and risky dependencies. Get instant risk scores and replacement suggestions.',
  alternates: {
    canonical: 'https://deadware-scanner.vercel.app/scanner',
  },
  openGraph: {
    title: 'Dependency Scanner — Deadware Risk Scanner',
    description:
      'Scan your dependencies for abandoned packages. Instant risk scores and replacement suggestions.',
    url: 'https://deadware-scanner.vercel.app/scanner',
  },
};

export default function ScannerPage() {
  return <ScannerClient />;
}
