/**
 * @module blocker
 */

import { assert, isFunction } from './utils';

export interface Resolver<T = void> {
  (): Promise<T> | T;
}

export interface Inspect<T = void> {
  (blocked: boolean, resolver: Resolver<T>): Promise<void> | void;
}

export interface Blocker<T = void> {
  unblock(): void;
  block(resolver: Resolver<T>): void;
  inspect(inspect: Inspect<T>): Promise<void>;
}

export default function createBlocker<T = void>(resolver: Resolver<T>): Blocker<T> {
  let blocked = false;
  let blocking = false;
  let action = resolver;

  const unblock = () => {
    blocked = false;
    action = resolver;
  };

  const block = (resolver: Resolver<T>) => {
    blocked = true;
    action = resolver;
  };

  const inspect = async (inspect: Inspect<T>) => {
    if (__DEV__) {
      assert(isFunction(inspect), 'The inspect must be a function');
    }

    if (!blocking) {
      blocking = true;

      await inspect(blocked, action);

      blocking = false;
    }
  };

  return { block, unblock, inspect };
}
