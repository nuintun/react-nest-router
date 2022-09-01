/**
 * @module useResolve
 */

import { To } from '../types';
import { useMemo } from 'react';
import { resolve } from '../url';
import { assert } from '../utils';
import { useLocateContext } from './useLocateContext';
import { useStableCallback } from './useStableCallback';
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

  const { basename } = navigationContext!;
  const { pathname: from } = locateContext!.location;

  const resolveImpl = useMemo(() => {
    return (to: To): string => resolve(from, to, basename);
  }, [from, basename]);

  return useStableCallback(resolveImpl);
}
