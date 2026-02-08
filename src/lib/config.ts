// ---- Centralized Configuration ----
// All values read from environment variables (NEXT_PUBLIC_ prefix).
// Set these in .env.local or your Vercel project settings.
// See .env.example for documentation.

export const config = {
  // Site
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://deadware-risk-scanner.vercel.app',

  // Stripe Payment Links
  stripe: {
    proLink: process.env.NEXT_PUBLIC_STRIPE_LINK_PRO || '',
    teamLink: process.env.NEXT_PUBLIC_STRIPE_LINK_TEAM || '',
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
export function isStripeConfigured(): boolean {
  return config.stripe.proLink.length > 0 && config.stripe.teamLink.length > 0;
}

export function getStripeLink(plan: 'pro' | 'team'): string {
  return plan === 'pro' ? config.stripe.proLink : config.stripe.teamLink;
}
