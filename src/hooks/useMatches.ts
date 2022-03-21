/**
 * @module useMatches
 */

import { IRoute } from '../types';
import { assert } from '../utils';
import { useRouteContext } from './useRouteContext';

/**
 * @function useMatches
 * @description Get all match routes.
 */
export function useMatches<M = unknown, K extends string = string>(): IRoute<M, K>[] {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, `The hook useMatches can only be used inside a route element.`);
  }

  return routeContext!.match.meta as IRoute<M, K>[];
}
