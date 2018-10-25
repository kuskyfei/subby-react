const indexedDb = require('../indexedDb')
const {arrayToObjectWithItemsAsProps} = require('./util')
const {getSubscriptions} = require('./read')
const subbyJs = require('subby.js')

const debug = require('debug')('services:cache:write')

const subscribe = async (publisher) => {
  debug('subscribe', {publisher})

  await indexedDb.addToLocalSubscriptions(publisher)
}

const unsubscribe = async (...publishers) => {
  debug('unsubscribe', publishers)

  for (const publisher of publishers) {
    await indexedDb.removeFromLocalSubscriptions(publisher)
  }
}

const setSubscriptions = async (localSubscriptions) => {
  debug('setSubscriptions', {localSubscriptions})

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

const donate = async ({account, value, text, postId}) => {
  debug('donate', {account, value, text, postId})
  await subbyJs.donate({account, value, text, postId})
}

const publish = async ({link, comment}) => {
  debug('publish', {link, comment})
  await subbyJs.publishPost({link, comment})
}

export {
  setSettings,
  setSubscriptions,
  subscribe,
  unsubscribe,
  donate,
  publish
}
