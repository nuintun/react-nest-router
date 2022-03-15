/**
 * @module pattern
 */

import { assert } from './utils';
import { Matcher, Mutable, Params } from './types';

/**
 * @function compile
 * @description Compile route path.
 * @param path Route path.
 * @param sensitive Case sensitive.
 */
export function compile<K extends string>(path: string, sensitive?: boolean): Matcher<K> {
  if (__DEV__) {
    assert(!/[^/](?=\*$)/.test(path), `Trailing "*" in routing path "${path}" must follow "/".`);
  }

  const keys: K[] = [];

  let source = `^${path
    // Ignore trailing / and /*, we'll handle it below.
    .replace(/\/*\*?$/, '')
    // Make sure it has a leading /.
    .replace(/^\/*/, '/')
    // Escape special regex chars.
    .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&')
    // Collect params and create match group.
    .replace(/:(\w+)/g, (_matched, param: K) => {
      keys.push(param);

      return '([^\\/]+)';
    })}`;

  if (path.endsWith('*')) {
    keys.push('*' as K);

    // Already matched the initial /, just match the rest.
    if (path === '*' || path === '/*') {
      source += '(.*)$';
    } else {
      // Don't include the / in params["*"].
      source += '(?:\\/(.+)|\\/*)$';
    }
  } else {
    source += '\\/*$';
  }

  const pattern = new RegExp(source, sensitive ? '' : 'i');

  const match = (pathname: string): Params<K> | null => {
    const matched = pathname.match(pattern);

    if (matched) {
      return keys.reduce((params, key, index) => {
        params[key] = matched[index + 1];

        return params;
      }, {} as Mutable<Params<K>>);
    }

    return matched;
  };

  return { path, keys, match, pattern };
}
