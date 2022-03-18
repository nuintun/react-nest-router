/**
 * @module useNavigate
 */

import { To } from 'history';
import { useResolve } from './useResolve';
import { assert, isNumber } from '../utils';
import { usePersistCallback } from './usePersistCallback';
import { useLocationContext } from './useLocationContext';
import { useNavigationContext } from './useNavigationContext';

export interface NavigateOptions<S> {
  state?: S;
  replace?: boolean;
}

export interface Navigate {
  (delta: number): void;
  <S>(to: To, options?: NavigateOptions<S>): void;
}

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

  return usePersistCallback(<S>(to: To | number, options: NavigateOptions<S> = {}) => {
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
