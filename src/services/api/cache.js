const ethereum = require('../ethereum')
const indexedDb = require('../indexedDb')

const debug = require('debug')('services:api:cache')

const profileCacheTime = window.SUBBY_GLOBAL_SETTINGS.PROFILE_CACHE_TIME
const lastLoggedSubscriptionsCacheTime = window.SUBBY_GLOBAL_SETTINGS.LOGGED_IN_SUBSCRIPTIONS_CACHE_TIME
const feedCacheTime = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_TIME
// const feedCachedPreemptivelyCount = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHED_PREEMPTIVELY_COUNT
const minimumUnreadFeedCachedCount = window.SUBBY_GLOBAL_SETTINGS.MINIMUM_UNREAD_FEED_CACHED_COUNT

const updateCache = async ({username, address}) => {
  debug('updateCache')

  if (await profileCacheIsExpired({username, address})) {
    await updateProfileCache({username, address})
  }
  if (await loggedInSubscriptionsCacheIsExpired({username, address})) {
    await updateSubscriptionsCache({username, address})
  }
  if (await feedCacheIsExpired()) {
    await updateFeedCache()
  }
}

const updateProfileCache = () => {
  debug('updateProfileCache')
}

const updateSubscriptionsCache = () => {
  debug('updateSubscriptionsCache')
}

const updateFeedCache = () => {
  debug('updateFeedCache')
}

const profileCacheIsExpired = async ({username, address}) => {
  debug('profileCacheIsExpired', {username, address})

  const lastProfileCacheTimeStamp = await indexedDb.getLastProfileCacheTimeStamp({username, address})
  if (!lastProfileCacheTimeStamp) return true

  const expiresAtTimestamp = Date.now() - profileCacheTime
  const profileCacheIsExpired = lastProfileCacheTimeStamp > expiresAtTimestamp

  debug('profileCacheIsExpired returns', profileCacheIsExpired)

  return profileCacheIsExpired
}

const loggedInSubscriptionsCacheIsExpired = async ({username, address}) => {
  debug('loggedInSubscriptionsCacheIsExpired', {username, address})

  const lastLoggedInSubscriptionsCacheTimeStamp = await indexedDb.getLastLoggedInSubscriptionsCacheTimeStamp({username, address})
  if (!lastLoggedInSubscriptionsCacheTimeStamp) return true

  const expiresAtTimestamp = Date.now() - lastLoggedSubscriptionsCacheTime
  const loggedInSubscriptionsCacheIsExpired = lastLoggedInSubscriptionsCacheTimeStamp > expiresAtTimestamp

  debug('loggedInSubscriptionsCacheIsExpired returns', loggedInSubscriptionsCacheIsExpired)

  return loggedInSubscriptionsCacheIsExpired
}

const feedCacheIsExpired = async () => {
  debug('feedCacheIsExpired')

  const lastPostCacheTimeStamp = await indexedDb.getLastFeedCacheTimeStamp()
  if (!lastPostCacheTimeStamp) return true

  const expiresAtTimestamp = Date.now() - feedCacheTime
  const feedCacheIsExpired = lastPostCacheTimeStamp > expiresAtTimestamp

  debug('feedCacheIsExpired returns', feedCacheIsExpired)

  return feedCacheIsExpired
}

const feedCacheNeedsMorePosts = async ({startAt, count}) => {
  debug('feedCacheNeedsMorePosts', {startAt, count})

  const postCacheCount = await indexedDb.getFeedCacheCount()
  const lastPostQueried = startAt + count
  const remainingPostsInCacheCount = postCacheCount - lastPostQueried
  const feedCacheNeedsMorePosts = remainingPostsInCacheCount < minimumUnreadFeedCachedCount

  debug('feedCacheNeedsMorePosts returns', feedCacheNeedsMorePosts)

  return feedCacheNeedsMorePosts
}

const addPostsToFeedCache = async ({userSubscriptions, addressSubscriptions, startAt, count, cursor, beforeTimestamp, afterTimestamp}) => {
  debug('addPostsToFeedCache', {userSubscriptions, addressSubscriptions, startAt, count, cursor, beforeTimestamp, afterTimestamp})

  const postQuery = {userSubscriptions, addressSubscriptions, startAt, count, cursor, beforeTimestamp, afterTimestamp}
  const posts = await ethereum.getPosts(postQuery)
  // this needs to be updated when the final cursor design is decided
  await indexedDb.setFeedCache({posts, hasMorePostsOnEthereum: true, lastFeedCacheCursor: null})
}

export {
  updateCache,
  updateProfileCache,
  updateSubscriptionsCache,
  updateFeedCache,
  profileCacheIsExpired,
  loggedInSubscriptionsCacheIsExpired,
  feedCacheIsExpired,
  feedCacheNeedsMorePosts,
  addPostsToFeedCache
}
