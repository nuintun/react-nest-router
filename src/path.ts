/**
 * @module path
 */

import { startsWith, suffix } from './utils';

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
export function normalize(path: string) {
  const segments: string[] = [];
  const parts = path.replace(/\\+|\/{2,}/, '/').split('/');

  for (const segment of parts) {
    switch (segment) {
      case '.':
        break;
      case '..':
        const { length } = segments;

        if (length && segments[length - 1] !== '..') {
          segments.pop();
        }
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

  if (isAbsolute(to)) {
    return normalize(to);
  }

  return normalize(from + '/' + to);
}

/**
 * @function isAboveRoot
 * @description Is the path above root.
 * @param root The root path.
 * @param path The path to check.
 * @param sensitive Is case sensitive.
 */
export function isAboveRoot(root: string, path: string, sensitive?: boolean): boolean {
  root = normalize(suffix(root, '/'));
  path = normalize(path);

  if (!sensitive) {
    root = root.toLowerCase();
    path = path.toLowerCase();
  }

  return !startsWith(path, root);
}
