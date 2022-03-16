/**
 * @module hooks
 */

import { useMemo } from 'react';
import { Route } from '../types';
import { assert } from '../utils';
import { normalize } from '../path';
import { RouteContext } from '../context';
import { flatten, match } from '../router';
import { useRouteContext } from './useRouteContext';

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
): React.ReactElement | null {
  const context = useRouteContext();

  if (__DEV__) {
    assert(!context, `You cannot use another useRouter in a child route of useRouter.`);
  }

  pathname = useMemo(() => {
    return normalize(pathname);
  }, [pathname]);

  basename = useMemo(() => {
    return normalize(basename);
  }, [basename]);

  const branches = useMemo(() => {
    return flatten(routes);
  }, [routes]);

  const matched = useMemo(() => {
    return match(branches, pathname, basename);
  }, [pathname, basename]);

  return useMemo<React.ReactElement | null>(() => {
    if (matched) {
      return matched.meta.reduceRight<React.ReactElement | null>((outlet, route, index, meta) => {
        return (
          <RouteContext.Provider
            value={{
              outlet,
              match: matched,
              current: meta[index]
            }}
          >
            {'element' in route ? route.element : outlet}
          </RouteContext.Provider>
        );
      }, null);
    }

    return matched;
  }, [matched]);
}
