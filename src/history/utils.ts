/**
 * @module utils
 * @see https://github.com/remix-run/history
 */

export function readOnly<T>(value: T): Readonly<T> {
  if (__DEV__) {
    return Object.freeze(value);
  }

  return value;
}

export function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === '[object String]';
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * @function assert
 * @param cond Assert flags.
 * @param message Assert error message.
 */
export function assert<T>(cond: T, message: string): asserts cond {
  if (!cond) {
    throw new Error(message);
  }
}

export function removeFromArray<T>(array: T[], item: T): void {
  const index = array.indexOf(item);

  if (index >= 0) {
    array.splice(index, 1);
  }
}
