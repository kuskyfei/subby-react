const indexedDb = require('../indexedDb')
const {arrayToObjectWithItemsAsProps} = require('./util')
const {getSubscriptions} = require('./read')
const subbyJs = require('subby.js')
const {updateProfileCache} = require('./cache')

const debug = require('debug')('services:cache:write')

const editProfile = async (...args) => {
  const tx = await subbyJs.editProfile(...args)
  tx.wait().then(async () => {
    const address = await subbyJs.getAddress()
    updateProfileCache(address)
    debug('editProfile cache updated', {address, args})
  })

  return tx
}

const subscribe = async (publisher) => {
  debug('subscribe', {publisher})

  await indexedDb.addToLocalSubscriptions(publisher)
}

const unsubscribe = async (...publishers) => {
  debug('unsubscribe', publishers)

  // we accept an array as first argument or
  // a series of strings
  if (Array.isArray(publishers[0])) {
    publishers = publishers[0]
  }

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

export {
  editProfile,
  setSettings,
  setSubscriptions,
  subscribe,
  unsubscribe
}
