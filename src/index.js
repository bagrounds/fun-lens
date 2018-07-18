/**
 *
 * @module fun-lens
 */
;(() => {
  'use strict'

  /* imports */
  const { curry, apply } = require('fun-function')
  const { some } = require('fun-predicate')
  const { ap, map, get: objectGet } = require('fun-object')
  const { fun, tuple, object, string, array } = require('fun-type')
  const { get: arrayGet } = require('fun-array')
  const { inputs } = require('guarded')

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
    (source, key) => (array(key)
      ? apply
      : string(key)
        ? objectGet
        : arrayGet
    )(key)(source),
    source
  )

  /* exports */
  const api = { get }
  const guards = map(inputs, {
    get: tuple([array, some([array, object, fun])])
  })

  module.exports = map(curry, ap(guards, api))
})()

