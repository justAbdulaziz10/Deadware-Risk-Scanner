// ---- Stripe Payment Links Configuration ----
//
// HOW TO SET UP:
// 1. Go to https://dashboard.stripe.com/payment-links
// 2. Create a Payment Link for each plan:
//    - Pro ($9/month recurring)
//    - Team ($29/month recurring)
// 3. For each Payment Link, set the "After payment" redirect to:
//    - Pro:  https://deadware-risk-scanner.vercel.app/success?plan=pro
//    - Team: https://deadware-risk-scanner.vercel.app/success?plan=team
// 4. Copy the Payment Link URLs and paste them below
//
// The URLs look like: https://buy.stripe.com/xxxxxxxxxxxx

export const STRIPE_LINKS = {
  // Replace these with your actual Stripe Payment Link URLs
  pro: 'https://buy.stripe.com/YOUR_PRO_PAYMENT_LINK_HERE',
  team: 'https://buy.stripe.com/YOUR_TEAM_PAYMENT_LINK_HERE',
} as const;

// Success redirect URL (where Stripe sends users after payment)
export const SUCCESS_URL = 'https://deadware-risk-scanner.vercel.app/success';

// Check if Stripe links are configured (not placeholder)
export function isStripeConfigured(): boolean {
  return (
    !STRIPE_LINKS.pro.includes('YOUR_') &&
    !STRIPE_LINKS.team.includes('YOUR_')
  );
}

export function getStripeLink(plan: 'pro' | 'team'): string {
  return STRIPE_LINKS[plan];
}
