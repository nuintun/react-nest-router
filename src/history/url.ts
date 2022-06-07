/**
 * @module url
 */

import { normalize } from './path';

export interface URLSchema {
  readonly hash: string;
  readonly origin: string;
  readonly search: string;
  readonly pathname: string;
}

/**
 * @function parse
 * @description Parse URL.
 * @param path URL path.
 */
export function parse(url: string): URLSchema {
  const matched = url.match(/^((?:[a-z0-9.+-]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/i);

  if (matched) {
    const [, origin = '', pathname, search = '', hash = ''] = matched;

    return { origin, pathname: normalize(pathname), search, hash };
  }

  return { origin: '', pathname: '', search: '', hash: '' };
}

/**
 * @function stringify
 * @description Stringify URL scheme.
 * @param scheme URL scheme.
 */
export function stringify({ origin, pathname, search, hash }: URLSchema): string {
  return origin + pathname + search + hash;
}
