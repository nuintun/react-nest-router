/**
 * @module useNavigate
 */

import { To } from '../types';
import { useMemo } from 'react';
import { useResolve } from './useResolve';
import { assert, isNumber } from '../utils';
import { Navigate, NavigateOptions } from '../types';
import { useLocateContext } from './useLocateContext';
import { useStableCallback } from './useStableCallback';
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
  const { navigator } = navigationContext!;

  const navigate = useMemo(() => {
    return <S = unknown>(to: To | number, options: NavigateOptions<S> = {}) => {
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
    };
  }, [navigator]);

  return useStableCallback(navigate);
}
