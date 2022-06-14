/**
 * @module browser
 */

import createBlocker from './blocker';
import { createEvents } from './events';
import { History, HistoryState, Location, To, Update } from './types';
import { parse } from './url';
import { Action, isString, PopStateEventType, readOnly, warning } from './utils';

export function createBrowserHistory(): History {
  let index: number;
  let action: Action;
  let location: Location<any>;

  const globalHistory = window.history;
  const globalLocation = window.location;

  const blocker = createBlocker();
  const events = createEvents<Update<any>>();

  // The state defaults to `null` because `window.history.state` does
  const getNextLocation = <S>(to: To, state: S | null = null): Location<S | null> => {
    const { pathname } = location;

    to = isString(to) ? parse(to) : to;

    return readOnly({ pathname, hash: '', search: '', ...to, state });
  };

  const getIndexAndLocation = <S>(): [index: number | null, location: Location<S | null>] => {
    const { pathname, search, hash } = globalLocation;
    const globalState: HistoryState<S> | null = globalHistory.state;

    const index = globalState?.idx || null;
    const state = globalState?.usr || null;

    return [index, readOnly({ pathname, search, hash, state })];
  };

  const bootstrap = (): [index: number, location: Location] => {
    const [index, location] = getIndexAndLocation();

    if (index == null) {
      return [0, location];
    }

    return [index, location];
  };

  const go: History['go'] = delta => {
    globalHistory.go(delta);
  };

  const push: History['push'] = (to, state) => {
    blocker.inspect(async (blocked, resolver) => {
      getNextLocation(to, state);

      if (blocked) {
        await resolver();
      } else {
        // globalHistory.pushState();
      }
    });
  };

  const back: History['back'] = () => {
    go(-1);
  };

  const forward: History['forward'] = () => {
    go(1);
  };

  const replace: History['replace'] = () => {};

  window.addEventListener(PopStateEventType, () => {
    const [idx, location] = getIndexAndLocation();

    if (idx != null) {
      const redirect = (revert: boolean = false) => {
        const delta = index - idx;

        if (delta !== 0) {
          go(revert ? delta * -1 : delta);
        }
      };

      blocker.inspect(async (blocked, resolver) => {
        if (blocked) {
          redirect();

          await resolver();

          redirect(true);
        } else {
          events.emit({ action: Action.Pop, location });
        }
      }, redirect);
    } else if (__DEV__) {
      // Trying to POP to a location with no index. We did not create
      // this location, so we can't effectively block the navigation.
      warning(
        `You are trying to block a POP navigation to a location that was not ` +
          `created by the history library. The block will fail silently in ` +
          `production, but in general you should do all navigation with the ` +
          `history library (instead of using window.history.pushState directly) ` +
          `to avoid this situation.`
      );
    }
  });

  [index, location] = bootstrap();

  return {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    go,
    back,
    push,
    forward,
    replace,
    listen(callback) {
      events.listen(callback);

      return () => events.unlisten(callback);
    },
    block(resolver) {
      const callback = async () => {
        await resolver({
          action,
          location
        });

        blocker.unblock(callback);
      };

      blocker.block(callback);

      return () => blocker.unblock(callback);
    }
  };
}
