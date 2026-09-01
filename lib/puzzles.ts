export type PuzzleDef = {
  id: string;
  title: string;
};

// Drop your own photos into public/puzzles/ named "<id>.jpg", "<id>.jpeg",
// or "<id>.png" (see public/puzzles/README.md), or change the ids/titles
// here. The extension is auto-detected, so .jpg/.jpeg/.png all work.
export const BASE_PUZZLES: PuzzleDef[] = [
  { id: 'puzzle-1', title: 'Puzzle One' },
  { id: 'puzzle-2', title: 'Puzzle Two' },
  { id: 'puzzle-3', title: 'Puzzle Three' },
];

export const CUSTOM_PUZZLE_ID = 'custom';

export const ALL_SLUGS = [...BASE_PUZZLES.map((p) => p.id), CUSTOM_PUZZLE_ID];

export function findBasePuzzle(id: string): PuzzleDef | undefined {
  return BASE_PUZZLES.find((p) => p.id === id);
}

export const GRID_SIZES = [3, 4, 5, 6] as const;
export type GridSize = (typeof GRID_SIZES)[number];
