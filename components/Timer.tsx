'use client';

import { useEffect, useRef, useState } from 'react';

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Timer({
  running,
  resetKey,
  onTick,
}: {
  running: boolean;
  /** Change this value to reset the timer back to 0 (e.g. a new shuffle). */
  resetKey: string | number;
  onTick?: (seconds: number) => void;
}) {
  const [seconds, setSeconds] = useState(0);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    setSeconds(0);
  }, [resetKey]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        onTickRef.current?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, resetKey]);

  return (
    <div className="rounded-full bg-white/10 px-4 py-1.5 font-mono text-lg tabular-nums">
      {formatTime(seconds)}
    </div>
  );
}
