/**
 * @module pattern
 */

import { assert } from './utils';
import { Mutable, Params } from './types';

/**
 * Patch matcher
 */
type Matcher = <K extends string = string>(pathname: string) => Params<K> | null;

/**
 * @function compile
 * @description Compile route path.
 * @param path Route path.
 * @param sensitive Case sensitive.
 */
export function compile(path: string, sensitive?: boolean): Matcher {
  assert(!/[^/](?=\*$)/.test(path), `Trailing "*" in routing path "${path}" must follow "/".`);

  const keys: string[] = [];

  let source = `^${path
    // Ignore trailing / and /*, we'll handle it below.
    .replace(/\/*\*?$/, '')
    // Make sure it has a leading /.
    .replace(/^\/*/, '/')
    // Escape special regex chars.
    .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&')
    // Collect params and create match group.
    .replace(/:(\w+)/g, (_matched: string, param: string) => {
      keys.push(param);

      return '([^\\/]+)';
    })}`;

  if (path.endsWith('*')) {
    keys.push('*');

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

  const matcher = new RegExp(source, sensitive ? '' : 'i');

  return <K extends string = string>(pathname: string): Params<K> | null => {
    const matched = pathname.match(matcher);

    if (matched) {
      return keys.reduce((params, key, index) => {
        params[key as K] = matched[index + 1];

        return params;
      }, {} as Mutable<Params<K>>);
    }

    return matched;
  };
}
