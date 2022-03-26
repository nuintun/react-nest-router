/**
 * @module Navigate
 */

import { assert } from '../utils';
import { memo, useEffect } from 'react';
import { NavigateProps } from '../types';
import { useNavigate } from '../hooks/useNavigate';
import { useLocationContext } from '../hooks/useLocationContext';
import { useNavigationContext } from '../hooks/useNavigationContext';

/**
 * @function Navigate
 * @param props
 */
export const Navigate = memo(function Navigate({ to, state, replace }) {
  const locationContext = useLocationContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(navigationContext && locationContext, `The component <Navigate> can only be used inside a <Router> component.`);
  }

  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { state, replace });
  }, [to, state, replace]);

  return null;
}) as <S = unknown>(props: NavigateProps<S>) => null;
