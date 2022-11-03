/**
 * @module index
 */

import { flatten, match } from '../esm/router.js';

const routes = [
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

console.time('benchmark');
for (let i = 0; i < 100; i++) {
  flatten(routes, '/zh');
}
console.timeEnd('benchmark');

console.time('flatten');
const branches = flatten(routes, '/zh');
console.timeEnd('flatten');

console.log('branches:', branches);

console.time('match');
const matched = match(branches, '/zh/courses/1');
console.timeEnd('match');

console.log('matched:', matched);
