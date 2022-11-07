/**
 * @module navigator
 */

import { isString } from '../utils';
import { Action, Event } from './enum';
import { createEvents } from './events';
import { parse, stringify } from './url';
import { Location, Navigator, NavigatorEvent, To } from './interface';

function getLocation<S>(window: Window): Readonly<Location<S>> {
  const state: S = window.history.state;
  const { pathname, search, hash } = window.location;
  const location: Location<S> = { pathname, search, hash, state };

  return __DEV__ ? Object.freeze(location) : location;
}

function getNextURL<S>(from: Location<S>, to: To): string {
  const { pathname } = from;
  const location = isString(to) ? parse(to) : to;

  return stringify({ pathname, ...location });
}

export function createNavigator(window: Window): Navigator {
  let action: Action = Action.Pop;
  let location = getLocation(window);

  const globalHistory = window.history;
  const globalLocation = window.location;
  const events = createEvents<NavigatorEvent<any>>();

  window.addEventListener(Event.PopState, () => {
    action = Action.Pop;
    location = getLocation(window);

    events.emit({ action, location });
  });

  const go: Navigator['go'] = delta => {
    globalHistory.go(delta);
  };

  const push: Navigator['push'] = (to, state) => {
    const url = getNextURL(location, to);

    try {
      globalHistory.pushState(state, '', url);

      action = Action.Push;
      location = getLocation(window);

      events.emit({ action, location });
    } catch {
      globalLocation.assign(url);
    }
  };

  const replace: Navigator['replace'] = (to, state) => {
    const url = getNextURL(location, to);

    try {
      globalHistory.replaceState(state, '', url);

      action = Action.Replace;
      location = getLocation(window);

      events.emit({ action, location });
    } catch {
      globalLocation.assign(url);
    }
  };

  return {
    go,
    push,
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
    }
  };
}
