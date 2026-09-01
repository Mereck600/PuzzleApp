'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { withBasePath } from '@/lib/paths';
import { resolvePuzzleImage } from '@/lib/resolveImage';

export default function PuzzleCard({
  title,
  puzzleId,
  href,
}: {
  title: string;
  puzzleId: string;
  href: string;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    resolvePuzzleImage(withBasePath(`/puzzles/${puzzleId}`)).then((src) => {
      if (cancelled) return;
      if (src) setImageSrc(src);
      else setMissing(true);
    });
    return () => {
      cancelled = true;
    };
  }, [puzzleId]);

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/30 hover:bg-white/10"
    >
      <div
        className="flex aspect-square items-center justify-center bg-cover bg-center text-white/30"
        style={imageSrc ? { backgroundImage: `url(${imageSrc})` } : undefined}
      >
        {missing && <span className="text-sm">No photo yet</span>}
      </div>
      <div className="p-4">
        <span className="font-medium">{title}</span>
      </div>
    </Link>
  );
}
