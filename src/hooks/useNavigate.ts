/**
 * @module useNavigate
 */

import { To } from 'history';
import { assert, isNumber } from '../utils';
import usePersistCallback from './usePersistCallback';
import { useLocationContext } from './useLocationContext';
import { useNavigationContext } from './useNavigationContext';

export interface NavigateOptions<S> {
  state?: S;
  replace?: boolean;
}

export interface Navigate<S> {
  (delta: number): void;
  (to: To, options?: NavigateOptions<S>): void;
}

export function useNavigate<S>(): Navigate<S> {
  const locationContext = useLocationContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(
      navigationContext && locationContext,
      `The hook useNavigate can only be used in the context of a <Router> component.`
    );
  }

  const { location } = locationContext!;
  const { basename, navigator } = navigationContext!;

  const navigate = usePersistCallback<Navigate<S>>((to, options: NavigateOptions<S> = {}) => {
    if (isNumber(to)) {
      return navigator.go(to);
    }

    const href = navigator.createHref(to);
  });

  return navigate;
}
