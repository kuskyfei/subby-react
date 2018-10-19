const indexedDb = require('../indexedDb')
const {arrayToObjectWithItemsAsProps} = require('./util')
const {getSubscriptions} = require('./read')

const debug = require('debug')('services:cache:write')

const subscribe = async ({publisher, address}) => {
  debug('subscribe', {publisher, address})

  await indexedDb.addToLocalSubscriptions(publisher)

  if (!address) {
    return
  }

  const subscriptions = await getSubscriptions(address)
  const {ethereumSubscriptions} = subscriptions
  
  let changed = false
  if (!ethereumSubscriptions[publisher]) {
    return
  }
  if (!ethereumSubscriptions[publisher].pendingDeletion) {
    return
  }

  delete ethereumSubscriptions[publisher].pendingDeletion
  changed = true

  if (changed) {
    await indexedDb.setEthereumSubscriptionsCache({address, ethereumSubscriptions})
  }
}

const unsubscribe = async ({publishers, address}) => {
  debug('unsubscribe', publishers, address)

  for (const publisher of publishers) {
    await indexedDb.removeFromLocalSubscriptions(publisher)
  }

  if (!address) {
    return
  }

  const subscriptions = await getSubscriptions(address)
  const {ethereumSubscriptions} = subscriptions
  
  let changed = false
  for (const publisher of publishers) {
    if (!ethereumSubscriptions[publisher]) {
      continue
    }
    if (ethereumSubscriptions[publisher].pendingDeletion) {
      continue
    }
    ethereumSubscriptions[publisher].pendingDeletion =  true
    changed = true
  }

  if (changed) {
    await indexedDb.setEthereumSubscriptionsCache({address, ethereumSubscriptions})
  }
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
