;(() => {
  'use strict'

  /* imports */
  const { fold, concat, map, append } = require('fun-array')
  const { sync } = require('fun-test')
  const { equalDeep } = require('fun-predicate')
  const { get } = require('fun-object')
  const arrange = require('fun-arrange')
  const { compose, apply } = require('fun-function')
  const { mul, add } = require('fun-scalar')

  const equalityTests = map(
    arrange({ inputs: 0, predicate: 1, contra: 2 }),
    fold(concat, [], [
      map(append(get('get')), [
        [[['a'], {}], equalDeep(null)],
        [[['a', 'b'], {}], equalDeep(null)],
        [[['a', 1], {}], equalDeep(null)],
        [[['a', [1]], {}], equalDeep(null)],
        [[['a'], { a: 1 }], equalDeep(1)],
        [[[1], [8, 3]], equalDeep(3)],
        [[[[2]], n => n * 2], equalDeep(4)],
        [[[[]], () => 42], equalDeep(42)],
        [[['a'], { a: [1] }], equalDeep([1])],
        [[['a', 0], { a: [1] }], equalDeep(1)],
        [[['a', 0, [2]], { a: [x => x * 2] }], equalDeep(4)],
        [[['a', 0, [2]], { a: [x => [x, x * 2]] }], equalDeep([2, 4])],
        [[['a', 0, [2], 1], { a: [x => [x, x * 2]] }], equalDeep(4)]
      ]),
      map(append(get('set')), [
        [[['a'], 6, { a: 1 }], equalDeep({ a: 6 })],
        [[[1], 9, [8, 3]], equalDeep([8, 9])],
        [
          [[[2]], -1, n => n * 2],
          compose(
            equalDeep(-1),
            apply([2])
          )
        ],
        [
          [[[2]], -1, n => n * 2],
          compose(
            equalDeep(6),
            apply([3])
          )
        ],
        [[['a', 0], 11, { a: [1] }], equalDeep({ a: [11] })],
        [[[0, 'a'], 11, [{ a: 1 }]], equalDeep([{ a: 11 }])],
        [
          [[0, 'a', 1], 11, [{ a: [1, 2] }]],
          equalDeep([{ a: [1, 11] }])
        ],
        [
          [['a', 0, [2], 0], 42, { a: [x => [x, x * 2]] }],
          compose(
            equalDeep([42, 4]),
            ({ a: [f] }) => f(2)
          )
        ],
        [
          [['a', 0, [2], 0], 42, { a: [x => [x, x * 2]] }],
          compose(
            equalDeep([3, 6]),
            ({ a: [f] }) => f(3)
          )
        ]
      ]),
      map(append(get('update')), [
        [[['a'], mul(3), { a: 2 }], equalDeep({ a: 6 })],
        [[[1], add(4), [8, 3]], equalDeep([8, 7])],
        [[[1, 0], add(4), [8, [3]]], equalDeep([8, [7]])],
        [[['a', 0], add(4), { a: [3, 8] }], equalDeep({ a: [7, 8] })],
        [[[1, 'a'], add(4), [8, { a: 3 }]], equalDeep([8, { a: 7 }])],
        [
          [['a', 0, [2], 0], add(3), { a: [x => [x, x * 2]] }],
          compose(
            equalDeep([5, 4]),
            ({ a: [f] }) => f(2)
          )
        ]
      ])
    ])
  )

  /* exports */
  module.exports = map(sync, equalityTests)
})()

