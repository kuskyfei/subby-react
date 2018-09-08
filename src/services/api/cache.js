const ethereum = require('../ethereum')
const indexDb = require('../indexDb')

const profileCacheTime = window.SUBBY_GLOBAL_SETTINGS.PROFILE_CACHE_TIME
const lastLoggedSubscriptionsCacheTime = window.SUBBY_GLOBAL_SETTINGS.LOGGED_IN_SUBSCRIPTIONS_CACHE_TIME
const feedCacheTime = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_TIME
// const feedCachedPreemptivelyCount = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHED_PREEMPTIVELY_COUNT
const minimumUnreadFeedCachedCount = window.SUBBY_GLOBAL_SETTINGS.MINIMUM_UNREAD_FEED_CACHED_COUNT

const updateCache = async () => {
  if (await indexDb.profileCacheIsExpired()) {
    await updateProfileCache()
  }
  if (await loggedInSubscriptionsCacheIsExpired()) {
    await updateSubscriptionsCache()
  }
  if (await feedCacheIsExpired()) {
    await updateFeedCache()
  }
}

const updateProfileCache = () => {

}

const updateSubscriptionsCache = () => {

}

const updateFeedCache = () => {

}

const profileCacheIsExpired = () => {
  const lastProfileCacheTimeStamp = indexDb.getLastProfileCacheTimeStamp()
  const expiresAtTimestamp = Date.now() - profileCacheTime
  return lastProfileCacheTimeStamp > expiresAtTimestamp
}

const loggedInSubscriptionsCacheIsExpired = () => {
  const lastLoggedInSubscriptionsCacheTimeStamp = indexDb.getLastLoggedInSubscriptionsCacheTimeStamp()
  const expiresAtTimestamp = Date.now() - lastLoggedSubscriptionsCacheTime
  return lastLoggedInSubscriptionsCacheTimeStamp > expiresAtTimestamp
}

const feedCacheIsExpired = () => {
  const lastPostCacheTimeStamp = indexDb.getLastFeedCacheTimeStamp()
  const expiresAtTimestamp = Date.now() - feedCacheTime
  return lastPostCacheTimeStamp > expiresAtTimestamp
}

const feedCacheNeedsMorePosts = async ({startAt, count}) => {
  const postCacheCount = await indexDb.getFeedCacheCount()
  const lastPostQueried = startAt + count
  const remainingPostsInCacheCount = postCacheCount - lastPostQueried

  if (remainingPostsInCacheCount < minimumUnreadFeedCachedCount) {
    return true
  }
}

const addPostsToFeedCache = async ({username, address, subscriptions, startAt, count, cursor}) => {
  const postQuery = {username, address, subscriptions, startAt, count, cursor}
  const posts = await ethereum.getPosts(postQuery)
  indexDb.setFeedCache(posts)
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
