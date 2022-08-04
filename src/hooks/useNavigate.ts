/**
 * @module useNavigate
 */

import { To } from '../types';
import { useMemo } from 'react';
import { useResolve } from './useResolve';
import { assert, isNumber } from '../utils';
import { Navigate, NavigateOptions } from '../types';
import { usePersistCallback } from './usePersistCallback';
import { useLocationContext } from './useLocationContext';
import { useNavigationContext } from './useNavigationContext';

/**
 * @function useNavigate
 * @description Get navigate method.
 */
export function useNavigate(): Navigate {
  const locationContext = useLocationContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(navigationContext && locationContext, `The hook useNavigate can only be used inside a <Router> component.`);
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

  return usePersistCallback(navigate);
}
