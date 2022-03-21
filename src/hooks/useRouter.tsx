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
 * @description Get the element of the route that matched the current location.
 * @param routes User routes.
 * @param pathname The pathname to match.
 * @param basename The basename of the route.
 */
export function useRouter<M = unknown, K extends string = string, C = unknown>(
  routes: Route<M, K>[],
  pathname: string,
  basename: string = '/',
  context?: C
): React.ReactElement | null {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(!routeContext, `The hook useRouter cannot use inside a route element.`);
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

  const element = useMemo(() => {
    if (matched) {
      return matched.meta.reduceRight<React.ReactElement | null>((outlet, route) => {
        return (
          <RouteContext.Provider value={{ outlet, match: matched, current: route }}>
            {'element' in route ? route.element : outlet}
          </RouteContext.Provider>
        );
      }, null);
    }

    return null;
  }, [matched]);

  return element ? <OutletContext.Provider value={outletContext}>{element}</OutletContext.Provider> : element;
}
