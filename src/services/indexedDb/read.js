const db = require('./db')
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

  const lastProfileCacheTimestamp = profile.lastProfileCacheTimestamp

  debug('getLastProfileCacheTimestamp returns', lastProfileCacheTimestamp)

  return lastProfileCacheTimestamp
}

const getLoggedInSubscriptionsCache = async (account) => {
  debug('getLoggedInSubscriptionsCache', {account})

  const res = await db
    .db
    .transaction(['loggedInSubscriptions'])
    .objectStore('loggedInSubscriptions')
    .get(account)

  const subscriptions = res && res.subscriptions

  debug('getLoggedInSubscriptionsCache returns', subscriptions)

  return subscriptions
}

const getLastLoggedInSubscriptionsCacheTimestamp = async (account) => {
  debug('getLastLoggedInSubscriptionsCacheTimestamp', {account})

  const res = await db
    .db
    .transaction(['loggedInSubscriptions'])
    .objectStore('loggedInSubscriptions')
    .get(account)

  const lastLoggedInSubscriptionsCacheTimestamp = res && res.lastLoggedInSubscriptionsCacheTimestamp

  debug('getLastLoggedInSubscriptionsCacheTimestamp returns', lastLoggedInSubscriptionsCacheTimestamp)

  return lastLoggedInSubscriptionsCacheTimestamp
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

const getFeedCache = async () => {
  debug('getFeedCache')

  const posts = await db
    .db
    .transaction(['feed'])
    .objectStore('feed')
    .get('posts')

  debug('getFeedCache returns', posts)

  return posts
}

const getFeedCacheCount = async () => {
  debug('getFeedCacheCount')

  const posts = await db
    .db
    .transaction(['feed'])
    .objectStore('feed')
    .get('posts')

  const count = (posts) ? posts.length : 0

  debug('getFeedCacheCount returns', count)

  return count
}

const hasMorePostsOnEthereum = async () => {
  debug('hasMorePostsOnEthereum')

  const hasMorePostsOnEthereum = await db
    .db
    .transaction(['feed'])
    .objectStore('feed')
    .get('hasMorePostsOnEthereum')

  debug('hasMorePostsOnEthereum returns', hasMorePostsOnEthereum)

  return hasMorePostsOnEthereum
}

const getLastFeedCacheTimestamp = async () => {
  debug('getLastFeedCacheTimestamp')

  const lastFeedCacheTimestamp = await db
    .db
    .transaction(['feed'])
    .objectStore('feed')
    .get('lastFeedCacheTimestamp')

  debug('getLastFeedCacheTimestamp returns', lastFeedCacheTimestamp)

  return lastFeedCacheTimestamp
}

const getLastFeedCacheCursor = async () => {
  debug('getLastFeedCacheCursor')

  const lastFeedCacheCursor = await db
    .db
    .transaction(['feed'])
    .objectStore('feed')
    .get('lastFeedCacheCursor')

  debug('getLastFeedCacheCursor returns', lastFeedCacheCursor)

  return lastFeedCacheCursor
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

module.exports = {
  getProfileCache,
  getLoggedInSubscriptionsCache,
  getLoggedOutSubscriptions,
  getLastFeedCacheTimestamp,
  getLastLoggedInSubscriptionsCacheTimestamp,
  getLastProfileCacheTimestamp,
  getFeedCache,
  getFeedCacheCount,
  getLastFeedCacheCursor,
  getSettings,
  hasMorePostsOnEthereum
}
