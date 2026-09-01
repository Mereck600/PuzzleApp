'use client';

import { useEffect, useState } from 'react';
import { isUnlocked } from '@/lib/auth';
import Lock from '@/components/Lock';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlockedState] = useState(false);

  useEffect(() => {
    setUnlockedState(isUnlocked());
    setReady(true);
  }, []);

  if (!ready) {
    // Avoid flashing content before we've checked localStorage.
    return <div className="min-h-screen bg-[#0b0d19]" />;
  }

  if (!unlocked) {
    return <Lock onUnlock={() => setUnlockedState(true)} />;
  }

  return <>{children}</>;
}
