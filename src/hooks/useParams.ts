/**
 * @module useParams
 */

import { Params } from '../types';
import { assert } from '../utils';
import { useRouteContext } from './useRouteContext';

/**
 * @function useParams
 */
export function useParams<K extends string>(): Params<K> {
  const routeContext = useRouteContext();

  assert(routeContext, `The hook useParams can only be used in the context of a route component.`);

  return routeContext.match.params;
}
