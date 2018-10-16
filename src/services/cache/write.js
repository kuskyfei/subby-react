const indexedDb = require('../indexedDb')
const {arrayToObjectWithItemsAsProps} = require('./util')

const debug = require('debug')('services:cache:write')

const subscribe = async (publisher) => {
  debug('subscribe', publisher)

  await indexedDb.addToLocalSubscriptions(publisher)
}

const unsubscribe = async (publisher) => {
  debug('unsubscribe', publisher)

  await indexedDb.removeFromLocalSubscriptions(publisher)
}

const setSubscriptions = async (localSubscriptions) => {
  debug('setSubscriptions', localSubscriptions)

  // localSubscriptions can be an array but if so it has to be converted
  if (Array.isArray(localSubscriptions)) {
    localSubscriptions = arrayToObjectWithItemsAsProps(localSubscriptions)
  }

  await indexedDb.setLocalSubscriptions(localSubscriptions)
}

const setSettings = async (settings) => {
  debug('setSettings', settings)

  await indexedDb.setSettings(settings)
}

const donate = async ({account, value, message}) => {
  debug('donate', {account, value, message})
}

const publish = async (post) => {
  debug('publish', post)
}

export {
  setSettings,
  setSubscriptions,
  subscribe,
  unsubscribe,
  donate,
  publish
}
