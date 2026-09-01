'use client';

import { useCallback, useRef, useState } from 'react';
import { setCustomImage } from '@/lib/storage';

const MAX_DIMENSION = 1000;

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not read that image.'));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported.'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function UploadPuzzle({ onReady }: { onReady: (dataUrl: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await resizeToDataUrl(file);
      const ok = setCustomImage(dataUrl);
      if (!ok) {
        setError('That image was too large to store in this browser. Try a smaller photo.');
        setBusy(false);
        return;
      }
      onReady(dataUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong reading that image.');
    } finally {
      setBusy(false);
    }
  }, [onReady]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-16 text-center">
      <span className="text-5xl">📷</span>
      <h2 className="text-xl font-medium">Upload a photo</h2>
      <p className="text-sm text-white/60">
        Pick a photo from your device and it becomes a puzzle. It's stored only in this browser —
        nothing is uploaded anywhere.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded-full bg-white px-6 py-2 font-medium text-black transition hover:bg-white/90 disabled:opacity-50"
      >
        {busy ? 'Processing…' : 'Choose photo'}
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
