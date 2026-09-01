# Puzzle format

Drop three photos into this folder named:

- `puzzle-1.jpg` (or `.jpeg`, `.png` — any case, e.g. `.JPG`)
- `puzzle-2.jpg`
- `puzzle-3.jpg`

The extension is auto-detected at runtime, so `.jpg`, `.jpeg`, and `.png`
(in any case) all work without touching any code. If you want different
titles or filenames, edit [`lib/puzzles.ts`](../../lib/puzzles.ts).

Square-ish photos (close to 1:1) look best since the puzzle grid is always
square — non-square photos will get cropped to fit.
