/**
 * @module useLocationContext
 */

import { useContext } from 'react';
import { LocationContext } from '../context';

/**
 * @function useLocationContext
 * @description Get location context.
 */
export function useLocationContext(): LocationContext | null {
  return useContext(LocationContext);
}
