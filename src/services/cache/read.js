/* eslint brace-style: 0 */

const subbyJs = require('subby.js')
const indexedDb = require('../indexedDb')
const cache = require('./cache')
const {
  arrayToObjectWithItemsAsProps,
  mergeEthereumSubscriptionsCache,
  getActiveSubscriptionsFromSubscriptions,
  formatSubscriptionsForGetFeed,
  filterRequestedPosts
} = require('./util')
const debug = require('debug')('services:cache:read')

const feedCacheBufferSize = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_BUFFER_SIZE

const getProfile = async (account) => {
  debug('getProfile', account)

  let profile = await indexedDb.getProfileCache(account)

  // if cache is empty or expired, fetch from ethereum
  // and set the cache
  if (await cache.profileCacheIsExpired(account)) {
    profile = await subbyJs.getProfile(account)

    indexedDb.setProfileCache(profile)
  }

  delete profile.lastProfileCacheTimestamp

  debug('getProfile returns', profile)

  return profile
}

const getSubscriptions = async () => {
  debug('getSubscriptions')

  let localSubscriptions = await indexedDb.getLocalSubscriptions()
  if (!localSubscriptions) localSubscriptions = {}

  return localSubscriptions
}

const isSubscribed = async (publisher) => {
  debug('isSubscribed', {publisher})

  const subscriptions = await getSubscriptions()

  let isSubscribed = false

  // if publisher is a profile object
  if (typeof publisher === 'object') {
    if (subscriptions[publisher.username]) {
      isSubscribed = true
    }
    if (subscriptions[publisher.address]) {
      isSubscribed = true
    }
  }

  // if publisher is a string
  if (typeof publisher === 'string') {
    if (subscriptions[publisher]) {
      isSubscribed = true
    }
  }

  debug('isSubscribed returns', isSubscribed)
  return isSubscribed
}

const getSettings = async () => {
  debug('getSettings')

  let indexedDbSettings = await indexedDb.getSettings()

  if (!indexedDbSettings) indexedDbSettings = {}

  if (indexedDbSettings.USE_DEFAULT_SETTINGS) {
    return {...window.SUBBY_GLOBAL_SETTINGS, USE_DEFAULT_SETTINGS: true}
  }

  const settings = {...window.SUBBY_GLOBAL_SETTINGS, ...indexedDbSettings}

  debug('getSettings returns', settings)

  return settings
}

const getFeed = async ({subscriptions, startAt = 0, limit = 20}, cb) => {
  debug('getFeed', {subscriptions, startAt, limit})
  // subscriptions can either be an array or object with publishers as keys
  // but needs to be converted to array
  subscriptions = formatSubscriptionsForGetFeed(subscriptions)

  const isFirstPage = startAt === 0
  const backgroundFeedCacheIsExpired = await cache.backgroundFeedCacheIsExpired()
  const backgroundFeedCache = await indexedDb.getBackgroundFeedCache()
  const backgroundFeedCacheContainsRequestedPosts = backgroundFeedCache.posts && backgroundFeedCache.posts.length >= startAt + limit

  let useBackgroundFeedCache = false
  if (isFirstPage) {
    useBackgroundFeedCache = true
  }
  if (backgroundFeedCacheIsExpired) {
    useBackgroundFeedCache = false
  }
  if (!backgroundFeedCacheContainsRequestedPosts) {
    useBackgroundFeedCache = false
  }

  let posts
  if (useBackgroundFeedCache) {
    posts = getFeedFromBackgroundFeedCache({startAt, limit})
  }
  else {
    posts = await getFeedFromActiveFeedCache({subscriptions, startAt, limit}, cb)
  }

  debug('getFeed returns', {posts: posts})
  return posts
}

const getFeedFromBackgroundFeedCache = async ({startAt, limit}) => {
  const backgroundFeedCache = await indexedDb.getBackgroundFeedCache()
  let {posts} = backgroundFeedCache

  // we need to switch the background cache to being the active cache
  await indexedDb.setActiveFeedCache(backgroundFeedCache)

  posts = filterRequestedPosts({posts, startAt, limit})

  return posts
}

const getFeedFromActiveFeedCache = async ({subscriptions, startAt, limit}, cb) => {
  debug('getFeedFromActiveFeedCache', {subscriptions, startAt, limit})

  const isFirstPage = startAt === 0
  if (isFirstPage) {
    cache.updateActiveFeedCache(subscriptions, cb)
  }

  const activeFeedCache = await indexedDb.getActiveFeedCache()
  const feedCacheContainsRequestedPosts = activeFeedCache.posts && activeFeedCache.posts.length >= startAt + limit
  const feedCacheBufferExceeded = startAt + limit > feedCacheBufferSize
  const hasNextCache = !!(activeFeedCache && activeFeedCache.nextCache)
  const hasMorePosts = !(activeFeedCache && activeFeedCache.hasMorePosts === false)

  let useCache = false
  if (feedCacheContainsRequestedPosts) {
    useCache = true
  }
  if (!hasMorePosts) {
    useCache = true
  }
  if (feedCacheBufferExceeded) {
    useCache = false
  }
  if (isFirstPage) {
    useCache = false
  }

  debug('getFeedFromActiveFeedCache', {useCache, feedCacheContainsRequestedPosts, feedCacheBufferExceeded, hasNextCache, isFirstPage, hasMorePosts})

  let posts

  if (useCache) {
    posts = activeFeedCache.posts
    posts = filterRequestedPosts({posts, startAt, limit})
  }

  else if (feedCacheBufferExceeded && hasNextCache) {
    const subscriptions = activeFeedCache.nextCache.nextPublishers
    const cache = activeFeedCache.nextCache

    const res = await subbyJs.getPostsFromPublishers(subscriptions, {startAt, limit, cache})
    posts = res.posts

    // set next cache
    const nextCache = res.nextCache
    const hasMorePosts = res.hasMorePosts
    const {posts: feedCachePosts} = activeFeedCache || {}
    const mergedPosts = [...feedCachePosts, ...posts]
    await indexedDb.setActiveFeedCache({posts: mergedPosts, nextCache, hasMorePosts})
  }

  else {
    if (feedCacheBufferExceeded) {
      console.warn('feedCacheBufferExceeded and no nextCache, this request will be extremely slow and contain unexpected subscriptions.')
    }
    const res = await subbyJs.getPostsFromPublishers(subscriptions, {startAt, limit})
    posts = res.posts
  }

  debug('getFeedFromActiveFeedCache returns', {posts: posts.length})
  return posts
}

export {
  getProfile,
  getSubscriptions,
  isSubscribed,
  getSettings,
  getFeed
}
