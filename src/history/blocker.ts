/**
 * @module blocker
 */

import { assert, isFunction, removeFromArray } from './utils';

export interface Resolver {
  (): Promise<void> | void;
}

export interface Inspect {
  (blocked: boolean, resolver: Resolver): Promise<void>;
}

export interface onBlocking {
  (): void;
}

export interface Blocker {
  block(resolver: Resolver): void;
  unblock(resolver: Resolver): void;
  inspect(inspect: Inspect, onBlocking?: onBlocking): Promise<void>;
}

export default function createBlocker(): Blocker {
  let blocking = false;

  const resolvers: Resolver[] = [];

  const block = (resolver: Resolver) => {
    if (__DEV__) {
      assert(isFunction(resolver), 'The inspect must be a function');
    }

    resolvers.push(resolver);
  };

  const unblock = (resolver: Resolver) => {
    removeFromArray(resolvers, resolver);
  };

  const inspect = async (inspect: Inspect, onBlocking?: onBlocking) => {
    if (!blocking) {
      blocking = true;

      const [action = () => {}] = resolvers;

      await inspect(resolvers.length > 0, action);

      blocking = false;
    } else if (onBlocking) {
      onBlocking();
    }
  };

  return { block, unblock, inspect };
}
