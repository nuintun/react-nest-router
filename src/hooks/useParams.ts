/**
 * @module useParams
 */

import { Params } from '../types';
import { assert, readOnly } from '../utils';
import { useRouteContext } from './useRouteContext';

/**
 * @function useParams
 * @description Get route parameters.
 */
export function useParams<K extends string = string>(): Readonly<Params<K>> {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, `The hook useParams can only be used inside a route element.`);
  }

  return readOnly(routeContext!.match.params);
}
