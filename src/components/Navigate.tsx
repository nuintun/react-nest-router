/**
 * @module Navigate
 */

import { To } from 'history';
import { memo } from 'react';
import { useEffect } from 'react';
import { useNavigate } from '../hooks/useNavigate';

export interface NavigateProps<S = unknown> {
  to: To;
  state?: S;
  replace?: boolean;
}

/**
 * @function Navigate
 * @param props
 */
export const Navigate = memo(function Navigate({ to, state, replace }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { state, replace });
  }, []);

  return null;
}) as <S>(props: NavigateProps<S>) => null;
