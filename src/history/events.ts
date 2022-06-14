/**
 * @module events
 */

import { assert, isFunction, removeFromArray } from './utils';

export interface Callback<E = unknown> {
  (event: E): void;
}

export interface Events<E> {
  length: number;
  emit: (event: E) => void;
  listen: (callback: Callback<E>) => void;
  unlisten: (callback: Callback<E>) => void;
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
      removeFromArray(callbacks, callback);
    }
  };
}
