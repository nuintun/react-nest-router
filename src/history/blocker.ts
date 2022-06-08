/**
 * @module blocker
 */

import { isFunction } from './utils';

export interface Inspect<T = unknown> {
  (blocked: boolean, reason?: T): void;
}

export interface Blocker<T = unknown> {
  unblock(): void;
  block(reason: T): void;
  inspect(inspect: Inspect<T>): void;
}

export default function createBlocker<T = unknown>(): Blocker<T> {
  let blocker: [blocked: boolean, reason?: T] = [false];

  return {
    unblock() {
      blocker = [false];
    },
    inspect(inspect) {
      if (__DEV__) {
        if (!isFunction(inspect)) {
          throw new SyntaxError('The inspect must be a function');
        }
      }

      inspect(...blocker);
    },
    block(reason) {
      blocker = [true, reason];
    }
  };
}
