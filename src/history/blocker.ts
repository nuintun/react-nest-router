/**
 * @module blocker
 */

import { isFunction } from './utils';

export interface Options<T = unknown> {
  onBlock?: (reason: T) => void;
  onUnblock?: (reason: T) => void;
}

export interface Blocker<T = unknown> {
  blocked: boolean;
  block(reason: T): () => void;
}

export default function createBlocker<T = unknown>({ onBlock, onUnblock }: Options<T>): Blocker<T> {
  let blocked = false;

  return {
    get blocked() {
      return blocked;
    },
    block(reason) {
      blocked = true;

      if (isFunction(onBlock)) {
        onBlock(reason);
      }

      return () => {
        blocked = false;

        if (isFunction(onUnblock)) {
          onUnblock(reason);
        }
      };
    }
  };
}
