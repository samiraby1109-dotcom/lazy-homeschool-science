import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';

const navItems = [
  { href: '/admin/sources', label: 'Trusted Sources' },
  { href: '/admin/suggestions', label: 'Suggested Resources' },
  { href: '/admin', label: 'Topics' }
];

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate/10 bg-sand">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-sm font-semibold text-ink">Admin</h1>
          <nav className="flex flex-wrap gap-3 text-xs text-slate">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
