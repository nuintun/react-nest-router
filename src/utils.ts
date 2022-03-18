/**
 * @module utils
 */

/**
 * @function assert
 * @param cond Assert flags.
 * @param message Assert error message.
 */
export function assert<T>(cond: T, message: string): asserts cond {
  if (!cond) throw new Error(message);
}

/**
 * @function isNumber
 * @param value
 */
export function isNumber(value: unknown): value is number {
  return Object.prototype.toString.call(value) === '[object Number]';
}

/**
 * @function isString
 * @param value
 */
export function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === '[object String]';
}
