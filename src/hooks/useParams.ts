/**
 * @module useParams
 */

import { assert } from '/utils';
import { Params } from '/interface';
import { useRouteContext } from './useRouteContext';

/**
 * @function useParams
 * @description [hook] Get route parameters.
 */
export function useParams<K extends string = string>(): Params<K> {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, 'The hook useParams can only be used inside a route element');
  }

  const { params } = routeContext!.match;

  return params as Params<K>;
}
