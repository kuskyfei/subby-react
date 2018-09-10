import db from './db'

const setProfileCache = async (profile) => {

  const key = profile.username || profile.address

  const tx = await db
    .db
    .transaction(['profiles'], 'readwrite')
    .objectStore('profiles')
    .put(profile, key)

  return tx.complete
}

const setFeedCache = async ({posts, hasMorePostsOnEthereum, lastFeedCacheCursor}) => {

  const tx = await db
    .db
    .transaction(['feed'], 'readwrite')
    .objectStore('feed')
    .put(posts, 'posts')
    .put(hasMorePostsOnEthereum, 'hasMorePostsOnEthereum')
    .put(lastFeedCacheCursor, 'lastFeedCacheCursor')

  return tx.complete
}

const setLoggedInSubscriptionsCache = async ({address, username, loggedInSubscriptions}) => {

  console.log({address, username, loggedInSubscriptions})

  if (!username) username = address

  console.log({username, loggedInSubscriptions})

  console.log(db)
  console.log(db.db)
  console.log(Object.keys(db))

  const tx = await db
    .db
    .transaction(['loggedInSubscriptions'], 'readwrite')
    .objectStore('loggedInSubscriptions')
    .put(loggedInSubscriptions, username)

  return tx.complete
}

const setLoggedOutSubscriptions = async (loggedOutSubscriptions) => {

  const tx = await db
    .db
    .transaction(['loggedOutSubscriptions'], 'readwrite')
    .objectStore('loggedOutSubscriptions')
    .put(loggedInSubscriptions, 'subscriptions')

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
