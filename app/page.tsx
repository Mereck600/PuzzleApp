import Link from 'next/link';
import { BASE_PUZZLES, CUSTOM_PUZZLE_ID } from '@/lib/puzzles';
import PuzzleCard from '@/components/PuzzleCard';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Pick a puzzle</h1>
        <p className="mt-2 text-white/60">
          Choose one of the puzzles below, or turn your own photo into one.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {BASE_PUZZLES.map((puzzle) => (
          <PuzzleCard key={puzzle.id} title={puzzle.title} puzzleId={puzzle.id} href={`/puzzle/${puzzle.id}/`} />
        ))}

        <Link
          href={`/puzzle/${CUSTOM_PUZZLE_ID}/`}
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-6 text-center transition hover:border-white/40 hover:bg-white/10"
        >
          <span className="text-4xl">📷</span>
          <span className="font-medium">Create your own</span>
          <span className="text-sm text-white/50">Upload a photo and turn it into a puzzle</span>
        </Link>
      </div>
    </main>
  );
}
