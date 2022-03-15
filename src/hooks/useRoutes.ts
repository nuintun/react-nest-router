/**
 * @module hooks
 */

import { useMemo } from 'react';
import { Route } from '../types';
import { normalize } from '../path';
import { flatten, match } from '../router';

/**
 * @function useRoutes
 * @param routes
 * @param pathname
 * @param basename
 */
export function useRoutes<T>(routes: Route<T>[], pathname: string, basename: string = '/') {
  const branches = useMemo(() => {
    return flatten<T>(routes);
  }, [routes]);

  const matched = useMemo(() => {
    return match<T, string>(branches, normalize(`/${pathname}`), normalize(`/${basename}`));
  }, [basename, pathname]);

  return matched;
}
