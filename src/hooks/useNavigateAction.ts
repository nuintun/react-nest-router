/**
 * @module useNavigateAction
 */

import { assert } from '../utils';
import { Action } from '../types';
import { useLocationContext } from './useLocationContext';
import { useNavigationContext } from './useNavigationContext';

/**
 * @function useNavigateAction
 * @description Get current navigate action.
 */
export function useNavigateAction(): Action {
  const locationContext = useLocationContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(navigationContext && locationContext, `The hook useNavigateAction can only be used inside a <Router> component.`);
  }

  return locationContext!.action;
}
