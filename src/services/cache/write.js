// const ethereum = require('../ethereum')
const indexedDb = require('../indexedDb')

const debug = require('debug')('services:cache:write')

const setSettings = async (settings) => {
  debug('setSettings', settings)

  await indexedDb.setSettings(settings)
}

const subscribe = async (account) => {
  debug('subscribe', account)
}

const setSubscriptions = async ({account, loggedInSubscriptions, loggedOutSubscriptions}) => {
  debug('setSubscriptions', {account, loggedInSubscriptions, loggedOutSubscriptions})

  await indexedDb.setLoggedInSubscriptionsCache({account, loggedInSubscriptions})
  await indexedDb.setLoggedOutSubscriptions(loggedOutSubscriptions)
}

const donate = async (account, value, message) => {
  debug('tip', {account, value, message})
}

const publish = async (post) => {
  debug('publish', post)
}

module.exports = {
  setSettings,
  setSubscriptions,
  subscribe,
  donate,
  publish
}
