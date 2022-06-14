/**
 * @module url
 */

import { Path } from './types';

/**
 * @function parse
 * @description Parse URL.
 * @param path URL path.
 */
export function parse(url: string): Path {
  const matched = url.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/i);

  if (matched) {
    const [, pathname, search = '', hash = ''] = matched;

    return { pathname, search, hash };
  }

  return { pathname: '', search: '', hash: '' };
}

/**
 * @function stringify
 * @description Stringify URL scheme.
 * @param scheme URL scheme.
 */
export function stringify({ pathname = '', search = '', hash = '' }: Partial<Path>): string {
  return origin + pathname + search + hash;
}
