# Deadware Risk Scanner

**Stop depending on dead code.** Scan your dependency files for abandoned, unmaintained, and risky open-source packages before they break your production build.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Why Deadware Risk Scanner?

Every project depends on open-source packages. But what happens when a maintainer walks away? When the last commit was 3 years ago? When there's one person holding the keys to a package your entire stack relies on?

**Deadware Risk Scanner answers these questions in seconds:**

- **Instant Risk Scores** - Every package gets a 0-100 risk score based on 5 real signals: release freshness, bus factor, repository status, issue backlog, and licensing.
- **Bus Factor Analysis** - Identify packages with a single maintainer — the #1 predictor of future abandonment.
- **Replacement Suggestions** - Get curated, actively-maintained alternatives for every risky dependency.
- **Multi-Ecosystem** - Supports `package.json` (npm), `requirements.txt` (PyPI), `Gemfile` (RubyGems), `go.mod` (Go), and `Cargo.toml` (Rust).
- **100% Client-Side** - All analysis runs in your browser. Your code never leaves your machine. No backend, no data collection, no tracking.
- **PDF & JSON Export** - Generate printable reports for your team or machine-readable JSON for CI pipelines.
- **CI Health Badge** - Embed a shields.io badge in your README showing your dependency health score.

---

## How to Use

1. **Go to the website** and click **"Scan Your Dependencies"**
2. **Paste** the contents of your dependency file (`package.json`, `requirements.txt`, `Gemfile`, `go.mod`, or `Cargo.toml`)
3. **Click "Scan Dependencies"** and wait a few seconds
4. **Review your risk report** — packages are ranked by risk score with detailed breakdowns
5. **Export** your report as PDF or JSON, or copy a CI badge for your README

That's it. No sign-up, no API keys required for basic scans.

### Optional: GitHub Enrichment (BYOK)

For richer analysis (repository archived status, open issue counts, security policy detection), you can provide your own GitHub Personal Access Token in the Settings panel. Your token is stored only in your browser's local storage and is never sent to any server other than GitHub's API.

---

## Self-Hosting / Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/justAbdulaziz10/Deadware-Risk-Scanner.git
cd Deadware-Risk-Scanner

# Install dependencies
npm install

# Copy the env template and configure your values
cp .env.example .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This generates a fully static site in the `out/` directory that can be deployed anywhere (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.).

### Environment Variables

All configuration lives in `.env.local`. See the [Environment Variables](#environment-variables-reference) section below for details on each variable.

---

## Deployment on Vercel

1. Push your repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add your environment variables in **Settings > Environment Variables**
4. Deploy — Vercel auto-detects Next.js and static export

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Your deployed site URL (e.g. `https://deadware-risk-scanner.vercel.app`) |
| `NEXT_PUBLIC_STRIPE_LINK_PRO` | No | Stripe Payment Link URL for the Pro plan |
| `NEXT_PUBLIC_STRIPE_LINK_TEAM` | No | Stripe Payment Link URL for the Team plan |
| `NEXT_PUBLIC_AUTHOR_NAME` | No | Your display name shown in the footer and metadata |
| `NEXT_PUBLIC_GITHUB_URL` | No | Your GitHub profile URL |
| `NEXT_PUBLIC_GITHUB_REPO` | No | This project's GitHub repository URL |
| `NEXT_PUBLIC_BUYMEACOFFEE_URL` | No | Your Buy Me a Coffee page URL |

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, static export)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Payments**: [Stripe Payment Links](https://stripe.com/payments/payment-links) (no backend needed)
- **Deployment**: Vercel (or any static host)

---

## Project Structure

```
src/
  app/
    page.tsx            # Landing page
    scanner/
      page.tsx          # Scanner page (metadata)
      ScannerClient.tsx # Scanner UI (client component)
    success/
      page.tsx          # Post-payment success page
    layout.tsx          # Root layout with SEO metadata
    globals.css         # Tailwind v4 theme + animations
    robots.ts           # robots.txt generation
    sitemap.ts          # sitemap.xml generation
  components/
    Navbar.tsx          # Navigation bar
    Footer.tsx          # Footer with links
    PackageCard.tsx     # Expandable package risk card
    HealthGauge.tsx     # Circular health score gauge
    ScanSummaryCard.tsx # Summary stats row
    RiskBadge.tsx       # Risk level badge
    ExportPanel.tsx     # Export/share controls
    SettingsPanel.tsx   # BYOK token settings
    PricingSection.tsx  # Pricing tiers
  lib/
    config.ts           # Centralized env config
    parsers.ts          # Dependency file parsers
    analyzer.ts         # Risk scoring engine
    storage.ts          # localStorage wrappers
    export.ts           # PDF/JSON export + CI badge
  types/
    index.ts            # TypeScript type definitions
```

---

## Pricing

| | Free | Pro ($9/mo) | Team ($29/mo) |
|---|---|---|---|
| Scans per month | 5 | Unlimited | Unlimited |
| Ecosystems | npm, PyPI | All 5+ | All 5+ |
| Risk dashboard | Yes | Yes | Yes |
| PDF & JSON export | - | Yes | Yes |
| CI health badge | - | Yes | Yes |
| Scan history | - | 50 reports | 50 reports |
| GitHub enrichment | - | Yes | Yes |
| Team members | 1 | 1 | Up to 10 |
| Webhooks | - | - | Yes |
| Custom thresholds | - | - | Yes |

---

## Support the Project

If Deadware Risk Scanner saved you from a bad dependency or helped your team ship safer code, consider supporting the project:

**[Buy Me a Coffee](https://buymeacoffee.com/justAbdulaziz10)**

Every coffee helps keep this project maintained and free for the community. Thank you!

You can also support by:
- Starring the repo on GitHub
- Sharing it with your team
- Reporting bugs or suggesting features via [GitHub Issues](https://github.com/justAbdulaziz10/Deadware-Risk-Scanner/issues)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Built with care by [justAbdulaziz10](https://github.com/justAbdulaziz10)
