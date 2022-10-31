/**
 * @module useNavigate
 */

import { To } from '../types';
import { useCallback } from 'react';
import { useResolve } from './useResolve';
import { assert, isNumber } from '../utils';
import { useLatestRef } from './useLatestRef';
import { Navigate, NavigateOptions } from '../types';
import { useLocateContext } from './useLocateContext';
import { useNavigationContext } from './useNavigationContext';

/**
 * @function useNavigate
 * @description Get navigate method.
 */
export function useNavigate(): Navigate {
  const locateContext = useLocateContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(navigationContext && locateContext, 'The hook useNavigate can only be used inside a route element.');
  }

  const resolve = useResolve();
  const navigationRef = useLatestRef(navigationContext!);

  return useCallback(<S = unknown>(to: To | number, options: NavigateOptions<S> = {}): void => {
    const { navigator } = navigationRef.current;

    if (isNumber(to)) {
      navigator.go(to);
    } else {
      const path = resolve(to);
      const { replace, state } = options;

      if (replace) {
        navigator.replace(path, state);
      } else {
        navigator.push(path, state);
      }
    }
  }, []);
}
