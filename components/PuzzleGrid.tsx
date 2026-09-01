'use client';

import { useEffect, useMemo, useState } from 'react';
import Timer from '@/components/Timer';
import { getBestTime, setBestTime } from '@/lib/storage';
import { GRID_SIZES, GridSize } from '@/lib/puzzles';

function shuffledIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  let solved = true;
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    solved = arr.every((v, i) => v === i);
  } while (solved && n > 1);
  return arr;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PuzzleGrid({ puzzleId, imageSrc }: { puzzleId: string; imageSrc: string }) {
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [started, setStarted] = useState(false);
  const [tiles, setTiles] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [showNumbers, setShowNumbers] = useState(false);
  const [bestTime, setBestTimeState] = useState<number | null>(null);

  const total = gridSize * gridSize;

  useEffect(() => {
    setBestTimeState(getBestTime(puzzleId, gridSize));
  }, [puzzleId, gridSize]);

  function begin() {
    setTiles(shuffledIndices(total));
    setSelected(null);
    setSolved(false);
    setElapsed(0);
    setShuffleKey((k) => k + 1);
    setStarted(true);
  }

  function swap(a: number, b: number) {
    if (a === b || solved) return;
    setTiles((prev) => {
      const next = [...prev];
      [next[a], next[b]] = [next[b], next[a]];
      const isSolved = next.every((v, i) => v === i);
      if (isSolved) {
        setSolved(true);
        setBestTime(puzzleId, gridSize, elapsed);
        setBestTimeState((prevBest) => (prevBest === null || elapsed < prevBest ? elapsed : prevBest));
      }
      return next;
    });
  }

  function handleTileClick(index: number) {
    if (solved) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    swap(selected, index);
    setSelected(null);
  }

  const backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;

  function backgroundPositionFor(pieceIndex: number) {
    const col = pieceIndex % gridSize;
    const row = Math.floor(pieceIndex / gridSize);
    const denom = gridSize - 1 || 1;
    return `${(col / denom) * 100}% ${(row / denom) * 100}%`;
  }

  const gridSizePx = useMemo(() => `repeat(${gridSize}, minmax(0, 1fr))`, [gridSize]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm text-white/60">Grid size:</span>
        {GRID_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => {
              if (started && !solved) {
                if (!confirm('Change grid size and restart this puzzle?')) return;
              }
              setGridSize(size);
              setStarted(false);
            }}
            className={`rounded-full px-3 py-1 text-sm transition ${
              gridSize === size ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {size}×{size}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Timer running={started && !solved} resetKey={shuffleKey} onTick={setElapsed} />
        {bestTime !== null && (
          <span className="text-sm text-white/50">Best: {formatTime(bestTime)}</span>
        )}
        <label className="flex items-center gap-1 text-sm text-white/50">
          <input type="checkbox" checked={showNumbers} onChange={(e) => setShowNumbers(e.target.checked)} />
          hints
        </label>
      </div>

      {!started ? (
        <button
          onClick={begin}
          className="rounded-full bg-white px-6 py-2 font-medium text-black transition hover:bg-white/90"
        >
          Start puzzle
        </button>
      ) : (
        <>
          <div
            className="relative grid aspect-square w-full max-w-[560px] gap-[2px] overflow-hidden rounded-xl border border-white/10 bg-black/40"
            style={{ gridTemplateColumns: gridSizePx }}
          >
            {tiles.map((pieceIndex, slotIndex) => (
              <button
                key={slotIndex}
                draggable
                onDragStart={() => setDragIndex(slotIndex)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null) swap(dragIndex, slotIndex);
                  setDragIndex(null);
                }}
                onClick={() => handleTileClick(slotIndex)}
                className={`relative bg-cover transition ${
                  selected === slotIndex ? 'ring-4 ring-inset ring-yellow-300' : ''
                } ${solved ? 'ring-0' : 'hover:brightness-110'}`}
                style={{
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize,
                  backgroundPosition: backgroundPositionFor(pieceIndex),
                }}
                aria-label={`Piece ${pieceIndex + 1}, slot ${slotIndex + 1}`}
              >
                {showNumbers && (
                  <span className="absolute right-1 top-1 rounded bg-black/60 px-1 text-xs">
                    {pieceIndex + 1}
                  </span>
                )}
              </button>
            ))}
          </div>

          {solved && (
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-lg font-medium text-emerald-300">
                🎉 Solved in {formatTime(elapsed)}!
              </p>
              <button
                onClick={begin}
                className="rounded-full bg-white/10 px-5 py-2 text-sm transition hover:bg-white/20"
              >
                Play again
              </button>
            </div>
          )}

          {!solved && (
            <p className="text-center text-sm text-white/50">
              Tap a piece, then tap another to swap them — or drag one piece onto another.
            </p>
          )}
        </>
      )}
    </div>
  );
}
