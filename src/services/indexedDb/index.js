const write = require('./write')
const read = require('./read')
const {init} = require('./db').default

module.exports = {...read, ...write, init}

// for Jest unit tests or for integration tests, you
// can mock this entire module using the settings below
const settings = require('../../settings')
if (settings.MOCK_INDEXEDDB) {
  const mock = require('./test/mock')
  module.exports = mock
}
