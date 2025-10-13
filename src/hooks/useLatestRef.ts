/**
 * @module useLatestRef
 */

import { RefObject, useMemo, useRef } from 'react';

/**
 * @function useLatestRef
 * @description 生成自更新 useRef 对象
 */
export function useLatestRef<T = undefined>(): RefObject<T | undefined>;
/**
 * @function useLatestRef
 * @description 生成自更新 useRef 对象
 * @param value 引用值
 */
export function useLatestRef<T>(value: T): RefObject<T>;
export function useLatestRef<T = undefined>(value?: T): RefObject<T | undefined> {
  const valueRef = useRef(value);

  // https://github.com/alibaba/hooks/issues/728
  valueRef.current = useMemo(() => value, [value]);

  return valueRef;
}
