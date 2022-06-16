/**
 * @module utils
 */

const { toString } = Object.prototype;

/**
 * @function isNumber
 * @param value The value to check.
 */
export function isNumber(value: unknown): value is number {
  return toString.call(value) === '[object Number]';
}

/**
 * @function isString
 * @param value The value to check.
 */
export function isString(value: unknown): value is string {
  return toString.call(value) === '[object String]';
}

/**
 * @function isFunction
 * @param value The value to check.
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

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
 * @function startsWith
 * @description Check if string starts with symbol.
 * @param string The string to check.
 * @param symbol The symbol to check for.
 */
export function startsWith(string: string, symbol: string): boolean {
  return string.charAt(0) === symbol;
}

/**
 * @function endsWith
 * @description Check if string ends with symbol.
 * @param string The string to check.
 * @param symbol The symbol to check for.
 */
export function endsWith(string: string, symbol: string): boolean {
  return string.charAt(string.length - 1) === symbol;
}

/**
 * @function prefix
 * @description Prefix the string with symbol.
 * @param string The string to prefix.
 * @param symbol Prefix symbol.
 */
export function prefix(string: string, symbol: string): string {
  return startsWith(string, symbol) ? string : symbol + string;
}

/**
 * @function suffix
 * @description Suffix the string with symbol.
 * @param string The string to suffix.
 * @param symbol Suffix symbol.
 */
export function suffix(string: string, symbol: string): string {
  return endsWith(string, symbol) ? string : string + symbol;
}
