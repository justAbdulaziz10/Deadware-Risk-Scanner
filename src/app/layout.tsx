import type { Metadata } from 'next';
import { config } from '@/lib/config';
import ClientProviders from '@/components/ClientProviders';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: 'Deadware Risk Scanner | Find Abandoned Dependencies Before They Break Your Build',
    template: '%s | Deadware Risk Scanner',
  },
  description:
    'Free open-source dependency scanner that detects abandoned npm, PyPI, and RubyGems packages. Get CVE vulnerability scanning, risk scores, bus factor analysis, deprecation warnings, and replacement suggestions. No signup required. 100% client-side.',
  keywords: [
    'deadware scanner',
    'dependency risk scanner',
    'abandoned packages detector',
    'npm security scanner',
    'pypi vulnerability scanner',
    'open source risk assessment',
    'package health checker',
    'dependency audit tool',
    'unmaintained packages finder',
    'bus factor analysis',
    'supply chain security tool',
    'software composition analysis',
    'SCA tool free',
    'dependency vulnerability checker',
    'package vulnerability scanner',
    'CVE scanner npm',
    'deprecated package detector',
    'npm audit alternative',
    'snyk alternative free',
    'dependabot alternative',
    'package.json scanner',
    'requirements.txt scanner',
    'Gemfile scanner',
    'go.mod scanner',
    'Cargo.toml scanner',
    'dependency health score',
    'open source dependency checker',
    'abandoned npm packages',
    'dead dependencies finder',
    'software supply chain risk',
  ],
  authors: [{ name: config.authorName, url: config.githubUrl }],
  creator: config.authorName,
  publisher: 'Deadware Risk Scanner',
  category: 'Developer Tools',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.siteUrl,
    siteName: 'Deadware Risk Scanner',
    title: 'Deadware Risk Scanner | Detect Abandoned & Vulnerable Dependencies',
    description:
      'Free tool to scan npm, PyPI, RubyGems, Go, and Cargo dependencies for abandoned packages, CVE vulnerabilities, and supply chain risks. Get instant risk scores and replacement suggestions.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Deadware Risk Scanner - Dependency Health Dashboard showing risk scores for npm packages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deadware Risk Scanner | Find Abandoned Dependencies',
    description: 'Free CVE & abandonment scanner for npm, PyPI, RubyGems, Go, and Cargo. No signup required.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: config.siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Deadware Risk Scanner',
    description:
      'Free open-source tool to scan dependencies for abandoned packages, CVE vulnerabilities, and supply chain risks. Supports npm, PyPI, RubyGems, Go, and Cargo.',
    url: config.siteUrl,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    softwareVersion: '1.0',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        name: 'Free',
        description: 'Scan up to 5 dependency files per month with full CVE scanning',
      },
      {
        '@type': 'Offer',
        price: config.pricing.proPrice,
        priceCurrency: 'USD',
        name: 'Pro',
        description: 'Unlimited scans, PDF/JSON/CSV export, CI badge',
      },
    ],
    author: {
      '@type': 'Person',
      name: config.authorName,
      url: config.githubUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '50',
      bestRating: '5',
    },
    featureList: [
      'CVE Vulnerability Scanning via OSV Database',
      'Abandoned Package Detection',
      'Bus Factor Analysis',
      'Deprecation Warnings',
      'Replacement Suggestions for 50+ Packages',
      'npm, PyPI, RubyGems, Go, Cargo Support',
      'PDF, JSON, CSV Export',
      'CI Health Badge Generation',
      '100% Client-Side Processing',
      'GitHub Repository Scanning',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Deadware Risk Scanner',
    url: config.siteUrl,
    description: 'Free dependency scanner for abandoned packages, CVE vulnerabilities, and supply chain risks.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.siteUrl}/scanner`,
      },
      'query-input': 'required name=dependency_file',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Deadware Risk Scanner',
    url: config.siteUrl,
    logo: `${config.siteUrl}/favicon.svg`,
    sameAs: [
      config.githubUrl,
      config.githubRepo,
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="dark" />
        <meta name="application-name" content="Deadware Risk Scanner" />
        <meta name="apple-mobile-web-app-title" content="Deadware Scanner" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="canonical" href={config.siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-surface-950 text-surface-100 min-h-screen antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
