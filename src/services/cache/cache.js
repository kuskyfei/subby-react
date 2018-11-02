const subbyJs = require('subby.js')
const indexedDb = require('../indexedDb')
const {cacheIsExpired} = require('./util')
const read = require('./read')
const debug = require('debug')('services:cache:cache')

const profileCacheTime = window.SUBBY_GLOBAL_SETTINGS.PROFILE_CACHE_TIME
const ethereumSubscriptionsCacheTime = window.SUBBY_GLOBAL_SETTINGS.ETHEREUM_SUBSCRIPTIONS_CACHE_TIME
const feedCacheTime = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_TIME
const feedCacheBufferSize = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_BUFFER_SIZE

const subbyJsPostLimit = 100

const UpdateCacheLoop = function(account) {
  let stopped = false
  const stop = () => stopped = true
  const start = async () => {
    if (stopped) {
      return
    }
    await updateCache(account)
    const minute = 60*1000
    setTimeout(start, minute)
  }
  return {stop, start}
}

const updateCache = async (account) => {
  debug('updateCache')
  if (account && await profileCacheIsExpired(account)) {
    await updateProfileCache(account)
  }
  if (await backgroundFeedCacheIsExpired()) {
    const subscriptions = await read.getSubscriptions()
    await updateBackgroundFeedCache(subscriptions)
  }
}

const updateProfileCache = async (account) => {
  debug('updateProfileCache')
  const profile = await subbyJs.getProfile(account)
  indexedDb.setProfileCache(profile)
}

const updateBackgroundFeedCache = async (subscriptions) => {
  debug('updateBackgroundFeedCache start')

  if (!Array.isArray(subscriptions)) {
    subscriptions = Object.keys(subscriptions)
  }

  await populateFeedCache({
    subscriptions,
    getFeedCache: indexedDb.getBackgroundFeedCache,
    setFeedCache: indexedDb.setBackgroundFeedCache
  })

  debug('updateBackgroundFeedCache end')
}

const updateActiveFeedCache = async (subscriptions, cb) => {
  debug('updateActiveFeedCache start', {subscriptions})

  await populateFeedCache({
    subscriptions,
    getFeedCache: indexedDb.getActiveFeedCache,
    setFeedCache: indexedDb.setActiveFeedCache
  })

  // the cb will trigger once the async updateFeedCache has finished
  if (cb) cb()

  debug('updateActiveFeedCache end')
}

const populateFeedCache = async ({subscriptions, startAt = 0, cache, getFeedCache, setFeedCache} = {}) => {
  debug('getPostsAndSetFeedCache start', {subscriptions: subscriptions.length, startAt, cache: cache && {postIds: cache.postIds && cache.postIds.length, nextStartAts: cache.nextStartAts, nextPublishers: cache.nextPublishers && cache.nextPublishers.length}})

  if (startAt === 0) {
    await setFeedCache({posts: [], nextCache: null, hasMorePosts: null})
  }

  // if the limit is too high the query will revert, if it's too low
  // it is a waste of ethereum requests
  const limit = subbyJsPostLimit

  const feed = await subbyJs.getPostsFromPublishers(subscriptions, {startAt, cache, limit})
  let {posts, nextCache, hasMorePosts} = feed

  // merge the previous posts with the new ones
  const feedCache = await getFeedCache()
  const feedCachePosts = (feedCache && feedCache.posts) || []
  posts = [...feedCachePosts, ...posts]

  // set the new cache
  await setFeedCache({posts, nextCache, hasMorePosts})

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
  await populateFeedCache({subscriptions, startAt: nextStartAt, cache: nextCache, getFeedCache, setFeedCache})
}

const profileCacheIsExpired = async (account) => {
  debug('profileCacheIsExpired', {account})

  const lastProfileCacheTimestamp = await indexedDb.getLastProfileCacheTimestamp(account)

  const profileCacheIsExpired = cacheIsExpired(lastProfileCacheTimestamp, profileCacheTime)

  debug('profileCacheIsExpired returns', profileCacheIsExpired)

  return profileCacheIsExpired
}

const backgroundFeedCacheIsExpired = async () => {
  debug('backgroundFeedCacheIsExpired')

  const lastPostCacheTimestamp = await indexedDb.getLastBackgroundFeedCacheTimestamp()

  const backgroundFeedCacheIsExpired = cacheIsExpired(lastPostCacheTimestamp, feedCacheTime)

  debug('backgroundFeedCacheIsExpired returns', backgroundFeedCacheIsExpired)

  return backgroundFeedCacheIsExpired
}

export {
  updateCache,
  UpdateCacheLoop,
  updateProfileCache,
  profileCacheIsExpired,
  backgroundFeedCacheIsExpired,
  updateBackgroundFeedCache,
  updateActiveFeedCache
}
