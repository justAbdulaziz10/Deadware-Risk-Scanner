import { Shield, Github, Heart, Coffee } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-surface-800 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary-500" />
              <span className="font-bold text-lg">
                <span className="text-surface-100">Deadware</span>
                <span className="text-primary-500">Scanner</span>
              </span>
            </Link>
            <p className="text-surface-400 text-sm max-w-md mb-4">
              Stop depending on dead code. Scan your dependency files for abandoned,
              unmaintained, and risky open-source packages before they break your production build.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/justAbdulaziz10"
                target="_blank"
                rel="noopener noreferrer"
                className="text-surface-400 hover:text-surface-100 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://buymeacoffee.com/justAbdulaziz10"
                target="_blank"
                rel="noopener noreferrer"
                className="text-surface-400 hover:text-amber-400 transition-colors"
                aria-label="Buy Me a Coffee"
              >
                <Coffee className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/scanner" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
                  Scanner
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/justAbdulaziz10/Deadware-Risk-Scanner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-surface-400 hover:text-surface-100 transition-colors"
                >
                  Source Code
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/justAbdulaziz10/Deadware-Risk-Scanner/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-surface-400 hover:text-surface-100 transition-colors"
                >
                  Report a Bug
                </a>
              </li>
              <li>
                <a
                  href="https://buymeacoffee.com/justAbdulaziz10"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-surface-400 hover:text-surface-100 transition-colors"
                >
                  Buy Me a Coffee
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            &copy; {new Date().getFullYear()} Deadware Risk Scanner. Built by{' '}
            <a
              href="https://github.com/justAbdulaziz10"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              justAbdulaziz10
            </a>
          </p>
          <p className="text-sm text-surface-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for the open-source community
          </p>
        </div>
      </div>
    </footer>
  );
}
