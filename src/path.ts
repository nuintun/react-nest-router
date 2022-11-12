/**
 * @module path
 */

import { startsWith, suffix } from './utils';

/**
 * @function isWildcard
 * @description Check if the path is wildcard.
 * @param path The path to check.
 */
export function isWildcard(path: string): path is '*' | `${string}/*` {
  // Equal * or ends with /*.
  return /(?:^|\/)\*$/.test(path);
}

/**
 * @function isAbsolute
 * @description Check if the path is absolute.
 * @param path The path to check.
 */
export function isAbsolute(path: string): path is `${'\\' | '/'}${string}` {
  return /^[\\/]/.test(path);
}

/**
 * @function normalize
 * @description Normalize the path.
 * @param path The path to normalize.
 */
export function normalize(path: string): string {
  const segments: string[] = [];
  const parts = path.split(/[\\/]+/);

  for (const segment of parts) {
    switch (segment) {
      case '.':
        break;
      case '..':
        segments.pop();
        break;
      default:
        segments.push(segment);
        break;
    }
  }

  return segments.join('/') || '/';
}

/**
 * @function join
 * @description Join the path.
 * @param base The base path.
 * @param path The path to join.
 */
export function join(base: string, path: string): string {
  if (!base) {
    return normalize(path);
  }

  if (!path) {
    return normalize(base);
  }

  return normalize(base + '/' + path);
}

/**
 * @function resolve
 * @description Resolve the path.
 * @param from The path to start.
 * @param to The path to end.
 */
export function resolve(from: string, to?: string): string {
  if (!to) {
    return normalize(from);
  }

  if (!from || isAbsolute(to)) {
    return normalize(to);
  }

  return normalize(from + '/' + to);
}

/**
 * @function isOutsideRoot
 * @description Is the path outside root.
 * @param root The root path.
 * @param path The path to check.
 * @param sensitive Is case sensitive.
 */
export function isOutsideRoot(root: string, path: string, sensitive?: boolean): boolean {
  if (isAbsolute(path)) {
    root = normalize(suffix(root, '/'));
    path = normalize(path);

    if (!sensitive) {
      root = root.toLowerCase();
      path = path.toLowerCase();
    }

    return !startsWith(path, root);
  }

  return false;
}
