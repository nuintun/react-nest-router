/**
 * @module blocker
 */

import { assert, isFunction, removeFromArray } from './utils';

export interface Resolver<T = unknown> {
  (): Promise<T> | T;
}

export interface Inspect<T = unknown> {
  (blocked: boolean, resolver: Resolver<T>): Promise<void>;
}

export interface onBlocking {
  (): void;
}

export interface Blocker<T = unknown> {
  block(resolver: Resolver<T>): void;
  unblock(resolver: Resolver<T>): void;
  inspect(inspect: Inspect<T>, onBlocking?: onBlocking): Promise<void>;
}

export default function createBlocker<T = unknown>(resolver: Resolver<T>): Blocker<T> {
  let blocking = false;

  const resolvers: Resolver<T>[] = [];

  return {
    block(resolver: Resolver<T>) {
      if (__DEV__) {
        assert(isFunction(resolver), 'The inspect must be a function');
      }

      resolvers.push(resolver);
    },
    unblock(resolver: Resolver<T>) {
      removeFromArray(resolvers, resolver);
    },
    async inspect(inspect: Inspect<T>, onBlocking?: onBlocking) {
      if (blocking) {
        if (onBlocking) {
          onBlocking();
        }
      } else {
        blocking = true;

        const blocked = resolvers.length > 0;

        await inspect(blocked, blocked ? resolvers[0] : resolver);

        blocking = false;
      }
    }
  };
}
