/**
 * @module hooks
 */

import { useMemo } from 'react';
import { flatten, match } from '../router';
import { Route, RouteMatch } from '../types';

/**
 * @function useRouter
 * @param routes
 * @param pathname
 * @param basename
 */
export function useRouter<T, K extends string>(
  routes: Route<T, K>[],
  pathname: string,
  basename: string = '/'
): RouteMatch<T, K> | null {
  const branches = useMemo(() => {
    return flatten(routes);
  }, [routes]);

  const matched = useMemo(() => {
    return match(branches, pathname, basename);
  }, [pathname, basename]);

  return matched;
}
