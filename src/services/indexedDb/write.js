const db = require('./db').default

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

const setActiveFeedCache = async ({posts, nextCache, hasMorePosts}) => {
  debug('setActiveFeedCache', {posts: posts && posts.length, nextCache: nextCache && {postIds: nextCache.postIds && nextCache.postIds.length, nextStartAts: nextCache.nextStartAts && nextCache.nextStartAts.length, nextPublishers: nextCache.nextPublishers && nextCache.nextPublishers.length}, hasMorePosts})

  const lastActiveFeedCacheTimestamp = Date.now()

  const tx = db
    .db
    .transaction(['activeFeed'], 'readwrite')
    .objectStore('activeFeed')

  tx.put(posts, 'posts')
  tx.put(hasMorePosts, 'hasMorePosts')
  tx.put(nextCache, 'nextCache')
  tx.put(lastActiveFeedCacheTimestamp, 'lastActiveFeedCacheTimestamp')

  await tx

  return tx.complete
}

const setBackgroundFeedCache = async ({posts, nextCache, hasMorePosts}) => {
  debug('setBackgroundFeedCache', {posts: posts && posts.length, nextCache: nextCache && {postIds: nextCache.postIds && nextCache.postIds.length, nextStartAts: nextCache.nextStartAts && nextCache.nextStartAts.length, nextPublishers: nextCache.nextPublishers && nextCache.nextPublishers.length}, hasMorePosts})

  const lastBackgroundFeedCacheTimestamp = Date.now()

  const tx = db
    .db
    .transaction(['backgroundFeed'], 'readwrite')
    .objectStore('backgroundFeed')

  tx.put(posts, 'posts')
  tx.put(hasMorePosts, 'hasMorePosts')
  tx.put(nextCache, 'nextCache')
  tx.put(lastBackgroundFeedCacheTimestamp, 'lastBackgroundFeedCacheTimestamp')

  await tx

  return tx.complete
}

const setEthereumSubscriptionsCache = async ({address, ethereumSubscriptions}) => {
  debug('setEthereumSubscriptionsCache', {address, ethereumSubscriptions})

  const req = {
    subscriptions: ethereumSubscriptions,
    lastEthereumSubscriptionsCacheTimestamp: Date.now()
  }

  const tx = await db
    .db
    .transaction(['ethereumSubscriptions'], 'readwrite')
    .objectStore('ethereumSubscriptions')
    .put(req, address)

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

const setLoggedInSubscriptions = async ({address, loggedInSubscriptions}) => {
  debug('setLoggedInSubscriptions', {address, loggedInSubscriptions})

  const tx = await db
    .db
    .transaction(['loggedInSubscriptions'], 'readwrite')
    .objectStore('loggedInSubscriptions')
    .put(loggedInSubscriptions, address)

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
  setActiveFeedCache,
  setBackgroundFeedCache,
  setEthereumSubscriptionsCache,
  setLoggedOutSubscriptions,
  setLoggedInSubscriptions,
  setSettings
}
