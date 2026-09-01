import { ALL_SLUGS } from '@/lib/puzzles';
import PuzzlePageClient from '@/components/PuzzlePageClient';

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export default function PuzzlePage({ params }: { params: { slug: string } }) {
  return <PuzzlePageClient slug={params.slug} />;
}
