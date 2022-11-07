/**
 * @module url
 */

import { To } from './navigator';
import { isString } from './utils';
import { isAbsolute, normalize } from './path';
import { parse, stringify } from './navigator/url';

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
 * @function resolve
 * @description Resolve URL.
 * @param from URL from.
 * @param to URL to.
 * @param basename URL basename.
 */
export function resolve(from: string, to: To, basename: string = '/'): string {
  let pathname: string | undefined;

  const location = isString(to) ? parse(to) : to;
  const { pathname: path, origin, search, hash } = location;

  if (origin) {
    pathname = path ? normalize(path) : path;
  } else if (path && isAbsolute(path)) {
    pathname = normalize(basename + '/' + path);
  } else {
    from = isAbsolute(from) ? from : basename + '/' + from;

    if (path) {
      pathname = normalize(from + '/' + path);
    } else {
      pathname = normalize(from);
    }
  }

  return stringify({ origin, pathname, search, hash });
}
