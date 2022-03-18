/**
 * @module useNavigate
 */

import { To } from 'history';
import { useResolve } from './useResolve';
import { assert, isNumber } from '../utils';
import { Navigate, NavigateOptions } from '../types';
import { usePersistCallback } from './usePersistCallback';
import { useLocationContext } from './useLocationContext';
import { useNavigationContext } from './useNavigationContext';

export function useNavigate(): Navigate {
  const locationContext = useLocationContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(
      navigationContext && locationContext,
      `The hook useNavigate can only be used in the context of a <Router> component.`
    );
  }

  const resolve = useResolve();
  const { navigator } = navigationContext!;

  return usePersistCallback(<S = unknown>(to: To | number, options: NavigateOptions<S> = {}) => {
    if (isNumber(to)) {
      return navigator.go(to);
    }

    const path = resolve(to);
    const { replace, state } = options;

    if (replace) {
      navigator.replace(path, state);
    } else {
      navigator.push(path, state);
    }
  });
}
