/**
 * @module useMatches
 */

import { assert } from '../utils';
import { IRoute } from '../types';
import { useRouteContext } from './useRouteContext';

/**
 * @function useMatches
 * @description Get all match routes.
 */
export function useMatches<M = unknown, K extends string = string>(): readonly IRoute<M, K>[] {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, `The hook useMatches can only be used inside a route element.`);
  }

  const { matches } = routeContext!.match;

  if (__DEV__) {
    return Object.freeze(matches) as IRoute<M, K>[];
  }

  return matches as IRoute<M, K>[];
}
