/**
 * @module utils
 */

/**
 * @function isSplat
 * @param char The character to be tested.
 */
export function isSplat(char: string): boolean {
  return char === '*';
}

/**
 * @function assert
 * @param cond Assert flags.
 * @param message Assert error message.
 */
export function assert(cond: any, message: string): asserts cond {
  if (cond) throw new Error(message);
}

/**
 * @function computeScore
 * @param path Route path.
 * @param index Is index route.
 */
export function computeScore(path: string, index?: boolean): number {
  const splatPenalty = -2;
  const indexRouteValue = 2;
  const emptySegmentValue = 1;
  const dynamicSegmentValue = 3;
  const staticSegmentValue = 10;

  const segments = path.split('/');

  let initialScore = segments.length;

  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }

  if (index) {
    initialScore += indexRouteValue;
  }

  return segments.reduce((score, segment) => {
    if (isSplat(segment)) {
      return score;
    }

    if (segment === '') {
      return score + emptySegmentValue;
    }

    const paramRegexp = /^:\w+$/;

    if (paramRegexp.test(segment)) {
      return score + dynamicSegmentValue;
    }

    return score + staticSegmentValue;
  }, initialScore);
}
