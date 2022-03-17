/**
 * @module useNavigate
 */

import { To } from 'history';
import { assert } from '../utils';
import { useLocation } from './useLocation';
import { useRouteContext } from './useRouteContext';
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
  const location = useLocation();
  const routeContext = useRouteContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(routeContext && navigationContext, `The hook useNavigate can only be used in the context of a <Router> component.`);
  }

  return () => {
    console.log(location);
  };
}
