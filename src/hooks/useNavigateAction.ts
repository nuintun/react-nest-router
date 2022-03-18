/**
 * @module useNavigateAction
 */

import { Action } from 'history';
import { assert } from '../utils';
import { useLocationContext } from './useLocationContext';
import { useNavigationContext } from './useNavigationContext';

/**
 * @function useNavigateAction
 */
export function useNavigateAction(): Action {
  const locationContext = useLocationContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(
      navigationContext && locationContext,
      `The hook useNavigateAction can only be used in the context of a <Router> component.`
    );
  }

  return locationContext!.action;
}
