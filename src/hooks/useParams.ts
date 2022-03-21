/**
 * @module useParams
 */

import { Params } from '../types';
import { assert } from '../utils';
import { useRouteContext } from './useRouteContext';

/**
 * @function useParams
 * @description Get route parameters.
 */
export function useParams<K extends string = string>(): Params<K> {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, `The hook useParams can only be used in the context of a route component.`);
  }

  return routeContext!.match.params;
}
