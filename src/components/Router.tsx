/**
 * @module Router
 */

import React, { memo } from 'react';
import { RouterProps } from '../types';
import { useRouter } from '../hooks/useRouter';

/**
 * @function Router
 * @param props Router props.
 */
export const Router = memo(function Router(props) {
  return useRouter(props);
}) as <M = unknown, K extends string = string, C = unknown>(props: RouterProps<M, K, C>) => React.ReactElement;
