/**
 * @module useStableCallback
 */

import { useCallback, useMemo, useRef } from 'react';

/**
 * @function useStableCallback
 * @description Create a stable callback.
 * @param callback Callback.
 */
export function useStableCallback<C extends (...args: any[]) => any = (...args: unknown[]) => unknown>(callback: C): C {
  const callbackRef = useRef(callback);

  // https://github.com/reactjs/rfcs/pull/220
  // https://github.com/alibaba/hooks/issues/728
  callbackRef.current = useMemo(() => callback, [callback]);

  return useCallback(((...args) => callbackRef.current(...args)) as C, []);
}
