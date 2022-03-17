/**
 * @module utils
 */

/**
 * @function assert
 * @param cond Assert flags.
 * @param message Assert error message.
 */
export function assert<T>(cond: T, message: string): asserts cond {
  if (!cond) throw new Error(message);
}

/**
 * @function isNumber
 * @param value
 */
export function isNumber(value: unknown): value is number {
  return Object.prototype.toString.call(value) === '[object Number]';
}

/**
 * @function isString
 * @param value
 */
export function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === '[object String]';
}

/**
 * @function computeScore
 * @param path Route path.
 * @param index Is index route.
 */
export function computeScore(path: string, index?: boolean): number {
  const indexRouteValue = 2;
  const emptySegmentValue = 1;
  const splatPenaltyValue = -2;
  const dynamicSegmentValue = 3;
  const staticSegmentValue = 10;

  const segments = path.split('/');

  let initialScore = segments.length;

  if (segments[initialScore - 1] === '*') {
    segments.pop();

    initialScore += splatPenaltyValue;
  }

  if (index) {
    initialScore += indexRouteValue;
  }

  return segments.reduce((score, segment) => {
    if (segment === '') {
      return score + emptySegmentValue;
    }

    const paramKeyRe = /^:\w+$/;

    if (paramKeyRe.test(segment)) {
      return score + dynamicSegmentValue;
    }

    return score + staticSegmentValue;
  }, initialScore);
}

/**
 * @function safelyDecodeURIComponent
 * @description Safely decode URI component.
 * @param value The value to decode.
 */
export function safelyDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
