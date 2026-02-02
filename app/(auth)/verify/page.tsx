import Link from 'next/link';

export default function VerifyPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4">
      <div className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Check your email</h1>
        <p className="mt-2 text-sm text-slate">
          Your magic link is on the way. Click it to finish signing in.
        </p>
        <Link href="/" className="mt-4 inline-block text-xs text-slate">
          ← Back to landing
        </Link>
      </div>
    </main>
  );
}
