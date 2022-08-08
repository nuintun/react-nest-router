/**
 * @module events
 */

import { assert, isFunction } from '../utils';

export interface Callback<E = unknown> {
  (event: E): void;
}

export interface Events<E> {
  readonly length: number;
  readonly emit: (event: E) => void;
  readonly listen: (callback: Callback<E>) => void;
  readonly unlisten: (callback: Callback<E>) => void;
}

export function createEvents<E = unknown>(): Events<E> {
  const callbacks: Callback<E>[] = [];

  return {
    get length() {
      return callbacks.length;
    },
    emit(event) {
      for (const callback of callbacks) {
        callback(event);
      }
    },
    listen(callback) {
      if (__DEV__) {
        assert(isFunction(callback), 'The callback must be a function');
      }

      callbacks.push(callback);
    },
    unlisten(callback) {
      const index = callbacks.indexOf(callback);

      if (index >= 0) {
        callbacks.splice(index, 1);
      }
    }
  };
}
