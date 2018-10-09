const subbyJs = require('subby.js')
const indexedDb = require('../indexedDb')
const {cacheIsExpired, publishersMatch} = require('./util')
const debug = require('debug')('services:cache:cache')

const profileCacheTime = window.SUBBY_GLOBAL_SETTINGS.PROFILE_CACHE_TIME
const ethereumSubscriptionsCacheTime = window.SUBBY_GLOBAL_SETTINGS.ETHEREUM_SUBSCRIPTIONS_CACHE_TIME
const feedCacheTime = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_TIME
const feedCacheBufferSize = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_BUFFER_SIZE

const subbyJsPostLimit = 100

const updateCache = async (account) => {
  debug('updateCache')

  if (await profileCacheIsExpired(account)) {
    await updateProfileCache(account)
  }
  if (await ethereumSubscriptionsCacheIsExpired(account)) {
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

const updateFeedCache = async (subscriptions, cb) => {
  debug('updateFeedCache start', {subscriptions})

  await getPostsAndSetFeedCache(subscriptions)

  // the cb will trigger once the async updateFeedCache has finished
  if (cb) cb()

  debug('updateFeedCache end')
}

const getPostsAndSetFeedCache = async (subscriptions, {startAt, cache} = {}) => {
  debug('getPostsAndSetFeedCache start', {subscriptions: subscriptions.length, startAt, cache: cache && {postIds: cache.postIds && cache.postIds.length, nextStartAts: cache.nextStartAts, nextPublishers: cache.nextPublishers && cache.nextPublishers.length}})

  // an undefined startAt means a new cycle of updateFeedCache has started
  // and the current feed cache should be erased, otherwise it is a cursor
  // to get pages 2 and beyond
  if (!startAt) {
    await resetFeedCache()
  }

  // if the limit is too high the query will revert, if it's too low
  // it is a waste of ethereum requests
  const limit = subbyJsPostLimit

  const feed = await subbyJs.getPostsFromPublishers(subscriptions, {startAt, cache, limit})
  let {posts, nextCache, hasMorePosts} = feed

  // merge the previous posts with the new ones
  const feedCache = await indexedDb.getFeedCache()
  const {posts: feedCachePosts} = feedCache || {}
  posts = [...feedCachePosts, ...posts]

  // set the new cache
  await indexedDb.setFeedCache({posts, nextCache, hasMorePosts})
  
  const nextStartAt = (startAt) ? (startAt + limit) : limit
  // stop fetching if the buffer is full or if has no more posts on ethereum
  if (nextStartAt >= feedCacheBufferSize) {
    return
  }
  if (!hasMorePosts) {
    return
  }

  // nextCache contains data that improves the performance of subby.js
  // it should be undefined on the first query to fetch each user's latest posts
  await getPostsAndSetFeedCache(subscriptions, {startAt: nextStartAt, cache: nextCache})
}

const resetFeedCache = async () => {
  await indexedDb.setFeedCache({posts: [], nextCache: null, hasMorePosts: true})
}

const profileCacheIsExpired = async (account) => {
  debug('profileCacheIsExpired', {account})

  const lastProfileCacheTimestamp = await indexedDb.getLastProfileCacheTimestamp(account)

  const profileCacheIsExpired = cacheIsExpired(lastProfileCacheTimestamp, profileCacheTime)

  debug('profileCacheIsExpired returns', profileCacheIsExpired)

  return profileCacheIsExpired
}

const ethereumSubscriptionsCacheIsExpired = async (account) => {
  debug('ethereumSubscriptionsCacheIsExpired', {account})

  const lastEthereumSubscriptionsCacheTimestamp = await indexedDb.getLastEthereumSubscriptionsCacheTimestamp(account)

  const ethereumSubscriptionsCacheIsExpired = cacheIsExpired(lastEthereumSubscriptionsCacheTimestamp, ethereumSubscriptionsCacheTime)

  debug('ethereumSubscriptionsCacheIsExpired returns', ethereumSubscriptionsCacheIsExpired)

  return ethereumSubscriptionsCacheIsExpired
}

const feedCacheIsExpired = async () => {
  debug('feedCacheIsExpired')

  const lastPostCacheTimestamp = await indexedDb.getLastFeedCacheTimestamp()

  const feedCacheIsExpired = cacheIsExpired(lastPostCacheTimestamp, feedCacheTime)

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

export {
  updateCache,
  updateProfileCache,
  updateSubscriptionsCache,
  updateFeedCache,
  profileCacheIsExpired,
  ethereumSubscriptionsCacheIsExpired,
  feedCacheIsExpired,
  feedCacheNeedsMorePosts
}
