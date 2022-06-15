/**
 * @module utils
 */

export function readOnly<T>(value: T): Readonly<T> {
  if (__DEV__) {
    return Object.freeze(value);
  }

  return value;
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

/**
 * @function isFunction
 * @param value The value to check.
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * @function isNumber
 * @param value The value to check.
 */
export function isNumber(value: unknown): value is number {
  return Object.prototype.toString.call(value) === '[object Number]';
}

/**
 * @function isString
 * @param value The value to check.
 */
export function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === '[object String]';
}

/**
 * @function prefix
 * @description Prefix the string with symbol.
 * @param string The string to prefix.
 * @param symbol Prefix symbol.
 */
export function prefix(string: string, symbol: string): string {
  return string.charAt(0) === symbol ? string : symbol + string;
}

/**
 * @function suffix
 * @description Suffix the string with symbol.
 * @param string The string to suffix.
 * @param symbol Suffix symbol.
 */
export function suffix(string: string, symbol: string): string {
  const lastIndex = Math.max(0, string.length - 1);

  return string.charAt(lastIndex) === symbol ? string : string + symbol;
}
