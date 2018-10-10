const db = require('./db').default
const {isObjectStoreName} = require('./util')
const debug = require('debug')('services:indexedDb:read')

const getEverything = async () => {
  const objectStoreNamesResponse = db.db.objectStoreNames
  const objectStoreNames = []

  for (const res in objectStoreNamesResponse) {
    if (isObjectStoreName(res)) {
      objectStoreNames.push(objectStoreNamesResponse[res])
    }
  }

  const everything = {}

  for (const objectStoreName of objectStoreNames) {
    const keys = await db
      .db
      .transaction(objectStoreName)
      .objectStore(objectStoreName)
      .getAllKeys()

    const objectsInObjectStoreName = {}

    for (const key of keys) {
      const objectInObjectStoreName = await db
        .db
        .transaction([objectStoreName])
        .objectStore(objectStoreName)
        .get(key)

      objectsInObjectStoreName[key] = objectInObjectStoreName
    }

    everything[objectStoreName] = objectsInObjectStoreName
  }

  return everything
}
// getEverything method is used for debugging
window.SUBBY_DEBUG_INDEXEDDB = getEverything

const getProfileCache = async (account) => {
  debug('getProfileCache', {account})

  const profile = await db
    .db
    .transaction(['profiles'])
    .objectStore('profiles')
    .get(account)

  debug('getProfileCache returns', profile)

  return profile
}

const getLastProfileCacheTimestamp = async (account) => {
  debug('getLastProfileCacheTimestamp', {account})

  const profile = await db
    .db
    .transaction(['profiles'])
    .objectStore('profiles')
    .get(account)

  const lastProfileCacheTimestamp = profile && profile.lastProfileCacheTimestamp

  debug('getLastProfileCacheTimestamp returns', lastProfileCacheTimestamp)

  return lastProfileCacheTimestamp
}

const getEthereumSubscriptionsCache = async (account) => {
  debug('getEthereumSubscriptionsCache', {account})

  const res = await db
    .db
    .transaction(['ethereumSubscriptions'])
    .objectStore('ethereumSubscriptions')
    .get(account)

  const subscriptions = res && res.subscriptions

  debug('getEthereumSubscriptionsCache returns', subscriptions)

  return subscriptions
}

const getLastEthereumSubscriptionsCacheTimestamp = async (account) => {
  debug('getLastEthereumSubscriptionsCacheTimestamp', {account})

  const res = await db
    .db
    .transaction(['ethereumSubscriptions'])
    .objectStore('ethereumSubscriptions')
    .get(account)

  const lastEthereumSubscriptionsCacheTimestamp = res && res.lastEthereumSubscriptionsCacheTimestamp

  debug('getLastEthereumSubscriptionsCacheTimestamp returns', lastEthereumSubscriptionsCacheTimestamp)

  return lastEthereumSubscriptionsCacheTimestamp
}

const getLoggedOutSubscriptions = async () => {
  debug('getLoggedOutSubscriptions')

  const subscriptions = await db
    .db
    .transaction(['loggedOutSubscriptions'])
    .objectStore('loggedOutSubscriptions')
    .get('subscriptions')

  debug('getLoggedOutSubscriptions returns', subscriptions)

  return subscriptions
}

const getLoggedInSubscriptions = async (account) => {
  debug('getLoggedInSubscriptions', {account})

  const res = await db
    .db
    .transaction(['loggedInSubscriptions'])
    .objectStore('loggedInSubscriptions')
    .get(account)

  const subscriptions = res && res.subscriptions

  debug('getLoggedInSubscriptions returns', subscriptions)

  return subscriptions
}

const getBackgroundFeedCache = async () => {
  debug('getBackgroundFeedCache')

  const tx = db
    .db
    .transaction(['backgroundFeed'])
    .objectStore('backgroundFeed')

  const posts = await tx.get('posts')
  const nextCache = await tx.get('nextCache')
  const hasMorePosts = await tx.get('hasMorePosts')

  const feedCache = {
    posts,
    nextCache,
    hasMorePosts
  }

  debug('getBackgroundFeedCache returns', {posts: posts && posts.length, nextCache: nextCache && {postIds: nextCache.postIds && nextCache.postIds.length, nextStartAts: nextCache.nextStartAts && nextCache.nextStartAts.length, nextPublishers: nextCache.nextPublishers && nextCache.nextPublishers.length}, hasMorePosts})

  return feedCache
}

const getLastBackgroundFeedCacheTimestamp = async () => {
  debug('getLastBackgroundFeedCacheTimestamp')

  const lastBackgroundFeedCacheTimestamp = await db
    .db
    .transaction(['backgroundFeed'])
    .objectStore('backgroundFeed')
    .get('lastBackgroundFeedCacheTimestamp')

  debug('getLastBackgroundFeedCacheTimestamp returns', lastBackgroundFeedCacheTimestamp)

  return lastBackgroundFeedCacheTimestamp
}


const getActiveFeedCache = async () => {
  debug('getActiveFeedCache')

  const tx = db
    .db
    .transaction(['activeFeed'])
    .objectStore('activeFeed')

  const posts = await tx.get('posts')
  const nextCache = await tx.get('nextCache')
  const hasMorePosts = await tx.get('hasMorePosts')

  const feedCache = {
    posts,
    nextCache,
    hasMorePosts
  }

  debug('getActiveFeedCache returns', {posts: posts && posts.length, nextCache: nextCache && {postIds: nextCache.postIds && nextCache.postIds.length, nextStartAts: nextCache.nextStartAts && nextCache.nextStartAts.length, nextPublishers: nextCache.nextPublishers && nextCache.nextPublishers.length}, hasMorePosts})

  return feedCache
}

const getLastActiveFeedCacheTimestamp = async () => {
  debug('getLastActiveFeedCacheTimestamp')

  const lastActiveFeedCacheTimestamp = await db
    .db
    .transaction(['backgroundFeed'])
    .objectStore('backgroundFeed')
    .get('lastActiveFeedCacheTimestamp')

  debug('getLastActiveFeedCacheTimestamp returns', lastActiveFeedCacheTimestamp)

  return lastActiveFeedCacheTimestamp
}

const getSettings = async () => {
  debug('getSettings')

  const settings = await db
    .db
    .transaction(['settings'])
    .objectStore('settings')
    .get('settings')

  debug('getSettings returns', settings)

  return settings
}

export {
  getProfileCache,
  getEthereumSubscriptionsCache,
  getLoggedInSubscriptions,
  getLoggedOutSubscriptions,
  getLastEthereumSubscriptionsCacheTimestamp,
  getLastProfileCacheTimestamp,
  getBackgroundFeedCache,
  getLastBackgroundFeedCacheTimestamp,
  getActiveFeedCache,
  getLastActiveFeedCacheTimestamp,
  getSettings,
}
