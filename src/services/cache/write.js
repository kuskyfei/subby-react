// const ethereum = require('../ethereum')
const indexedDb = require('../indexedDb')

const debug = require('debug')('services:cache:write')

const setSettings = async (settings) => {
  debug('setSettings', settings)

  await indexedDb.setSettings(settings)
}

const subscribe = async ({username, address}) => {
  debug('subscribe', {username, address})
}

const setSubscriptions = async ({username, address, loggedInSubscriptions, loggedOutSubscriptions}) => {
  debug('setSubscriptions', {username, address, loggedInSubscriptions, loggedOutSubscriptions})

  await indexedDb.setLoggedInSubscriptionsCache({address, username, loggedInSubscriptions})
  await indexedDb.setLoggedOutSubscriptions(loggedOutSubscriptions)
}

const tip = async ({username, address}) => {
  debug('tip', {username, address})
}

const publish = async (post) => {
  debug('publish', post)
}

export {
  setSettings,
  setSubscriptions,
  subscribe,
  tip,
  publish
}
