/**
 * @module useLocateContext
 */

import { useContext } from 'react';
import { LocateContext } from '/context';

/**
 * @function useLocateContext
 * @description [hook] Get locate context.
 */
export function useLocateContext(): LocateContext | null {
  return useContext(LocateContext);
}
