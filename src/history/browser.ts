/**
 * @module browser
 */

import createBlocker from './blocker';
import { createEvents } from './events';
import { parse, stringify } from './url';
import { History, HistoryState, Location, To, Update } from './types';
import { Action, isString, PopStateEventType, readOnly, warning } from './utils';

export function createBrowserHistory(): History {
  const globalHistory = window.history;
  const globalLocation = window.location;

  const events = createEvents<Update<any>>();
  const blocker = createBlocker<boolean>(() => true);

  const getIndexAndLocation = <S>(): [index: number | null, location: Location<S | null>] => {
    const { pathname, search, hash } = globalLocation;
    const globalState: HistoryState<S> | null = globalHistory.state;

    const index = globalState?.idx ?? null;
    const state = globalState?.usr ?? null;

    return [index, readOnly({ pathname, search, hash, state })];
  };

  const bootstrap = <S>(): [index: number, location: Location<S | null>] => {
    const [index, location] = getIndexAndLocation<S>();

    if (index == null) {
      const { state } = globalHistory;

      globalHistory.replaceState({ ...state, idx: 0 }, '');

      return [0, location];
    }

    return [index, location];
  };

  let action: Action = Action.Pop;
  let [index, location] = bootstrap<any>();

  // The state defaults to `null` because `window.history.state` does
  const getNextLocation = <S>(to: To, state: S | null = null): Location<S | null> => {
    const { pathname } = location;

    to = isString(to) ? parse(to) : to;

    return readOnly({ pathname, hash: '', search: '', ...to, state });
  };

  const getURLAndState = <S>(index: number, location: Location<S>): [url: string, state: HistoryState<S>] => {
    return [stringify(location), { idx: index, usr: location.state }];
  };

  const go: History['go'] = delta => {
    globalHistory.go(delta);
  };

  const back: History['back'] = () => {
    go(-1);
  };

  const forward: History['forward'] = () => {
    go(1);
  };

  const push: History['push'] = (to, state) => {
    blocker.inspect(async (blocked, resolver) => {
      if (!blocked || (await resolver())) {
        action = Action.Push;
        location = getNextLocation(to, state);

        const [url, historyState] = getURLAndState(++index, location);

        globalHistory.pushState(historyState, '', url);

        events.emit({ action, location });
      }
    });
  };

  const replace: History['replace'] = (to, state) => {
    blocker.inspect(async (blocked, resolver) => {
      if (!blocked || (await resolver())) {
        action = Action.Replace;
        location = getNextLocation(to, state);

        const [url, historyState] = getURLAndState(index, location);

        globalHistory.replaceState(historyState, '', url);

        events.emit({ action, location });
      }
    });
  };

  window.addEventListener(PopStateEventType, () => {
    const [nextIndex, nextLocation] = getIndexAndLocation();

    if (nextIndex != null) {
      const redirect = (revert: boolean = false) => {
        const delta = index - nextIndex;

        if (delta !== 0) {
          go(revert ? delta * -1 : delta);
        }
      };

      blocker.inspect(async (blocked, resolver) => {
        if (blocked) {
          redirect();

          if (await resolver()) {
            redirect(true);
          }
        } else {
          action = Action.Pop;
          location = nextLocation;

          events.emit({ action, location });
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

  return {
    go,
    back,
    push,
    forward,
    replace,
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    listen(callback) {
      events.listen(callback);

      return () => events.unlisten(callback);
    },
    block(resolver) {
      const callback = async () => {
        if (await resolver({ action, location })) {
          blocker.unblock(callback);

          return true;
        }

        return false;
      };

      blocker.block(callback);

      return () => blocker.unblock(callback);
    }
  };
}
