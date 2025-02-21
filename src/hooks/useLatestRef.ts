/**
 * @module useLatestRef
 */

import { MutableRefObject, useMemo, useRef } from 'react';

/**
 * @function useLatestRef
 * @description 生成自更新 useRef 对象
 */
export function useLatestRef<T = undefined>(): MutableRefObject<T | undefined>;
/**
 * @function useLatestRef
 * @description 生成自更新 useRef 对象
 * @param value 引用值
 */
export function useLatestRef<T>(value: T): MutableRefObject<T>;
export function useLatestRef<T = undefined>(value?: T): MutableRefObject<T | undefined> {
  const valueRef = useRef(value);

  // https://github.com/alibaba/hooks/issues/728
  valueRef.current = useMemo(() => value, [value]);

  return valueRef;
}
