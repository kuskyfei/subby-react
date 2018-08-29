/* global describe, it */

const assert = require('assert')
const {sortBy} = require('../../src/util')

describe('global util', () => {
  it('sortBy should sort by property', async () => {
    let array = [{a: 99904}, {a: 57}, {a: 965}]

    array = sortBy(array, 'a')

    assert.deepEqual(array, [{a: 57}, {a: 965}, {a: 99904}])

    array = sortBy(array, 'a', {order: 'descending'})

    assert.deepEqual(array, [{a: 99904}, {a: 965}, {a: 57}])
  })
})
