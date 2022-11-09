/**
 * @module useRoutes
 */

import { Route } from '../interface';
import { flatten, match } from '../router';
import { ReactElement, useMemo } from 'react';
import { isAbsolute, normalize } from '../path';
import { OutletContext, RouteContext } from '../context';
import { assert, hasOwnKey, startsWith } from '../utils';

/**
 * @function useRoutes
 * @description Get the element of the route that matched the current location.
 * @param routes User routes.
 * @param pathname The pathname to match.
 * @param basename The basename of the route.
 */
export function useRoutes<M = unknown, K extends string = string, C = unknown>(
  routes: Route<M, K>[],
  pathname: string,
  basename: string = '/',
  context?: C
): ReactElement | null {
  basename = useMemo(() => {
    if (__DEV__) {
      assert(startsWith(basename, '/'), 'Router basename must start with /.');
    }

    return normalize(basename);
  }, [basename]);

  pathname = useMemo(() => {
    if (__DEV__) {
      assert(isAbsolute(pathname), 'Router pathname must be an absolute path starting with basename.');
    }

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
      return matched.matches.reduceRight<ReactElement | null>((outlet, match, index) => {
        return (
          <RouteContext.Provider value={{ index, outlet, match: matched }}>
            {hasOwnKey(match, 'element') ? match.element : outlet}
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
