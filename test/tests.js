;(() => {
  'use strict'

  /* imports */
  const { map } = require('fun-array')
  const { sync } = require('fun-test')
  const { equalDeep } = require('fun-predicate')
  const { get } = require('fun-object')

  const equalityTests = [
    {
      inputs: [['a'], { a: 1 }],
      predicate: equalDeep(1),
      contra: get('get')
    },
    {
      inputs: [[1], [8, 3]],
      predicate: equalDeep(3),
      contra: get('get')
    },
    {
      inputs: [[[2]], n => n * 2],
      predicate: equalDeep(4),
      contra: get('get')
    }
  ]

  /* exports */
  module.exports = map(sync, equalityTests)
})()

