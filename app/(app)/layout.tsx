import Link from 'next/link';
import { AppConfig } from '@/lib/config';

const navItems = [
  { href: '/home', label: 'Home' },
  { href: '/topic', label: 'Topics' },
  { href: '/unit', label: 'Current Unit' },
  { href: '/history', label: 'History' },
  { href: '/settings', label: 'Settings' }
];

export default function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-sand/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/home" className="text-sm font-semibold text-ink">
            {AppConfig.name}
          </Link>
          <nav className="hidden gap-4 text-xs text-slate md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
      <nav className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-canvas px-4 py-2 text-xs shadow-lg md:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="px-2">
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
