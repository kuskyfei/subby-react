// const ethereum = require('../ethereum')
const indexedDb = require('../indexedDb')

const debug = require('debug')('services:cache:write')

const setSettings = async (settings) => {
  debug('setSettings', settings)

  await indexedDb.setSettings(settings)
}

const subscribe = async ({account, publisher}) => {
  debug('subscribe', account)
}

const unsubscribe = async ({account, publisher}) => {
  debug('subscribe', account)
}

const setSubscriptions = async ({account, loggedInSubscriptions, loggedOutSubscriptions, ethereumSubscriptions}) => {
  debug('setSubscriptions', {account, loggedInSubscriptions, loggedOutSubscriptions, ethereumSubscriptions})

  await indexedDb.setEthereumSubscriptionsCache({account, ethereumSubscriptions})
  await indexedDb.setLoggedInSubscriptions({account, loggedInSubscriptions})
  await indexedDb.setLoggedOutSubscriptions(loggedOutSubscriptions)
}

const donate = async ({account, value, message}) => {
  debug('tip', {account, value, message})
}

const publish = async (post) => {
  debug('publish', post)
}

export {
  setSettings,
  setSubscriptions,
  subscribe,
  donate,
  publish
}
