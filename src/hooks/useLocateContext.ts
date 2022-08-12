/**
 * @module useLocateContext
 */

import { useContext } from 'react';
import { LocateContext } from '../context';

/**
 * @function useLocateContext
 * @description Get locate context.
 */
export function useLocateContext(): LocateContext | null {
  return useContext(LocateContext);
}
