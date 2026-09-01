// Client-side-only gate. GitHub Pages is static hosting, so there is no
// server to keep a real secret on — this only keeps casual visitors out,
// not a determined one who reads the shipped JS. Store a hash rather than
// the raw digits so the code isn't sitting in plain text in the bundle.
//
// To change the passcode: compute a new hash and replace CODE_HASH.
//   node -e "const c=require('crypto');console.log(c.createHash('sha256').update('NEWCODE').digest('hex'))"
export const CODE_LENGTH = 4;
const CODE_HASH = 'e39eef82f61b21e2e7f762fcc4307358f165757f2e77ec855d6992f7e0191932';

const UNLOCK_KEY = 'puzzleapp:unlocked';

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function checkCode(code: string): Promise<boolean> {
  if (code.length !== CODE_LENGTH) return false;
  const hash = await sha256Hex(code);
  return hash === CODE_HASH;
}

export function isUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

export function setUnlocked(): void {
  try {
    window.localStorage.setItem(UNLOCK_KEY, '1');
  } catch {
    // ignore (private browsing / storage disabled)
  }
}

export function lock(): void {
  try {
    window.localStorage.removeItem(UNLOCK_KEY);
  } catch {
    // ignore
  }
}
