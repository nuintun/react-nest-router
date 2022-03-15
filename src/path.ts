/**
 * @module path
 */

/**
 * @function isAbsolute
 * @description Check if the path is absolute.
 * @param path The path to check.
 */
export function isAbsolute(path: string): boolean {
  return /^\//.test(path);
}

/**
 * @function normalize
 * @description Normalize the path.
 * @param path The path to normalize.
 */
export function normalize(path: string): string {
  const segments: string[] = [];
  const paths = path.replace(/\\+/, '/').split(/\/+/);

  for (const segment of paths) {
    if (segment === '..') {
      if (segments.length > 1 || segments[0]) {
        segments.pop();
      }
    } else if (segment !== '.') {
      segments.push(segment);
    }
  }

  return segments.join('/');
}

/**
 * @function resolve
 * @description Resolve the path.
 * @param from The path to start.
 * @param to The path to end.
 */
export function resolve(from: string, to?: string): string {
  if (!to) return normalize(from);

  if (isAbsolute(to)) return normalize(to);

  return normalize(`${from}/${to}`);
}

/**
 * @function prefix
 * @description Prefix the path with symbol.
 * @param path The path to prefix.
 * @param symbol Prefix symbol.
 */
export function prefix(path: string, symbol: string): string {
  return path.startsWith(symbol) ? path : `/${path}`;
}

/**
 * @function suffix
 * @description Suffix the path with symbol.
 * @param path The path to suffix.
 * @param symbol Suffix symbol.
 */
export function suffix(path: string, symbol: string): string {
  return path.endsWith(symbol) ? path : `${path}/`;
}
