/**
 * @module utils
 */

/**
 * @function isFunction
 * @description Check the value is a function.
 * @param value The value to check.
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * @function isNumber
 * @description Check the value is a number.
 * @param value The value to check.
 */
export function isNumber(value: unknown): value is number {
  return Object.prototype.toString.call(value) === '[object Number]';
}

/**
 * @function isString
 * @description Check that value is a string.
 * @param value The value to check.
 */
export function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === '[object String]';
}

/**
 * @function readOnly
 * @description Set the value to read-only.
 * @param value The value to freeze.
 */
export function readOnly<T>(value: T): Readonly<T> {
  if (__DEV__) {
    return Object.freeze(value);
  }

  return value;
}

/**
 * @function assert
 * @description Assert the condition.
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
