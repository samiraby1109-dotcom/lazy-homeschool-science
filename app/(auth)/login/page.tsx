'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { AppConfig } from '@/lib/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');
  const [devLoginEnabled, setDevLoginEnabled] = useState(false);

  useEffect(() => {
    const loadDevFlag = async () => {
      const response = await fetch('/api/auth/dev-login');
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setDevLoginEnabled(Boolean(data.enabled));
    };
    loadDevFlag();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    await signIn('email', { email, callbackUrl: '/home' });
    setStatus('sent');
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4">
      <div className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-slate">
          Use a magic link to sign in to {AppConfig.name}.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-sm font-medium text-slate">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate/20 bg-sand px-4 py-3 text-sm"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-2xl bg-ink py-3 text-sm font-semibold text-canvas"
          >
            {status === 'loading' ? 'Sending link...' : 'Send magic link'}
          </button>
        </form>
        {devLoginEnabled && (
          <button
            type="button"
            onClick={() =>
              signIn('credentials', {
                callbackUrl: '/admin/control-panel'
              })
            }
            className="mt-3 w-full rounded-2xl border border-ink/20 py-3 text-sm font-semibold text-ink"
          >
            Dev Login (Admin)
          </button>
        )}
        <p className="mt-4 text-xs text-slate">
          By continuing you agree to our secular content standards and privacy
          policy.
        </p>
        <Link href="/" className="mt-4 inline-block text-xs text-slate">
          ← Back to landing
        </Link>
      </div>
    </main>
  );
}
