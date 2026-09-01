// Base puzzle photos can be saved as .jpg, .jpeg, or .png (any case) — this
// tries each extension in turn (via the browser's own image loading, so no
// extra network round trips beyond the ones that actually 404) and resolves
// to whichever one exists. Case variants matter because GitHub Pages serves
// from a case-sensitive filesystem, unlike Windows/macOS.
const EXTENSIONS = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];

export { EXTENSIONS as PUZZLE_IMAGE_EXTENSIONS };

export function resolvePuzzleImage(basePathNoExt: string): Promise<string | null> {
  return new Promise((resolve) => {
    let i = 0;
    function tryNext() {
      if (i >= EXTENSIONS.length) {
        resolve(null);
        return;
      }
      const src = `${basePathNoExt}.${EXTENSIONS[i]}`;
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => {
        i += 1;
        tryNext();
      };
      img.src = src;
    }
    tryNext();
  });
}
