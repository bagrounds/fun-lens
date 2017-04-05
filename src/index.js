/**
 *
 * @module fun-lens
 */
;(function () {
  'use strict'

  /* imports */
  var curry = require('fun-curry')
  var funCase = require('fun-case')
  var funApply = require('fun-apply')
  var flip = require('fun-flip')
  var funPredicate = require('fun-predicate')
  var guarded = require('guarded')
  var funAssert = require('fun-assert')

  var accessor = funCase([
    {
      p: funPredicate.type('Array'),
      f: curry(flip(funApply))
    },
    {
      p: funPredicate.type('String|Number'),
      f: curry(flip(getProp))
    }
  ])

  var isArray = funAssert.type('Array')
  var isSource = funAssert.type('Array|Object|Function')

  /* exports */
  module.exports = {
    get: guarded({
      inputs: [isArray, isSource],
      f: curry(get),
      output: funAssert.pass(true)
    })
  }

  /**
   *
   * @function module:fun-lens.get
   *
   * @param {Array} keys - to access underlying values
   * @param {Array|Object|Function} source - to access values from
   *
   * @return {*} value at keys
   */
  function get (keys, source) {
    return keys.reduce(function (source, key) {
      return accessor(key)(source)
    }, source)
  }

  function getProp (source, key) {
    return source[key]
  }
})()

