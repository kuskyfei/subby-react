import db from './db'

const setProfileCache = async (profile) => {
  profile.lastProfileCacheTimeStamp = Date.now()

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

const setFeedCache = async ({posts, hasMorePostsOnEthereum, lastFeedCacheCursor}) => {
  const cacheTimeStampKey = (!lastFeedCacheCursor) ? 'lastFeedCacheTimeStamp' : 'lastFeedCacheTimeStampUsingACursor'
  const lastFeedCacheTimeStamp = Date.now()

  const tx = await db
    .db
    .transaction(['feed'], 'readwrite')
    .objectStore('feed')
    .put(posts, 'posts')
    .put(hasMorePostsOnEthereum, 'hasMorePostsOnEthereum')
    .put(lastFeedCacheCursor, 'lastFeedCacheCursor')
    .put(lastFeedCacheTimeStamp, cacheTimeStampKey)

  return tx.complete
}

const setLoggedInSubscriptionsCache = async ({address, username, loggedInSubscriptions}) => {
  if (!username) username = address

  const req = {
    subscriptions: loggedInSubscriptions,
    lastLoggedInSubscriptionsCacheTimeStamp: Date.now()
  }

  const tx = await db
    .db
    .transaction(['loggedInSubscriptions'], 'readwrite')
    .objectStore('loggedInSubscriptions')
    .put(req, username)

  return tx.complete
}

const setLoggedOutSubscriptions = async (loggedOutSubscriptions) => {
  const tx = await db
    .db
    .transaction(['loggedOutSubscriptions'], 'readwrite')
    .objectStore('loggedOutSubscriptions')
    .put(loggedOutSubscriptions, 'subscriptions')

  return tx.complete
}

const setSettings = async (settings) => {
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
  setLoggedInSubscriptionsCache,
  setLoggedOutSubscriptions,
  setSettings
}
