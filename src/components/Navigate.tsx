/**
 * @module Navigate
 */

import { memo } from 'react';
import { useEffect } from 'react';
import { NavigateProps } from '../types';
import { useNavigate } from '../hooks/useNavigate';

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
}) as <S = unknown>(props: NavigateProps<S>) => null;
