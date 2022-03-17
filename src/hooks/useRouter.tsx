/**
 * @module hooks
 */

import { Route } from '../types';
import { assert } from '../utils';
import { normalize } from '../path';
import React, { useMemo } from 'react';
import { flatten, match } from '../router';
import { useRouteContext } from './useRouteContext';
import { OutletContext, RouteContext } from '../context';

/**
 * @function useRouter
 * @param routes
 * @param pathname
 * @param basename
 */
export function useRouter<M, K extends string, C>(
  routes: Route<M, K>[],
  pathname: string,
  basename: string = '/',
  context?: C
): React.ReactElement | null {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(!routeContext, `You cannot use useRouter inside another useRouter.`);
  }

  basename = useMemo(() => {
    return normalize(basename);
  }, [basename]);

  pathname = useMemo(() => {
    return normalize(pathname);
  }, [pathname]);

  const branches = useMemo(() => {
    return flatten(routes);
  }, [routes]);

  const outletContext = useMemo(() => {
    return { context };
  }, [context]);

  const matched = useMemo(() => {
    return match(branches, pathname, basename);
  }, [pathname, basename, branches]);

  return useMemo(() => {
    if (matched) {
      return (
        <OutletContext.Provider value={outletContext}>
          {matched.meta.reduceRight<React.ReactElement | null>((outlet, route, index, meta) => {
            return (
              <RouteContext.Provider
                value={{
                  match: matched,
                  outlet,
                  current: meta[index]
                }}
              >
                {'element' in route ? route.element : outlet}
              </RouteContext.Provider>
            );
          }, null)}
        </OutletContext.Provider>
      );
    }

    return null;
  }, [matched, outletContext]);
}
