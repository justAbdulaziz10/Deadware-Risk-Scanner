import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://deadware-scanner.vercel.app'),
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
  authors: [{ name: 'justAbdulaziz10', url: 'https://github.com/justAbdulaziz10' }],
  creator: 'justAbdulaziz10',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://deadware-scanner.vercel.app',
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
    canonical: 'https://deadware-scanner.vercel.app',
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
    url: 'https://deadware-scanner.vercel.app',
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
      name: 'justAbdulaziz10',
      url: 'https://github.com/justAbdulaziz10',
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#0f172a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-surface-950 text-surface-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
