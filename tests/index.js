/**
 * @module index
 */

const { flatten, match } = require('../cjs/development');

const routes = [
  { path: '/login', meta: { id: 1 }, element: '<Login />' },
  {
    path: '/',
    meta: { id: 2 },
    element: '<Layout />',
    children: [
      {
        path: 'courses',
        meta: { id: 3 },
        element: '<Courses />',
        children: [
          { index: true, meta: { id: 4 }, element: '<CoursesIndex />' },
          { path: '/courses/:id', meta: { id: 5 }, element: '<Course />' }
        ]
      },
      { index: true, meta: { id: 6 }, element: '<Home />' }
    ]
  },
  { path: '*', meta: { id: 7 }, element: '<LayoutNoMatch />' }
];

console.time('benchmark');
for (let i = 0; i < 100; i++) {
  flatten(routes);
}
console.timeEnd('benchmark');

console.time('flatten');
const branches = flatten(routes);
console.timeEnd('flatten');

console.log('branches:', branches);

console.time('match');
const matched = match(branches, '/courses/1');
console.timeEnd('match');

console.log('matched:', matched);
