/**
 * @module Navigate
 */

import { assert } from '../utils';
import { memo, useEffect } from 'react';
import { NavigateProps } from '../interface';
import { useNavigate } from '../hooks/useNavigate';
import { useLocateContext } from '../hooks/useLocateContext';
import { useNavigationContext } from '../hooks/useNavigationContext';

/**
 * @function Navigate
 * @param props Navigate props.
 */
export const Navigate = memo(function Navigate({ to, state, replace }) {
  const locateContext = useLocateContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(navigationContext && locateContext, 'The component <Navigate> can only be used inside a route element.');
  }

  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { state, replace });
  }, [to, state, replace]);

  return null;
}) as <S = unknown>(props: NavigateProps<S>) => null;
