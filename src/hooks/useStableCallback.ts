/**
 * @module useStableCallback
 */

import { useCallback } from 'react';
import { useSyncRef } from './useSyncRef';

/**
 * @function useStableCallback
 * @description Create a stable callback.
 * @param callback Callback.
 */
export function useStableCallback<C extends (...args: any[]) => any = (...args: unknown[]) => unknown>(callback: C): C {
  const callbackRef = useSyncRef(callback);

  return useCallback(((...args) => callbackRef.current(...args)) as C, []);
}
