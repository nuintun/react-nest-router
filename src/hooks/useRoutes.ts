/**
 * @module hooks
 */

import { useMemo } from 'react';
import { Route } from '../types';
import { flatten, match } from '../router';

/**
 * @function useRoutes
 * @param routes
 * @param pathname
 * @param basename
 */
export function useRoutes<T, K extends string>(routes: Route<T, K>[], pathname: string, basename: string = '/') {
  const branches = useMemo(() => {
    return flatten(routes);
  }, [routes]);

  const matched = useMemo(() => {
    return match(branches, pathname, basename);
  }, [basename, pathname]);

  return matched;
}
