import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

const requiredEnv = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'ADMIN_EMAIL',
  'EMAIL_SERVER',
  'EMAIL_FROM'
];

const optionalEnv = [
  'ALLOW_DEV_LOGIN',
  'NEXT_PUBLIC_POSTHOG_KEY',
  'NEXT_PUBLIC_POSTHOG_HOST',
  'POSTHOG_SERVER_KEY',
  'POSTHOG_SERVER_HOST',
  'STRIPE_SECRET_KEY',
  'STRIPE_PRICE_ID',
  'OPENAI_API_KEY'
];

export default async function AdminControlPanelPage() {
  const session = await requireAdmin();

  let dbStatus = 'Unknown';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'Connected';
  } catch {
    dbStatus = 'Failed';
  }

  return (
    <main className="space-y-6">
      <header className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Control Panel</h1>
        <p className="text-sm text-slate">Admin status and environment health.</p>
      </header>

      <section className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Session</h2>
        <div className="mt-3 space-y-2 text-sm text-slate">
          <p>Email: {session.user?.email ?? 'Unknown'}</p>
          <p>isAdmin: {session.user?.isAdmin ? 'true' : 'false'}</p>
          <p>isPaid: {session.user?.isPaid ? 'true' : 'false'}</p>
        </div>
      </section>

      <section className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Environment health</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate">Required</p>
            <ul className="mt-2 space-y-1 text-sm text-slate">
              {requiredEnv.map((key) => (
                <li key={key}>
                  {key}: {process.env[key] ? 'Present' : 'Missing'}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate">Optional</p>
            <ul className="mt-2 space-y-1 text-sm text-slate">
              {optionalEnv.map((key) => (
                <li key={key}>
                  {key}: {process.env[key] ? 'Present' : 'Missing'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Database</h2>
        <p className="mt-2 text-sm text-slate">Connection: {dbStatus}</p>
      </section>
    </main>
  );
}
