/**
 * @module useLocationContext
 */

import { useContext } from 'react';
import { LocationContext } from '../context';

/**
 * @function useLocationContext
 */
export function useLocationContext(): LocationContext | null {
  return useContext(LocationContext);
}
