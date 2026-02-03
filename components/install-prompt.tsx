'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!visible || !deferredPrompt) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setVisible(false);
  };

  return (
    <div className="fixed bottom-20 left-1/2 z-30 w-[90%] max-w-sm -translate-x-1/2 rounded-3xl bg-ink p-4 text-canvas shadow-lg">
      <p className="text-sm font-semibold">Add to Home Screen</p>
      <p className="text-xs text-canvas/80">
        Install for faster access and offline-friendly worksheets.
      </p>
      <button
        onClick={handleInstall}
        className="mt-3 w-full rounded-2xl bg-coral px-4 py-2 text-sm font-semibold text-ink"
      >
        Install
      </button>
    </div>
  );
}
