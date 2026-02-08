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
- **Privacy First** - Dependency analysis runs in your browser. Your code never leaves your machine.
- **PDF & JSON Export** - Generate printable reports for your team or machine-readable JSON for CI pipelines.
- **CI Health Badge** - Embed a shields.io badge in your README showing your dependency health score.

---

## How to Use

1. **Sign up** for a free account
2. **Paste** the contents of your dependency file (`package.json`, `requirements.txt`, `Gemfile`, `go.mod`, or `Cargo.toml`)
3. **Click "Scan Dependencies"** and wait a few seconds
4. **Review your risk report** — packages are ranked by risk score with detailed breakdowns
5. **Export** your report as PDF or JSON, or copy a CI badge for your README

Free plan includes 5 scans per month. Upgrade for unlimited access.

### Optional: GitHub Enrichment (BYOK)

For richer analysis (repository archived status, open issue counts, security policy detection), you can provide your own GitHub Personal Access Token in the Settings panel. Your token is stored only in your browser's local storage and is never sent to any server other than GitHub's API.

---

## Self-Hosting / Development

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) project (free tier)
- A [Polar.sh](https://polar.sh) account (free — for payments)

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

### Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Paste the contents of `supabase/schema.sql` and run it
4. Copy your API keys from **Project Settings → API** into `.env.local`

### Build for Production

```bash
npm run build
npm start
```

---

## Deployment on Vercel

1. Push your repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add all environment variables in **Settings > Environment Variables**
4. Deploy — Vercel auto-detects Next.js

---

## Environment Variables Reference

### Required

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL (e.g. `https://deadware-risk-scanner.vercel.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → service_role key |

### Payments (Polar.sh)

| Variable | Where to get it |
|---|---|
| `POLAR_ACCESS_TOKEN` | [polar.sh/settings](https://polar.sh/settings) → Developers → Personal Access Tokens |
| `POLAR_WEBHOOK_SECRET` | Polar Dashboard → Settings → Webhooks → Add Endpoint → copy secret |
| `POLAR_PRODUCT_ID_TEAM` | Polar Dashboard → Products → Team product → copy ID |
| `POLAR_ENVIRONMENT` | `sandbox` for testing, `production` when live |
| `NEXT_PUBLIC_POLAR_PRODUCT_ID_PRO` | Polar Dashboard → Products → Pro product → copy ID |
| `NEXT_PUBLIC_POLAR_PRODUCT_ID_TEAM` | Polar Dashboard → Products → Team product → copy ID |

### UI & Branding

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_PRO_PRICE` | `9` | Pro plan price shown in the UI |
| `NEXT_PUBLIC_TEAM_PRICE` | `29` | Team plan price shown in the UI |
| `NEXT_PUBLIC_AUTHOR_NAME` | `justAbdulaziz10` | Display name in footer & metadata |
| `NEXT_PUBLIC_GITHUB_URL` | Your GitHub profile | GitHub profile link |
| `NEXT_PUBLIC_GITHUB_REPO` | This repo | "View on GitHub" link |
| `NEXT_PUBLIC_BUYMEACOFFEE_URL` | Your BMAC page | "Buy Me a Coffee" link |

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Auth & Database**: [Supabase](https://supabase.com/) (free tier)
- **Payments**: [Polar.sh](https://polar.sh/) (free — supports Saudi Arabia & 40+ countries)
- **Deployment**: [Vercel](https://vercel.com/) (free tier)

**Total cost to run: $0** — You only pay Polar's 4% fee when you make actual sales.

---

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    scanner/
      page.tsx            # Scanner metadata
      ScannerClient.tsx   # Scanner UI
    success/
      page.tsx            # Post-payment success
      SuccessClient.tsx   # Plan activation polling
    login/                # Login page
    signup/               # Signup page
    auth/callback/        # Supabase auth callback
    api/
      checkout/           # Polar checkout handler
      webhooks/polar/     # Polar webhook handler
    layout.tsx            # Root layout + SEO
    globals.css           # Theme + animations
  components/             # UI components
  lib/
    config.ts             # Centralized env config
    parsers.ts            # Dependency file parsers
    analyzer.ts           # Risk scoring engine
    storage.ts            # Supabase plans + localStorage
    export.ts             # PDF/JSON export + CI badge
    supabase/             # Supabase client/server/middleware
  types/
    index.ts              # TypeScript types
middleware.ts             # Next.js auth middleware
supabase/
  schema.sql              # Database schema (run once)
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
