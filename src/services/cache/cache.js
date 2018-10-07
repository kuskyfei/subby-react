const subbyJs = require('subby.js')
const indexedDb = require('../indexedDb')
const {cacheIsExpired} = require('./util')
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

const updateFeedCache = async ({subscriptions, bufferSize} = {}, cb) => {
  // a defined bufferSize indicates that the user has scrolled
  // deep into his feed and more posts should be cached
  if (!bufferSize) {
    bufferSize = feedCacheBufferSize
  }

  const feedCache = await indexedDb.getFeedCache()
  const {posts, nextStartAts, hasMorePosts, nextPublishers} = feedCache

  if (hasNewSubscriptions(subscriptions, nextPublishers)) {
    await getAllPosts(subscriptions)
  }
  else {
    await getMissingPosts()
  }

  // the cb will trigger once the async updateFeedCache has finished
  if (cb) cb()

  debug('updateFeedCache')
}

const hasNewSubscriptions = (subscriptions, prevSubscriptions) => {
  if (!prevSubscriptions) {
    return true
  }
  else {
    throw Error('need to implement this section')
  }
}

const getAllPosts = async (subscriptions, {bufferSize, startAt, nextStartAts} = {}) => {
  // a defined bufferSize indicates that the user has scrolled
  // deep into his feed and more posts should be cached
  if (!bufferSize) {
    bufferSize = feedCacheBufferSize
  }

  // an undefined startAt means a new cycle of updateFeedCache has started
  // and the current feed cache should be erased
  if (!startAt) {
    await resetFeedCache()
  }

  // if the limit is too high the query will revert, if it's too low
  // it is a waste of ethereum requests
  const limit = subbyJsPostLimit

  const feed = await subbyJs.getPostsFromPublishers(subscriptions, {startAts: nextStartAts, limit})
  let {posts, nextPublishers, hasMorePosts} = feed
  nextStartAts = feed.nextStartAts

  //console.logFull(feed)

  // merge the previous posts with the new ones
  const feedCache = await indexedDb.getFeedCache()
  const {posts: feedCachePosts} = feedCache || {}
  posts = [...feedCachePosts, ...posts]

  // set the new cache
  await indexedDb.setFeedCache({posts, nextStartAts, hasMorePosts, nextPublishers})

  // stop fetching if the buffer is full or if has no more posts on ethereum
  if (!hasMorePosts) {
    return
  }
  const nextStartAt = (startAt) ? (startAt + limit) : limit
  if (nextStartAt > bufferSize) {
    return
  }

  // nextStartAts is used as a cursor to get the next queries from Ethereum
  // it should be undefined on the first query to fetch each user's latest posts
  await getAllPosts(subscriptions, {bufferSize, startAt: nextStartAt, nextStartAts})

  /* updateFeedCache algorithm

    - if no buffer size specified, use the default buffer size

    - get feed cache

    - if subscriptions are the same as feed cache subscriptions
      - get only missing new posts, and missing posts from potential buffer size increase

    - if subscriptions are not the same as feed cache subscriptions
      - get all posts from 0 to bufferSize
  */
}

const resetFeedCache = async () => {
  await indexedDb.setFeedCache({posts: [], nextStartAts: null, hasMorePosts: true, nextPublishers: null})
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
