/**
 * @module useRouter
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
    assert(!routeContext, 'The hook useRouter cannot use inside a route element.');
  }

  basename = useMemo(() => {
    return normalize(basename);
  }, [basename]);

  if (__DEV__) {
    assert(basename.startsWith('/'), 'Router basename must start with /.');
  }

  pathname = useMemo(() => {
    return normalize(pathname);
  }, [pathname]);

  const branches = useMemo(() => {
    return flatten(routes, basename);
  }, [basename, routes]);

  const matched = useMemo(() => {
    return match(branches, pathname);
  }, [pathname, branches]);

  const element = useMemo(() => {
    if (matched) {
      return matched.matches.reduceRight<React.ReactElement | null>((outlet, match, index) => {
        return (
          <RouteContext.Provider value={{ index, outlet, match: matched }}>
            {'element' in match ? match.element : outlet}
          </RouteContext.Provider>
        );
      }, null);
    }

    return null;
  }, [matched]);

  return useMemo(() => {
    if (element) {
      return <OutletContext.Provider value={context}>{element}</OutletContext.Provider>;
    }

    return element;
  }, [element, context]);
}
