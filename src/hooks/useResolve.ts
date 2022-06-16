/**
 * @module useResolve
 */

import { To } from '../types';
import { useMemo } from 'react';
import { resolve } from '../url';
import { assert } from '../utils';
import { useLocationContext } from './useLocationContext';
import { usePersistCallback } from './usePersistCallback';
import { useNavigationContext } from './useNavigationContext';

/**
 * @function useResolve
 * @description Get resolve method.
 */
export function useResolve(): (to: To) => string {
  const locationContext = useLocationContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(navigationContext && locationContext, `The hook useResolve can only be used inside a <Router> component.`);
  }

  const { basename } = navigationContext!;
  const { pathname: from } = locationContext!.location;

  const resolveImpl = useMemo(() => {
    return (to: To): string => resolve(from, to, basename);
  }, [from, basename]);

  return usePersistCallback(resolveImpl);
}
