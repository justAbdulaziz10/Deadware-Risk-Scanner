// ---- Centralized Configuration ----
// All values read from environment variables (NEXT_PUBLIC_ prefix).
// Set these in .env.local or your Vercel project settings.
// See .env.example for documentation.

export const config = {
  // Site
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://deadware-risk-scanner.vercel.app',

  // Polar.sh Product IDs (for checkout links)
  polar: {
    proProductId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PRO || '',
    teamProductId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_TEAM || '',
  },

  // Pricing
  pricing: {
    proPrice: process.env.NEXT_PUBLIC_PRO_PRICE || '9',
    teamPrice: process.env.NEXT_PUBLIC_TEAM_PRICE || '29',
  },

  // Branding
  authorName: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'justAbdulaziz10',
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/justAbdulaziz10',
  githubRepo: process.env.NEXT_PUBLIC_GITHUB_REPO || 'https://github.com/justAbdulaziz10/Deadware-Risk-Scanner',
  buyMeACoffeeUrl: process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL || 'https://buymeacoffee.com/justAbdulaziz10',
} as const;

// Helpers
export function isPolarConfigured(): boolean {
  return config.polar.proProductId.length > 0 && config.polar.teamProductId.length > 0;
}

export function getCheckoutUrl(plan: 'pro' | 'team'): string {
  const productId = plan === 'pro' ? config.polar.proProductId : config.polar.teamProductId;
  return `/api/checkout?products=${productId}`;
}
