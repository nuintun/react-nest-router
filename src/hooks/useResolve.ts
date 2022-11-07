/**
 * @module useResolve
 */

import { resolve } from '../url';
import { To } from '../interface';
import { assert } from '../utils';
import { useCallback } from 'react';
import { useLatestRef } from './useLatestRef';
import { useRouteContext } from './useRouteContext';

/**
 * @function useResolve
 * @description Get resolve method.
 */
export function useResolve(): (to: To) => string {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, 'The hook useResolve can only be used inside a route element.');
  }

  const { basename, pathname } = routeContext!.match;
  const pathsRef = useLatestRef([basename, pathname]);

  return useCallback((to: To): string => {
    const [basename, pathname] = pathsRef.current;

    return resolve(pathname, to, basename);
  }, []);
}
