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
            path: ':id',
            element: '<CoursesDetails />'
          }
        ]
      }
    ]
  },
  { path: '*', meta: { id: 7 }, element: '<NoMatch />' }
];

const basename = '/zh/';
const branches = flatten(routes);

test('flatten should generate route branches', () => {
  assert.ok(branches.length > 0);
  assert.ok(Array.isArray(branches));
});

test('match should match nested dynamic route and collect params', () => {
  const result = match(branches, basename, '/zh/courses/1');

  assert.ok(result);
  assert.equal(result.path, '/courses/:id');
  assert.deepEqual(result.params, { id: '1' });
  assert.equal(result.basename, basename);
  assert.equal(result.pathname, '/zh/courses/1');
  assert.equal(result.matches.at(-1)?.meta?.id, 5);
});

test('match should match index route under layout', () => {
  const result = match(branches, basename, '/zh');

  console.log(branches);

  assert.ok(result);
  assert.equal(result.path, '/');
  assert.equal(result.basename, basename);
  assert.equal(result.pathname, '/zh');
  assert.equal(result.matches.at(-1)?.meta?.id, 6);
});

test('match should match login route', () => {
  const result = match(branches, basename, '/zh/login');

  assert.ok(result);
  assert.equal(result.path, '/login');
  assert.equal(result.basename, basename);
  assert.equal(result.pathname, '/zh/login');
  assert.equal(result.matches.at(-1)?.meta?.id, 1);
});

test('match should fallback to wildcard route when no route matches', () => {
  const result = match(branches, basename, '/zh/unknown/path');

  assert.ok(result);
  assert.equal(result.path, '/*');
  assert.equal(result.basename, basename);
  assert.equal(result.pathname, '/zh/unknown/path');
  assert.equal(result.matches.at(-1)?.meta?.id, 7);
});

test('match should return null when pathname does not start with basename', () => {
  const result = match(branches, basename, '/en/courses/1');

  assert.equal(result, null);
});

test('match should handle case insensitive matching', () => {
  const caseInsensitiveRoutes: Route<{ id: number }>[] = [
    {
      path: '/About',
      meta: { id: 10 },
      element: '<About />',
      sensitive: false
    }
  ];

  const caseInsensitiveBranches = flatten(caseInsensitiveRoutes);
  const result = match(caseInsensitiveBranches, '/', '/about');

  assert.ok(result);
  assert.equal(result.path, '/About');
  assert.equal(result.matches.at(-1)?.meta?.id, 10);
});

test('match should handle case sensitive matching', () => {
  const caseSensitiveRoutes: Route<{ id: number }>[] = [
    {
      path: '/About',
      meta: { id: 11 },
      element: '<About />',
      sensitive: true
    }
  ];

  const caseSensitiveBranches = flatten(caseSensitiveRoutes);

  const matchedResult = match(caseSensitiveBranches, '/', '/About');
  assert.ok(matchedResult);
  assert.equal(matchedResult.path, '/About');

  const notMatchedResult = match(caseSensitiveBranches, '/', '/about');
  assert.equal(notMatchedResult, null);
});

test('match should preserve full pathname in result', () => {
  const result = match(branches, basename, '/zh/courses/123');

  assert.ok(result);
  assert.equal(result.pathname, '/zh/courses/123');
  assert.equal(result.params.id, '123');
});
