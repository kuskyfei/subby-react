const subbyJs = require('subby.js')
const indexedDb = require('../indexedDb')

const debug = require('debug')('services:cache:cache')

const profileCacheTime = window.SUBBY_GLOBAL_SETTINGS.PROFILE_CACHE_TIME
const lastLoggedSubscriptionsCacheTime = window.SUBBY_GLOBAL_SETTINGS.LOGGED_IN_SUBSCRIPTIONS_CACHE_TIME
const feedCacheTime = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_TIME
// const feedCachedPreemptivelyCount = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHED_PREEMPTIVELY_COUNT
const minimumUnreadFeedCachedCount = window.SUBBY_GLOBAL_SETTINGS.MINIMUM_UNREAD_FEED_CACHED_COUNT

const updateCache = async (account) => {
  debug('updateCache')

  if (await profileCacheIsExpired(account)) {
    await updateProfileCache(account)
  }
  if (await loggedInSubscriptionsCacheIsExpired(account)) {
    await updateSubscriptionsCache(account)
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

const profileCacheIsExpired = async (account) => {
  debug('profileCacheIsExpired', {account})

  const lastProfileCacheTimeStamp = await indexedDb.getLastProfileCacheTimeStamp(account)
  if (!lastProfileCacheTimeStamp) return true

  const expiresAtTimestamp = Date.now() - profileCacheTime
  const profileCacheIsExpired = lastProfileCacheTimeStamp > expiresAtTimestamp

  debug('profileCacheIsExpired returns', profileCacheIsExpired)

  return profileCacheIsExpired
}

const loggedInSubscriptionsCacheIsExpired = async (account) => {
  debug('loggedInSubscriptionsCacheIsExpired', {account})

  const lastLoggedInSubscriptionsCacheTimeStamp = await indexedDb.getLastLoggedInSubscriptionsCacheTimeStamp(account)
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
  const posts = await subbyJs.getPostsFromPublishers(postQuery)
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
