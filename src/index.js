/**
 *
 * @module fun-lens
 */
;(function () {
  'use strict'

  /* imports */
  var predicate = require('fun-predicate')
  var guarded = require('guarded')
  var fn = require('fun-function')
  var array = require('fun-array')
  var object = require('fun-object')

  var isArray = predicate.type('Array')
  var isSource = predicate.type('Array|Object|Function')

  /* exports */
  module.exports = {
    get: fn.curry(guarded({
      inputs: array.ap([isArray, isSource]),
      f: get,
      output: predicate.yes()
    }))
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
      return (predicate.type('Array', key) ? fn.apply : object.get)(key)(source)
    }, source)
  }
})()

