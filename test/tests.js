;(() => {
  'use strict'

  /* imports */
  const { prepend, length, index, get: aGet, flatten, fold, concat, map,
    append, flatMap } =
    require('fun-array')
  const { sync } = require('fun-test')
  const { equalDeep: equal } = require('fun-predicate')
  const { get, map: oMap, keys } = require('fun-object')
  const arrange = require('fun-arrange')
  const { compose, curry, apply } = require('fun-function')
  const { mul, add } = require('fun-scalar')
  const { array, object } = require('fun-type')

  const { getSet, setGet, setSet } = (() => {
    /* eslint-disable max-params */
    const getSet = ({ get, set }, eq, p, s) =>
      ((set, get) => eq(set(get(s), s), s))(set(p), get(p))
    const setGet = ({ get, set }, eq, p, a, s) =>
      ((set, get) => eq(get(set(a, s)), a))(set(p), get(p))
    const setSet = ({ get, set }, eq, p, a1, a2, s) =>
      ((set, get) => eq(set(a1, set(a2, s)), set(a1, s)))(set(p), get(p))
    /* eslint-enable max-params */

    const api = { getSet, setGet, setSet }
    return oMap(curry, api)
  })()

  const paths = o => {
    const _get = array(o) ? aGet : get
    const _keys = array(o) ? compose(index, length) : keys

    return (!(array(o)) && !(object(o)))
      ? [[]]
      : flatMap(k => map(prepend(k), paths(_get(k, o))), _keys(o))
  }

  const x = { a: [0, { b: 42, c: [1, 2] }, 9], b: 1 }
  const xPaths = paths(x)

  const propertyTests = map(
    compose(
      arrange({ inputs: 0, contra: 1, predicate: 2 }),
      append(equal(true))
    ),
    flatten([
      map(path => [[equal, path, x], getSet], xPaths),
      map(path => [[equal, path, 'a', x], setGet], xPaths),
      map(path => [[equal, path, 'a1', 'a2', x], setSet], xPaths)
    ]))

  const equalityTests = map(
    arrange({ inputs: 0, predicate: 1, contra: 2 }),
    fold(concat, [], [
      map(append(get('get')), [
        [[['a'], {}], equal(null)],
        [[['a', 'b'], {}], equal(null)],
        [[['a', 1], {}], equal(null)],
        [[['a', [1]], {}], equal(null)],
        [[['a'], { a: 1 }], equal(1)],
        [[[1], [8, 3]], equal(3)],
        [[[[2]], n => n * 2], equal(4)],
        [[[[]], () => 42], equal(42)],
        [[['a'], { a: [1] }], equal([1])],
        [[['a', 0], { a: [1] }], equal(1)],
        [[['a', 0, [2]], { a: [x => x * 2] }], equal(4)],
        [[['a', 0, [2]], { a: [x => [x, x * 2]] }], equal([2, 4])],
        [[['a', 0, [2], 1], { a: [x => [x, x * 2]] }], equal(4)]
      ]),
      map(append(get('set')), [
        [[['a'], 6, { a: 1 }], equal({ a: 6 })],
        [[[1], 9, [8, 3]], equal([8, 9])],
        [
          [[[2]], -1, n => n * 2],
          compose(
            equal(-1),
            apply([2])
          )
        ],
        [
          [[[2]], -1, n => n * 2],
          compose(
            equal(6),
            apply([3])
          )
        ],
        [[['a', 0], 11, { a: [1] }], equal({ a: [11] })],
        [[[0, 'a'], 11, [{ a: 1 }]], equal([{ a: 11 }])],
        [
          [[0, 'a', 1], 11, [{ a: [1, 2] }]],
          equal([{ a: [1, 11] }])
        ],
        [
          [['a', 0, [2], 0], 42, { a: [x => [x, x * 2]] }],
          compose(
            equal([42, 4]),
            ({ a: [f] }) => f(2)
          )
        ],
        [
          [['a', 0, [2], 0], 42, { a: [x => [x, x * 2]] }],
          compose(
            equal([3, 6]),
            ({ a: [f] }) => f(3)
          )
        ]
      ]),
      map(append(get('update')), [
        [[['a'], mul(3), { a: 2 }], equal({ a: 6 })],
        [[[1], add(4), [8, 3]], equal([8, 7])],
        [[[1, 0], add(4), [8, [3]]], equal([8, [7]])],
        [[['a', 0], add(4), { a: [3, 8] }], equal({ a: [7, 8] })],
        [[[1, 'a'], add(4), [8, { a: 3 }]], equal([8, { a: 7 }])],
        [
          [['a', 0, [2], 0], add(3), { a: [x => [x, x * 2]] }],
          compose(
            equal([5, 4]),
            ({ a: [f] }) => f(2)
          )
        ]
      ])
    ])
  )

  /* exports */
  module.exports = map(sync, concat(equalityTests, propertyTests))
})()

