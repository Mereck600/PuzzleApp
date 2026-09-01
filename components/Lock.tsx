'use client';

import { useCallback, useState } from 'react';
import { CODE_LENGTH, checkCode, setUnlocked } from '@/lib/auth';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function Lock({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const submit = useCallback(async (candidate: string) => {
    setChecking(true);
    const ok = await checkCode(candidate);
    setChecking(false);
    if (ok) {
      setUnlocked();
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setCode('');
      }, 500);
    }
  }, [onUnlock]);

  const press = useCallback(
    (key: string) => {
      if (checking || error) return;
      if (key === 'del') {
        setCode((c) => c.slice(0, -1));
        return;
      }
      if (!key) return;
      setCode((c) => {
        if (c.length >= CODE_LENGTH) return c;
        const next = c + key;
        if (next.length === CODE_LENGTH) {
          void submit(next);
        }
        return next;
      });
    },
    [checking, error, submit],
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-6">
      <div className="text-center">
        <div className="mb-1 text-5xl">🔒</div>
        <h1 className="text-xl font-medium text-white/90">Enter Passcode</h1>
      </div>

      <div className={`flex gap-4 ${error ? 'animate-shake' : ''}`}>
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <span
            key={i}
            className={`h-4 w-4 rounded-full border border-white/50 transition ${
              i < code.length ? (error ? 'bg-red-400 border-red-400' : 'bg-white') : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {KEYS.map((key, i) =>
          key === '' ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              onClick={() => press(key)}
              disabled={checking}
              className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl transition active:scale-95 ${
                key === 'del'
                  ? 'text-lg text-white/70 hover:bg-white/10'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {key === 'del' ? '⌫' : key}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
