/**
 * @module events
 */

import { assert, isFunction } from './utils';

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
  let callbacks: Callback<E>[] = [];

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
      return () => {
        let removed = false;

        callbacks = callbacks.reduce<Callback<E>[]>((callbacks, item) => {
          const kept = item !== callback;

          if (kept || removed) {
            callbacks.push(item);
          } else if (!kept && !removed) {
            removed = true;
          }

          return callbacks;
        }, []);
      };
    }
  };
}
