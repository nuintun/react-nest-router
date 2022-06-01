/**
 * @module events
 */

export interface Events<C> {
  length: number;
  call: (args: unknown) => void;
  push: (callback: C) => () => void;
}

export function createEvents<C extends Function>(): Events<C> {
  let callbacks: C[] = [];

  return {
    get length() {
      return callbacks.length;
    },
    push(callback: C) {
      callbacks.push(callback);

      return () => {
        callbacks = callbacks.filter(item => item !== callback);
      };
    },
    call(args) {
      callbacks.forEach(fn => fn && fn(args));
    }
  };
}
