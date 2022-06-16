/**
 * @module url
 */

import { URL } from './types';
import { endsWith, prefix, startsWith } from '../utils';

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
 * @function parse
 * @description Parse URL.
 * @param path URL path.
 */
export function parse(url: string): URL {
  const matched = url.match(/^((?:[a-z0-9.+-]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/i);

  if (matched) {
    const [, origin = '', pathname, search = '', hash = ''] = matched;

    return { origin, pathname, search, hash };
  }

  return { origin: '', pathname: '', search: '', hash: '' };
}

/**
 * @function stringify
 * @description Stringify URL scheme.
 * @param scheme URL scheme.
 */
export function stringify({ origin = '', pathname = '', search = '', hash = '' }: Partial<URL>): string {
  const hasSlash = endsWith(origin, '/') || startsWith(pathname, '/');
  const query = normalizeQuery(search, '?') + normalizeQuery(hash, '#');

  return origin + (hasSlash ? '' : '/') + pathname + query;
}
