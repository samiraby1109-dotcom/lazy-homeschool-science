import type { Metadata } from 'next';
import './globals.css';
import { AppConfig } from '@/lib/config';
import { InstallPrompt } from '@/components/install-prompt';

export const metadata: Metadata = {
  title: AppConfig.name,
  description:
    'Secular, evidence-based homeschool science units for curious kids ages 5–7.',
  applicationName: AppConfig.name,
  manifest: '/manifest.json',
  themeColor: '#f87575',
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: AppConfig.name
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-sand">
          {children}
          <InstallPrompt />
        </div>
      </body>
    </html>
  );
}
