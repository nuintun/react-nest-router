/**
 * @module utils
 */

// Object prototype methods.
const { hasOwnProperty, toString } = Object.prototype;

/**
 * @function isString
 * @description Check that value is a string.
 * @param value The value to check.
 */
export function isString(value: unknown): value is string {
  return toString.call(value) === '[object String]';
}

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
  return symbol !== '' ? string.slice(0, symbol.length) === symbol : true;
}

/**
 * @function endsWith
 * @description Check if string ends with symbol.
 * @param string The string to check.
 * @param symbol The symbol to check for.
 */
export function endsWith(string: string, symbol: string): boolean {
  return symbol !== '' ? string.slice(-symbol.length) === symbol : true;
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

/**
 * @function hasOwnKey
 * @description Test whether the target has its own key.
 * @param target The target.
 * @param key Key name.
 */
export function hasOwnKey<T extends Record<any, any>>(target: T, key: keyof T): boolean {
  return hasOwnProperty.call(target, key);
}
