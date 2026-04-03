/**
 * @module index
 */

import './normalize.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import type { Route } from '../esm/interface.js';
import { flatten, match } from '../esm/router.js';

const routes: Route<{ id: number }>[] = [
  {
    path: '/login',
    meta: { id: 1 },
    element: '<Login />'
  },
  {
    path: '/',
    meta: { id: 2 },
    element: '<Layout />',
    children: [
      {
        index: true,
        meta: { id: 6 },
        element: '<Home />'
      },
      {
        meta: { id: 3 },
        path: 'courses',
        element: '<Courses />',
        children: [
          {
            index: true,
            meta: { id: 4 },
            element: '<CoursesIndex />'
          },
          {
            meta: { id: 5 },
            path: '/courses/:id',
            element: '<CoursesDetails />'
          }
        ]
      }
    ]
  },
  { path: '*', meta: { id: 7 }, element: '<NoMatch />' }
];

test('flatten should generate route branches with basename', () => {
  const branches = flatten(routes, '/zh');

  assert.ok(branches.length > 0);
  assert.ok(branches.every(branch => branch.basename === '/zh'));
});

test('match should match nested dynamic route and collect params', () => {
  const branches = flatten(routes, '/zh');
  const result = match(branches, '/zh/courses/1');

  assert.ok(result);
  assert.equal(result.path, '/zh/courses/:id');
  assert.deepEqual(result.params, { id: '1' });
  assert.equal(result.matches.at(-1)?.meta?.id, 5);
});

test('match should match index route under layout', () => {
  const branches = flatten(routes, '/zh');
  const result = match(branches, '/zh');

  assert.ok(result);
  assert.equal(result.path, '/zh/');
  assert.equal(result.matches.at(-1)?.meta?.id, 6);
});

test('match should fallback to wildcard route when no route matches', () => {
  const branches = flatten(routes, '/zh');
  const result = match(branches, '/zh/unknown/path');

  assert.ok(result);
  assert.equal(result.path, '/zh/*');
  assert.equal(result.matches.at(-1)?.meta?.id, 7);
});
