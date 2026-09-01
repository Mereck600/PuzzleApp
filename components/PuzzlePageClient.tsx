'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CUSTOM_PUZZLE_ID, findBasePuzzle } from '@/lib/puzzles';
import { withBasePath } from '@/lib/paths';
import { resolvePuzzleImage } from '@/lib/resolveImage';
import { getCustomImage, clearCustomImage } from '@/lib/storage';
import PuzzleGrid from '@/components/PuzzleGrid';
import UploadPuzzle from '@/components/UploadPuzzle';

export default function PuzzlePageClient({ slug }: { slug: string }) {
  const isCustom = slug === CUSTOM_PUZZLE_ID;
  const base = !isCustom ? findBasePuzzle(slug) : undefined;

  const [customImage, setCustomImageState] = useState<string | null>(null);
  const [baseImage, setBaseImageState] = useState<string | null>(null);
  const [baseMissing, setBaseMissing] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isCustom) {
      setCustomImageState(getCustomImage());
      setReady(true);
      return;
    }
    if (base) {
      let cancelled = false;
      resolvePuzzleImage(withBasePath(`/puzzles/${base.id}`)).then((src) => {
        if (cancelled) return;
        if (src) setBaseImageState(src);
        else setBaseMissing(true);
        setReady(true);
      });
      return () => {
        cancelled = true;
      };
    }
    setReady(true);
  }, [isCustom, base]);

  const title = isCustom ? 'Your puzzle' : base?.title;
  const imageSrc = isCustom ? customImage : baseImage;

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 pt-6">
        <Link href="/" className="text-sm text-white/60 hover:text-white">
          ← All puzzles
        </Link>
        {title && <h1 className="text-lg font-medium">{title}</h1>}
        <span className="w-16" />
      </div>

      {!ready ? null : !base && !isCustom ? (
        <p className="px-6 py-16 text-center text-white/60">Puzzle not found.</p>
      ) : baseMissing ? (
        <p className="px-6 py-16 text-center text-white/60">
          No photo found for this puzzle yet. Add <code>{slug}.jpg</code>, <code>{slug}.jpeg</code>, or{' '}
          <code>{slug}.png</code> to <code>public/puzzles/</code>.
        </p>
      ) : isCustom && !imageSrc ? (
        <UploadPuzzle onReady={(dataUrl) => setCustomImageState(dataUrl)} />
      ) : imageSrc ? (
        <>
          <PuzzleGrid key={imageSrc} puzzleId={slug} imageSrc={imageSrc} />
          {isCustom && (
            <div className="pb-10 text-center">
              <button
                onClick={() => {
                  clearCustomImage();
                  setCustomImageState(null);
                }}
                className="text-sm text-white/50 underline hover:text-white/80"
              >
                Use a different photo
              </button>
            </div>
          )}
        </>
      ) : null}
    </main>
  );
}
