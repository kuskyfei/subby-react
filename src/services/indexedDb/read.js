import db from './db'
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

const getProfileCache = async ({username, address}) => {
  debug('getProfileCache', {username, address})

  if (!username) username = address

  const profile = await db
    .db
    .transaction(['profiles'])
    .objectStore('profiles')
    .get(username)

  debug('getProfileCache returns', profile)

  return profile
}

const getLastProfileCacheTimeStamp = async ({username, address}) => {
  debug('getLastProfileCacheTimeStamp', {username, address})

  if (!username) username = address

  const profile = await db
    .db
    .transaction(['profiles'])
    .objectStore('profiles')
    .get(username)

  const lastProfileCacheTimeStamp = profile.lastProfileCacheTimeStamp

  debug('getLastProfileCacheTimeStamp returns', lastProfileCacheTimeStamp)

  return lastProfileCacheTimeStamp
}

const getLoggedInSubscriptionsCache = async ({username, address}) => {
  debug('getLoggedInSubscriptionsCache', {username, address})

  if (!username) username = address

  const res = await db
    .db
    .transaction(['loggedInSubscriptions'])
    .objectStore('loggedInSubscriptions')
    .get(username)

  const subscriptions = res.subscriptions

  debug('getLoggedInSubscriptionsCache returns', subscriptions)

  return subscriptions
}

const getLastLoggedInSubscriptionsCacheTimeStamp = async ({username, address}) => {
  debug('getLastLoggedInSubscriptionsCacheTimeStamp', {username, address})

  if (!username) username = address

  const res = await db
    .db
    .transaction(['loggedInSubscriptions'])
    .objectStore('loggedInSubscriptions')
    .get(username)

  const lastLoggedInSubscriptionsCacheTimeStamp = res.lastLoggedInSubscriptionsCacheTimeStamp

  debug('getLastLoggedInSubscriptionsCacheTimeStamp returns', lastLoggedInSubscriptionsCacheTimeStamp)

  return lastLoggedInSubscriptionsCacheTimeStamp
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

const getLastFeedCacheTimeStamp = async () => {
  debug('getLastFeedCacheTimeStamp')

  const lastFeedCacheTimeStamp = await db
    .db
    .transaction(['feed'])
    .objectStore('feed')
    .get('lastFeedCacheTimeStamp')

  debug('getLastFeedCacheTimeStamp returns', lastFeedCacheTimeStamp)

  return lastFeedCacheTimeStamp
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

export {
  getProfileCache,
  getLoggedInSubscriptionsCache,
  getLoggedOutSubscriptions,
  getLastFeedCacheTimeStamp,
  getLastLoggedInSubscriptionsCacheTimeStamp,
  getLastProfileCacheTimeStamp,
  getFeedCache,
  getFeedCacheCount,
  getLastFeedCacheCursor,
  getSettings,
  hasMorePostsOnEthereum
}
