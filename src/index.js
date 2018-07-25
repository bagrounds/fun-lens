/**
 *
 * @module fun-lens
 */
;(() => {
  'use strict'

  /* imports */
  const funFunction = require('fun-function')
  const { curry } = funFunction
  const { some } = require('fun-predicate')
  const funObject = require('fun-object')
  const { ap, map } = funObject
  const { any, num, fun, tuple, object, string, array } = require('fun-type')
  const funArray = require('fun-array')
  const { inputs } = require('guarded')
  const { first } = require('fun-case')

  const choose = role => first([
    [array, funFunction[role]],
    [string, funObject[role]],
    [num, funArray[role]]
  ])

  /**
   *
   * @function module:fun-lens.get
   *
   * @param {Array} keys - to access underlying values
   * @param {Array|Object|Function} source - to access values from
   *
   * @return {*} value at keys
   */
  const get = (keys, source) => keys.reduce(
    (source, key) => choose('get')(key)(source),
    source
  )

  /**
   *
   * @function module:fun-lens.set
   *
   * @param {Array} keys - to access underlying values
   * @param {*} value - to set
   * @param {Array|Object|Function} source - to access values from
   *
   * @return {*} value at keys
   */
  const set = (keys, value, source) =>
    keys.length === 1
      ? choose('set')(keys[0])(value)(source)
      : set(
        keys.slice(0, 1),
        set(keys.slice(1), value, get(keys.slice(0, 1), source)),
        source
      )

  /**
   *
   * @function module:fun-lens.update
   *
   * @param {Array} keys - to access underlying values
   * @param {Function} u - to apply at key
   * @param {Array|Object|Function} source - to update value on
   *
   * @return {*} value at keys
   */
  const update = (keys, u, source) =>
    keys.length === 1
      ? choose('update')(keys[0])(u)(source)
      : update(
        keys.slice(0, 1),
        curry(update)(keys.slice(1), u),
        source
      )

  /* exports */
  const api = { get, set, update }
  const guards = map(inputs, {
    get: tuple([array, some([array, object, fun])]),
    set: tuple([array, any, some([array, object, fun])]),
    update: tuple([array, fun, some([array, object, fun])])
  })

  module.exports = map(curry, ap(guards, api))
})()

