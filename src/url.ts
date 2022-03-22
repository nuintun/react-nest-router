/**
 * @module url
 */

import { isAbsolute, normalize, prefix } from './path';

export interface URLSchema {
  readonly hash: string;
  readonly origin: string;
  readonly search: string;
  readonly pathname: string;
}

/**
 * @function safelyDecodeURIComponent
 * @description Safely decode URI component.
 * @param value The value to decode.
 */
export function safelyDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * @function parseURL
 * @description Parse URL.
 * @param path URL path.
 */
export function parseURL(path: string): URLSchema {
  const matched = path.match(/^((?:[a-z0-9.+-]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/i);

  if (matched) {
    const [, origin = '', pathname, search = '', hash = ''] = matched;

    return { origin, pathname, search, hash };
  }

  return { origin: '', pathname: '', search: '', hash: '' };
}

/**
 * @function normalizeQuery
 * @description Normalize query.
 * @param query Query to normalize.
 * @param symbol Query symbol.
 */
export function normalizeQuery(query: string | undefined, symbol: string): string {
  return query && query !== symbol ? prefix(query, symbol) : '';
}

/**
 * @function resolveURL
 * @description Resolve URL.
 * @param from URL from.
 * @param to URL to.
 * @param basename URL basename.
 */
export function resolveURL(from: string, to: Partial<Omit<URLSchema, 'origin'>> = {}, basename: string = '/'): string {
  const { pathname } = to;

  const hash = normalizeQuery(to.hash, '#');
  const search = normalizeQuery(to.search, '?');

  const query = search + hash;

  if (!pathname) {
    return normalize(from) + query;
  }

  const path = normalize(pathname);

  if (path === '/') {
    return normalize(basename) + query;
  }

  if (isAbsolute(path)) {
    return normalize(basename + '/' + path) + query;
  }

  return normalize(from + '/' + path) + query;
}
