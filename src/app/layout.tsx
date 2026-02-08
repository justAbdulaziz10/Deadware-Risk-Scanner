import type { Metadata } from 'next';
import { config } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: 'Deadware Risk Scanner — Find Abandoned Dependencies Before They Break Your Build',
  description:
    'Scan your package.json, requirements.txt, or Gemfile for abandoned, unmaintained, and risky open-source packages. Get a risk score and actionable replacement suggestions. Free for developers.',
  keywords: [
    'deadware scanner',
    'dependency risk',
    'abandoned packages',
    'npm security',
    'pypi security',
    'open source risk',
    'package health check',
    'dependency audit',
    'unmaintained packages',
    'bus factor',
    'supply chain security',
    'software composition analysis',
    'SCA tool',
    'dependency checker',
    'package vulnerability scanner',
  ],
  authors: [{ name: config.authorName, url: config.githubUrl }],
  creator: config.authorName,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.siteUrl,
    siteName: 'Deadware Risk Scanner',
    title: 'Deadware Risk Scanner — Find Abandoned Dependencies',
    description:
      'Scan your dependencies for abandoned, unmaintained, and risky open-source packages. Get actionable replacement suggestions before deadware breaks your build.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Deadware Risk Scanner - Dependency Health Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deadware Risk Scanner',
    description: 'Find abandoned dependencies before they break your build.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Deadware Risk Scanner',
    description:
      'Scan your dependencies for abandoned, unmaintained, and risky open-source packages.',
    url: config.siteUrl,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        name: 'Free',
        description: 'Scan up to 5 dependency files per month',
      },
      {
        '@type': 'Offer',
        price: '9',
        priceCurrency: 'USD',
        name: 'Pro',
        description: 'Unlimited scans, PDF/JSON export, CI badge',
      },
    ],
    author: {
      '@type': 'Person',
      name: config.authorName,
      url: config.githubUrl,
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-surface-950 text-surface-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
