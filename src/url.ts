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
export function normalizeQuery(query: string, symbol: string): string {
  return query !== '' && query !== symbol ? prefix(query, symbol) : '';
}

/**
 * @function resolveURL
 * @description Resolve URL.
 * @param from URL from.
 * @param to URL to.
 * @param basename URL basename.
 */
export function resolveURL(
  from: string,
  { pathname, search, hash }: Omit<URLSchema, 'origin'>,
  basename: string = '/'
): string {
  hash = normalizeQuery(hash, '#');
  search = normalizeQuery(search, '?');

  const to = normalize(pathname);
  const query = `${search}${hash}`;

  if (to === '') return `${from}${query}`;

  if (to === '/') return `${basename}${query}`;

  if (isAbsolute(to)) {
    return normalize(`${basename}/${to}${query}`);
  }

  return `${normalize(`${from}/${to}`)}${query}`;
}
