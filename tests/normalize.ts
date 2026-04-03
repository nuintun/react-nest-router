/**
 * @module normalize
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path/posix';
import { normalize } from '../esm/path.js';

test('normalize should align with node:path/posix.normalize for common paths', () => {
  const cases = [
    '',
    'foo/.',
    '../../a',
    'foo/bar',
    '/../../a',
    '/var/lib',
    'foo//bar',
    'foo/bar/',
    'foo/./bar',
    'a/b//../c/./d/',
    'foo/bar/../baz',
    '/var/lib/../file',
    './foo',
    '../foo/..',
    '/foo/./bar/../baz'
  ];

  for (const input of cases) {
    assert.equal(normalize(input), path.normalize(input), `input: ${input}`);
  }
});

test('normalize should keep leading double-dot segments on relative paths', () => {
  assert.equal(normalize('../../a/b'), '../../a/b');
  assert.equal(normalize('../..'), '../..');
});

test('normalize should clamp absolute path traversal to root', () => {
  assert.equal(normalize('/../../a'), '/a');
  assert.equal(normalize('/../../../'), '/');
});
