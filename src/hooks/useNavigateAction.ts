/**
 * @module useNavigateAction
 */

import { assert } from '../utils';
import { Action } from '../types';
import { useLocateContext } from './useLocateContext';
import { useNavigationContext } from './useNavigationContext';

/**
 * @function useNavigateAction
 * @description Get current navigate action.
 */
export function useNavigateAction(): Action {
  const locateContext = useLocateContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(navigationContext && locateContext, 'The hook useNavigateAction can only be used inside a <Router> component.');
  }

  return locateContext!.action;
}
