const CUSTOM_IMAGE_KEY = 'puzzleapp:customImage';
const BEST_TIME_PREFIX = 'puzzleapp:best:';

export function getCustomImage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(CUSTOM_IMAGE_KEY);
  } catch {
    return null;
  }
}

export function setCustomImage(dataUrl: string): boolean {
  try {
    window.localStorage.setItem(CUSTOM_IMAGE_KEY, dataUrl);
    return true;
  } catch {
    // likely quota exceeded
    return false;
  }
}

export function clearCustomImage(): void {
  try {
    window.localStorage.removeItem(CUSTOM_IMAGE_KEY);
  } catch {
    // ignore
  }
}

function bestTimeKey(puzzleId: string, gridSize: number): string {
  return `${BEST_TIME_PREFIX}${puzzleId}:${gridSize}`;
}

export function getBestTime(puzzleId: string, gridSize: number): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(bestTimeKey(puzzleId, gridSize));
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export function setBestTime(puzzleId: string, gridSize: number, seconds: number): void {
  try {
    const key = bestTimeKey(puzzleId, gridSize);
    const current = getBestTime(puzzleId, gridSize);
    if (current === null || seconds < current) {
      window.localStorage.setItem(key, String(seconds));
    }
  } catch {
    // ignore
  }
}
