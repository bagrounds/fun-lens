;(() => {
  'use strict'

  /* imports */
  const { map, append } = require('fun-array')
  const { sync } = require('fun-test')
  const { equalDeep } = require('fun-predicate')
  const { get } = require('fun-object')
  const arrange = require('fun-arrange')
  const { pipeAll } = require('fun-function')

  const equalityTests = map(
    pipeAll([
      append(get('get')),
      arrange({ inputs: 0, predicate: 1, contra: 2 })
    ]),
    [
      [[['a'], { a: 1 }], equalDeep(1)],
      [[[1], [8, 3]], equalDeep(3)],
      [[[[2]], n => n * 2], equalDeep(4)],
      [[['a'], { a: [1] }], equalDeep([1])],
      [[['a', 0], { a: [1] }], equalDeep(1)],
      [[['a', 0, [2]], { a: [x => x * 2] }], equalDeep(4)],
      [[['a', 0, [2]], { a: [x => [x, x * 2]] }], equalDeep([2, 4])],
      [[['a', 0, [2], 1], { a: [x => [x, x * 2]] }], equalDeep(4)]
    ]
  )

  /* exports */
  module.exports = map(sync, equalityTests)
})()

