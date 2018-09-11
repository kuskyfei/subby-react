import db from './db'
const {isObjectStoreName} = require('./util')
const debug = require('debug')('indexedDb:read')

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
window.SUBBY_INDEXEDDB_DEBUG = getEverything

const getProfileCache = async ({username, address}) => {
  if (!username) username = address

  const res = await db
    .db
    .transaction(['profiles'])
    .objectStore('profiles')
    .get(username)

  debug('getProfileCache', res)

  return res
}

const getLoggedInSubscriptionsCache = () => {

}

const getLoggedOutSubscriptions = () => {

}

const getLastFeedCacheTimeStamp = () => {

}

const getLastLoggedInSubscriptionsCacheTimeStamp = () => {

}

const getLastProfileCacheTimeStamp = () => {

}

const getFeedCache = () => {

}

const getFeedCacheCount = () => {

}

const getLastFeedCacheCursor = () => {

}

const getSettings = () => {

}

const hasMorePostsOnEthereum = () => {

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
