/**
 * @module pattern
 */

import { assert, endsWith } from './utils';
import { safelyDecodeURIComponent } from './url';
import { Matcher, Mutable, Params } from './interface';

/**
 * @function compile
 * @description Compile route path.
 * @param path Route path.
 * @param sensitive Case sensitive.
 * @see https://github.com/remix-run/react-router
 */
export function compile<K extends string>(path: string, sensitive: boolean = false): Matcher<K> {
  if (__DEV__) {
    assert(!/(?:^|[^/])(?=\*$)/.test(path), `Trailing "*" in path "${path}" must follow "/".`);

    assert(!/(?::\w+){2,}/.test(path), `Cannot have directly adjacent param in path "${path}".`);
  }

  // Source string.
  let source = '^';

  // Path parameter keys.
  const keys: K[] = [];

  // Add path source string.
  source += path
    // Ignore trailing / and /*, we'll handle it below.
    .replace(/\/+\*?$/, '')
    // Escape special regex chars.
    .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&')
    // Collect params and create match group.
    .replace(/:(\w+)/g, (_matched, param: K) => {
      if (__DEV__) {
        assert(!keys.includes(param), `Duplicate param key "${param}" found in path "${path}".`);
      }

      keys.push(param);

      return '([^\\/]+)';
    });

  // If ends with *.
  if (endsWith(path, '*')) {
    keys.push('*' as K);

    source += '\\/(.*)$';
  } else {
    source += '\\/*$';
  }

  const pattern = new RegExp(source, sensitive ? '' : 'i');

  const match = (path: string): Params<K> | null => {
    const matched = path.match(pattern);

    if (matched) {
      return keys.reduce((params, key, index) => {
        const value: string | undefined = matched[index + 1];

        params[key] = value ? safelyDecodeURIComponent(value) : value;

        if (__DEV__) {
          return Object.freeze(params);
        }

        return params;
      }, {} as Mutable<Params<K>>);
    }

    return matched;
  };

  return { path, keys, match, pattern, sensitive };
}
