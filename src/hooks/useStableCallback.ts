/**
 * @module useStableCallback
 */

import { useCallback } from 'react';
import { useLatestRef } from './useLatestRef';

export interface Callback {
  (this: any, ...args: any[]): any;
}

interface CallbackFunction {
  (this: unknown, ...args: unknown[]): unknown;
}

/**
 * @function useStableCallback
 * @description Create a stable callback.
 * @param callback Callback.
 */
export function useStableCallback<C extends Callback = CallbackFunction>(callback: C): C {
  const callbackRef = useLatestRef(callback);

  return useCallback(((...args) => callbackRef.current(...args)) as C, []);
}
