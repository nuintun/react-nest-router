/**
 * @module utils
 * @see https://github.com/remix-run/history
 */

export const BeforeUnloadEventType = 'beforeunload';
export const HashChangeEventType = 'hashchange';
export const PopStateEventType = 'popstate';

export const enum Action {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Pop = 'POP',
  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */
  Push = 'PUSH',
  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */
  Replace = 'REPLACE'
}

export function readOnly<T>(value: T): Readonly<T> {
  if (__DEV__) {
    return Object.freeze(value);
  }

  return value;
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

export function warning(message: string): void {
  if (isFunction(console.warn)) {
    console.warn(message);
  }

  try {
    // Welcome to debugging history!
    //
    // This error is thrown as a convenience so you can more easily
    // find the source for a warning that appears in the console by
    // enabling "pause on exceptions" in your JavaScript debugger.
    throw new Error(message);
  } catch {}
}

export function preventBeforeUnload(event: BeforeUnloadEvent): void {
  // Cancel the event.
  event.preventDefault();

  // Chrome (and legacy IE) requires returnValue to be set.
  event.returnValue = false;
}

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function removeFromArray<T>(array: T[], item: T): void {
  const index = array.indexOf(item);

  if (index >= 0) {
    array.splice(index, 1);
  }
}
