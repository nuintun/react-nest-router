/**
 * @module useNavigationContext
 */

import { useContext } from 'react';
import { NavigationContext } from '/context';

/**
 * @function useNavigationContext
 * @description [hook] Get navigation context.
 */
export function useNavigationContext(): NavigationContext | null {
  return useContext(NavigationContext);
}
