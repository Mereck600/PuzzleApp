# Puzzle App

A little private jigsaw-puzzle game built with Next.js, deployed as a static
site to GitHub Pages.

- **Passcode lock** on the landing page (iPhone-style keypad) gates the rest
  of the site. This is a *client-side* gate only — GitHub Pages can't keep a
  real server secret, so treat it as a "keep casual visitors out" measure,
  not real security. See [`lib/auth.ts`](lib/auth.ts) to change the code.
- **Three base puzzles** made from your own photos — drop them into
  [`public/puzzles/`](public/puzzles/README.md).
- **Upload your own photo** to generate a puzzle on the fly. The photo is
  resized and stored only in your browser (`localStorage`) — nothing is
  uploaded to a server, so it's private to that browser and won't sync
  across devices.
- **Selectable grid size** (3×3 up to 6×6) per puzzle.
- **Timer** with a per-puzzle/per-grid-size best time, saved locally.
- Pieces are always locked to grid cells — you swap two pieces by
  tap/click or drag-and-drop, so there's never any free-floating overlap.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000. (Locally there's no `basePath`, so images load
from plain `/puzzles/...` paths.)

## Changing the passcode

```bash
node -e "const c=require('crypto');console.log(c.createHash('sha256').update('NEWCODE').digest('hex'))"
```

Paste the printed hash into `CODE_HASH` in [`lib/auth.ts`](lib/auth.ts), and
update `CODE_LENGTH` if your new code isn't 4 digits.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings → **Pages**, set the source to **GitHub Actions**.
3. Push to `main` — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
   builds the static export and deploys it automatically.

The workflow sets `NEXT_PUBLIC_BASE_PATH` to `/<repo-name>` so assets resolve
correctly under `https://<username>.github.io/<repo-name>/`. If you rename
the repo to `<username>.github.io` (a user/organization root site), edit the
workflow and set `NEXT_PUBLIC_BASE_PATH` to an empty string instead.

## Notes & limitations

- Because this is a fully static site, uploaded custom puzzles live only in
  that one browser's `localStorage` — they won't appear on other devices and
  will be lost if that browser's site data is cleared.
- Drag-and-drop piece swapping uses the HTML5 Drag and Drop API, which works
  well with a mouse but isn't reliable on touch devices — tap-to-select,
  tap-to-swap works everywhere as the primary interaction.
