/**
 * @module browser
 */

import createBlocker from './blocker';
import { createEvents } from './events';
import { History, HistoryState, Location, Update } from './types';
import { Action, PopStateEventType, readOnly, warning } from './utils';

export function createBrowserHistory(): History {
  let index: number;
  let action: Action;
  let location: Location<any>;

  const blocker = createBlocker();
  const events = createEvents<Update<any>>();

  const globalHistory = window.history;
  const globalLocation = window.location;

  const getIndexAndLocation = (): [number | null, Location] => {
    const { pathname, search, hash } = globalLocation;
    const globalState: HistoryState | null = globalHistory.state;

    const idx = globalState?.idx || null;
    const state = globalState?.usr || null;

    return [idx, readOnly<Location>({ pathname, search, hash, state })];
  };

  const go: History['go'] = delta => {
    globalHistory.go(delta);
  };

  const bootstrap = (): [index: number, location: Location] => {
    const [index, location] = getIndexAndLocation();

    if (index == null) {
      return [0, location];
    }

    return [index, location];
  };

  [index, location] = bootstrap();

  window.addEventListener(PopStateEventType, () => {
    const [idx, location] = getIndexAndLocation();

    if (idx != null) {
      blocker.inspect(
        async (blocked, resolver) => {
          if (blocked) {
            const delta = index - idx;

            if (delta !== 0) {
              go(delta);
            }

            await resolver();

            blocker.unblock(resolver);
          } else {
            events.emit({ action: Action.Pop, location });
          }
        },
        () => {
          const delta = index - idx;

          if (delta !== 0) {
            go(delta);
          }
        }
      );
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

  console.log(events, getIndexAndLocation);

  return {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    block(resolver) {
      const callback = () => {
        return resolver({
          action,
          location
        });
      };

      blocker.block(callback);

      return () => {
        blocker.unblock(callback);
      };
    },
    back() {},
    forward() {},
    go() {},
    push() {},
    replace() {},
    listen(callback) {
      events.listen(callback);

      return () => {
        events.unlisten(callback);
      };
    }
  };
}
