'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Shield, Mail, Lock, Loader2, AlertTriangle, CheckCircle2, Github } from 'lucide-react';
import { useT } from '@/components/I18nProvider';

export default function SignupForm() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ghLoading, setGhLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError(t.settings_auth_error);
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleGithubSignup() {
    const supabase = createClient();
    if (!supabase) {
      setError(t.settings_auth_error);
      return;
    }
    setGhLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'read:user repo',
      },
    });

    if (error) {
      setError(error.message);
      setGhLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t.signup_check_email}</h1>
        <p className="text-surface-400 mb-6">
          {t.signup_confirm_sent} <strong className="text-surface-200">{email}</strong>.{' '}
          {t.signup_activate}
        </p>
        <Link
          href="/login"
          className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
        >
          {t.signup_back_login}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Shield className="w-10 h-10 text-primary-500 mx-auto mb-3" />
        <h1 className="text-2xl font-bold">{t.signup_title}</h1>
        <p className="text-surface-400 text-sm mt-1">
          {t.signup_subtitle}
        </p>
      </div>

      <form onSubmit={handleSignup} className="bg-surface-900/50 border border-surface-800 rounded-2xl p-8 space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-sm text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">{t.signup_email}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t.signup_email_placeholder}
              className="w-full bg-surface-800 border border-surface-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">{t.signup_password}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder={t.signup_password_placeholder}
              className="w-full bg-surface-800 border border-surface-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-surface-700 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? t.signup_loading : t.signup_button}
        </button>

        <div className="relative flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-surface-700" />
          <span className="text-xs text-surface-500">{t.signup_or}</span>
          <div className="flex-1 h-px bg-surface-700" />
        </div>

        <button
          type="button"
          onClick={handleGithubSignup}
          disabled={ghLoading}
          className="w-full bg-surface-800 hover:bg-surface-700 disabled:bg-surface-700 disabled:cursor-not-allowed text-surface-200 border border-surface-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {ghLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-5 h-5" />}
          {ghLoading ? t.signup_github_loading : t.signup_github}
        </button>

        <p className="text-center text-sm text-surface-500">
          {t.signup_has_account}{' '}
          <Link href="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
            {t.nav_login}
          </Link>
        </p>
      </form>
    </div>
  );
}
