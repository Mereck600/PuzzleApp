// GitHub Pages serves this app from /<repo-name>/, but plain string src=""
// attributes (unlike next/image or next/link) are not auto-prefixed by
// Next's basePath. NEXT_PUBLIC_BASE_PATH is inlined at build time (set by
// the GitHub Actions workflow), so use this helper for any hardcoded path
// into /public.
export function withBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!path.startsWith('/')) return `${basePath}/${path}`;
  return `${basePath}${path}`;
}
