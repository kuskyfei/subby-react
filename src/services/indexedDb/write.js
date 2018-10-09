const db = require('./db').default
const feedCacheBufferSize = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_BUFFER_SIZE

const debug = require('debug')('services:indexedDb:write')

const setProfileCache = async (profile) => {
  debug('setProfileCache', profile)

  profile = {...profile}
  profile.lastProfileCacheTimestamp = Date.now()

  if (profile.username) {
    const key = profile.username
    const tx = await db // eslint-disable-line
      .db
      .transaction(['profiles'], 'readwrite')
      .objectStore('profiles')
      .put(profile, key)
  }

  if (profile.address) {
    const key = profile.address
    const tx = await db // eslint-disable-line
      .db
      .transaction(['profiles'], 'readwrite')
      .objectStore('profiles')
      .put(profile, key)
  }
}

const setFeedCache = async ({posts, nextCache, hasMorePosts}) => {
  debug('setFeedCache', {posts: posts && posts.length, nextCache: nextCache && {postIds: nextCache.postIds && nextCache.postIds.length, nextStartAts: nextCache.nextStartAts && nextCache.nextStartAts.length, nextPublishers: nextCache.nextPublishers && nextCache.nextPublishers.length}, hasMorePosts})

  const lastFeedCacheTimestamp = Date.now()

  const tx = db
    .db
    .transaction(['feed'], 'readwrite')
    .objectStore('feed')

  tx.put(posts, 'posts')
  tx.put(hasMorePosts, 'hasMorePosts')
  tx.put(nextCache, 'nextCache')
  tx.put(lastFeedCacheTimestamp, 'lastFeedCacheTimestamp')

  await tx

  return tx.complete
}

const setEthereumSubscriptionsCache = async ({account, ethereumSubscriptions}) => {
  debug('setEthereumSubscriptionsCache', {account, ethereumSubscriptions})

  const req = {
    subscriptions: ethereumSubscriptions,
    lastEthereumSubscriptionsCacheTimestamp: Date.now()
  }

  const tx = await db
    .db
    .transaction(['ethereumSubscriptions'], 'readwrite')
    .objectStore('ethereumSubscriptions')
    .put(req, account)

  return tx.complete
}

const setLoggedOutSubscriptions = async (loggedOutSubscriptions) => {
  debug('setLoggedOutSubscriptions', loggedOutSubscriptions)

  const tx = await db
    .db
    .transaction(['loggedOutSubscriptions'], 'readwrite')
    .objectStore('loggedOutSubscriptions')
    .put(loggedOutSubscriptions, 'subscriptions')

  return tx.complete
}

const setLoggedInSubscriptions = async ({account, loggedInSubscriptions}) => {
  debug('setLoggedInSubscriptions', {account, loggedInSubscriptions})

  const tx = await db
    .db
    .transaction(['loggedInSubscriptions'], 'readwrite')
    .objectStore('loggedInSubscriptions')
    .put(loggedInSubscriptions, account)

  return tx.complete
}

const setSettings = async (settings) => {
  debug('setSettings', settings)

  const tx = await db
    .db
    .transaction(['settings'], 'readwrite')
    .objectStore('settings')
    .put(settings, 'settings')

  return tx.complete
}

export {
  setProfileCache,
  setFeedCache,
  setEthereumSubscriptionsCache,
  setLoggedOutSubscriptions,
  setLoggedInSubscriptions,
  setSettings
}
