/**
 * @module useOutletContext
 */

import { useContext } from 'react';
import { OutletContext } from '../context';

/**
 * @function useOutletContext
 */
export function useOutletContext<C>(): C | null {
  return useContext(OutletContext) as C;
}
