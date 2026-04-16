/**
 * @module useMatches
 */

import { assert } from '/utils';
import { IRoute } from '/interface';
import { useRouteContext } from './useRouteContext';

/**
 * @function useMatches
 * @description [hook] Get all match routes.
 */
export function useMatches<M = unknown, K extends string = string>(): readonly IRoute<M, K>[] {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, 'The hook useMatches can only be used inside a route element');
  }

  const { matches } = routeContext!.match;

  return matches as IRoute<M, K>[];
}
