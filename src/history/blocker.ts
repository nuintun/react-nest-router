/**
 * @module blocker
 */

import { assert, isFunction } from './utils';

const defaultResolver = () => {};

export interface Resolver {
  (): Promise<void> | void;
}

export interface onChange {
  (blocked: boolean): void;
}

export interface Inspect {
  (blocked: boolean, resolver: Resolver): Promise<void>;
}

export interface Blocker {
  unblock(): void;
  block(resolver: Resolver): void;
  inspect(inspect: Inspect): Promise<void>;
}

export default function createBlocker(onChange: onChange): Blocker {
  let blocked = false;
  let blocking = false;
  let action = defaultResolver;

  const unblock = () => {
    const changed = blocked !== false;

    blocked = false;
    action = defaultResolver;

    if (changed) {
      onChange(blocked);
    }
  };

  const block = (resolver: Resolver) => {
    const changed = blocked !== true;

    blocked = true;
    action = resolver;

    if (changed) {
      onChange(blocked);
    }
  };

  const inspect = async (inspect: Inspect) => {
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
