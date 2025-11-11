/**
 * @module useNavigate
 */

import { useCallback } from 'react';
import { assert, isNumber } from '/utils';
import { useResolve } from './useResolve';
import { useLatestRef } from './useLatestRef';
import { useLocateContext } from './useLocateContext';
import { Navigate, NavigateOptions, To } from '/interface';
import { useNavigationContext } from './useNavigationContext';

/**
 * @function useNavigate
 * @description [hook] Get navigate method.
 */
export function useNavigate(): Navigate {
  const locateContext = useLocateContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(locateContext && navigationContext, 'The hook useNavigate can only be used inside a route element');
  }

  const resolve = useResolve();
  const navigatorRef = useLatestRef(navigationContext!.navigator);

  return useCallback(<S = unknown>(to: To | number, options: NavigateOptions<S> = {}): void => {
    const { current: navigator } = navigatorRef;

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
