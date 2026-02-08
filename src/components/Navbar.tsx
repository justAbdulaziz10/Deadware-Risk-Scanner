'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Menu, X, Github, LogOut } from 'lucide-react';
import { config } from '@/lib/config';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="w-7 h-7 text-primary-500 group-hover:text-primary-400 transition-colors" />
            <span className="font-bold text-lg tracking-tight">
              <span className="text-surface-100">Deadware</span>
              <span className="text-primary-500">Scanner</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
              Pricing
            </Link>
            <Link href="/#how-it-works" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
              How It Works
            </Link>
            <a
              href={config.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-surface-400 hover:text-surface-100 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/scanner"
                  className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Scanner
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-surface-400 hover:text-surface-100 transition-colors p-2"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-surface-400 hover:text-surface-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-surface-800 mt-2 pt-4 flex flex-col gap-3 animate-fade-in">
            <Link href="/#features" className="text-sm text-surface-400 hover:text-surface-100 transition-colors" onClick={() => setMobileOpen(false)}>
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-surface-400 hover:text-surface-100 transition-colors" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
            <Link href="/#how-it-works" className="text-sm text-surface-400 hover:text-surface-100 transition-colors" onClick={() => setMobileOpen(false)}>
              How It Works
            </Link>
            {user ? (
              <>
                <Link href="/scanner" className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors" onClick={() => setMobileOpen(false)}>
                  Scanner
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-sm text-surface-400 hover:text-surface-100 transition-colors text-left">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-surface-400 hover:text-surface-100 transition-colors" onClick={() => setMobileOpen(false)}>
                  Log In
                </Link>
                <Link href="/signup" className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors" onClick={() => setMobileOpen(false)}>
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
