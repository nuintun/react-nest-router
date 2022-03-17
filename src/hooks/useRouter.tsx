/**
 * @module hooks
 */

import { assert } from '../utils';
import { normalize } from '../path';
import { Outlet, Route } from '../types';
import { flatten, match } from '../router';
import { memo, useContext, useMemo } from 'react';
import { useRouteContext } from './useRouteContext';
import { OutletContext, RouteContext } from '../context';

/**
 * @function useRouter
 * @param routes
 * @param pathname
 * @param basename
 */
export function useRouter<M, K extends string>(routes: Route<M, K>[], pathname: string, basename: string = '/'): Outlet | null {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(!routeContext, `You cannot use useRouter inside another useRouter.`);
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
  }, [pathname, basename, branches]);

  return useMemo(() => {
    if (matched) {
      const EmptyOutlet: Outlet = () => null;

      return matched.meta.reduceRight((NextOutlet, route, index, meta) => {
        return memo(function Outlet(props) {
          const outletContext = useContext(OutletContext);

          const outlet = useMemo<OutletContext>(() => {
            const { context } = props;

            if (context !== undefined) {
              return { context };
            }

            return outletContext || { context };
          }, [props.context, outletContext]);

          return (
            <OutletContext.Provider value={outlet}>
              <RouteContext.Provider
                value={{
                  match: matched,
                  Outlet: NextOutlet,
                  current: meta[index]
                }}
              >
                {'element' in route ? route.element : <NextOutlet context={outlet} />}
              </RouteContext.Provider>
            </OutletContext.Provider>
          );
        });
      }, EmptyOutlet);
    }

    return null;
  }, [matched]);
}
