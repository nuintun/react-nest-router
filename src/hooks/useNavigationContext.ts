/**
 * @module useNavigationContext
 */

import { useContext } from 'react';
import { NavigationContext } from '../context';

/**
 * @function useNavigationContext
 */
export function useNavigationContext(): NavigationContext | null {
  return useContext(NavigationContext);
}
