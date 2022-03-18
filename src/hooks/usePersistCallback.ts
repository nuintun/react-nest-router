/**
 * @module usePersistCallback
 */

import { useCallback, useRef } from 'react';

/**
 * @function usePersistCallback
 * @description Create a persist callback
 * @param callback Callback
 */
export function usePersistCallback<C extends (...args: any[]) => any = (...args: unknown[]) => unknown>(callback: C): C {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  return useCallback(((...args) => callbackRef.current(...args)) as C, []);
}
