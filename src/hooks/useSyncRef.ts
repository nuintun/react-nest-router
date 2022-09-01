/**
 * @module useSyncRef
 */

import React, { useMemo, useRef } from 'react';

/**
 * @function useSyncRef
 * @description Create self sync ref.
 */
export function useSyncRef<T = undefined>(): React.MutableRefObject<T | undefined>;
/**
 * @function useSyncRef
 * @description Create self sync ref.
 * @param value Initial value
 */
export function useSyncRef<T>(value: T): React.MutableRefObject<T>;
export function useSyncRef<T = undefined>(value?: T): React.MutableRefObject<T | undefined> {
  const valueRef = useRef(value);

  // https://github.com/alibaba/hooks/issues/728
  valueRef.current = useMemo(() => value, [value]);

  return valueRef;
}
