const {init, setWeb3} = require('./init')
const {events} = require('./events')
const {getBlockNumber} = require('./util')
const {
  getProfileFromUsername,
  getProfileFromAddress,
  getSubscriptionsFromAddress,
  getSubscriptionsFromUsername,
  getPosts,
  post
} = require('./read')

module.exports = {
  init,
  setWeb3,
  getBlockNumber,
  events,

  getProfileFromUsername,
  getProfileFromAddress,
  getSubscriptionsFromAddress,
  getSubscriptionsFromUsername,
  getPosts,
  post
}

// for Jest unit tests or for integration tests, you
// can mock this entire module using the settings below
const {settings} = require('../../settings')
console.log(settings)
if (settings.MOCK_ETHEREUM) {
  const mock = require('./test/mock')
  module.exports = mock
}
