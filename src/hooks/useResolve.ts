/**
 * @module useResolve
 */

import { To } from '../types';
import { resolve } from '../url';
import { assert } from '../utils';
import { useCallback } from 'react';
import { useLatestRef } from './useLatestRef';
import { useLocateContext } from './useLocateContext';
import { useNavigationContext } from './useNavigationContext';

/**
 * @function useResolve
 * @description Get resolve method.
 */
export function useResolve(): (to: To) => string {
  const locateContext = useLocateContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(navigationContext && locateContext, 'The hook useResolve can only be used inside a route element.');
  }

  const pathsRef = useLatestRef([navigationContext!.basename, locateContext!.location.pathname]);

  return useCallback((to: To): string => {
    const [basename, pathname] = pathsRef.current;

    return resolve(pathname, to, basename);
  }, []);
}
