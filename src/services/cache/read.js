const subbyJs = require('subby.js')
const indexedDb = require('../indexedDb')
const cache = require('./cache')
const {
  arrayToObjectWithItemsAsProps,
  mergeEthereumSubscriptionsCache,
  getActiveSubscriptions,
  formatSubscriptions
} = require('./util')
const debug = require('debug')('services:cache:read')

const feedCacheBufferSize = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_BUFFER_SIZE

const getAddress = async () => {
  debug('getAddress')

  const ethereumAddress = await subbyJs.getAddress()

  debug('getAddress returns', ethereumAddress)

  return ethereumAddress
}

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

const getSubscriptions = async (address) => {
  debug('getSubscriptions', address)

  const loggedOutSubscriptions = await indexedDb.getLoggedOutSubscriptions()

  if (!address) {
    const subscriptions = {
      activeSubscriptions: loggedOutSubscriptions,
      loggedInSubscriptions,
      loggedOutSubscriptions: [],
      ethereumSubscriptions: []
    }
    debug('getSubscriptions returns', subscriptions)
    return subscriptions
  }

  const loggedInSubscriptions = await indexedDb.getLoggedInSubscriptions(address)
  const ethereumSubscriptionsCache = await indexedDb.getEthereumSubscriptionsCache(address)
  let ethereumSubscriptions = ethereumSubscriptionsCache

  if (await cache.ethereumSubscriptionsCacheIsExpired(address)) {
    ethereumSubscriptions = await subbyJs.getSubscriptions(address)
    ethereumSubscriptions = arrayToObjectWithItemsAsProps(ethereumSubscriptions)

    // ethereumSubscriptionsCache have a "pending deletion" status that
    // prevents them from appearing in the active subscriptions
    // these pending deletion should not be deleted when the cache
    // gets updated with fresh data from Ethereum
    if (ethereumSubscriptionsCache) {
      ethereumSubscriptions = mergeEthereumSubscriptionsCache(ethereumSubscriptions, ethereumSubscriptionsCache)
    }

    await indexedDb.setEthereumSubscriptionsCache({address, ethereumSubscriptions})
  }

  const activeSubscriptions = getActiveSubscriptions({loggedInSubscriptions, loggedOutSubscriptions, ethereumSubscriptions})

  const subscriptions = {
    activeSubscriptions,
    loggedInSubscriptions,
    loggedOutSubscriptions,
    ethereumSubscriptions
  }
  debug('getSubscriptions returns', subscriptions)

  return subscriptions
}

const getSettings = async () => {
  debug('getSettings')

  const settings = await indexedDb.getSettings()

  debug('getSettings returns', settings)

  return settings
}

const getFeed = async ({subscriptions, startAt = 0, limit = 20}, cb) => {
  debug('getFeed', {subscriptions, startAt, limit})
  // subscriptions can either be an array or object with publishers as keys
  // but needs to be converted to array
  subscriptions = formatSubscriptions(subscriptions)

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
    posts = backgroundFeedCache.posts
  }
  //
  else {
    posts = await getFeedFromActiveFeedCache({subscriptions, startAt, limit}, cb)
  }

  console.log(posts)

  debug('getFeed returns', {posts: posts.length})
  return posts
}

const getFeedFromBackgroundFeedCache = async ({startAt, limit}) => {
  const backgroundFeedCache = await indexedDb.getBackgroundFeedCache()
  let {posts} = backgroundFeedCache

  // we need to switch the background cache to now being the active cache
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
  const hasNextCache = activeFeedCache && activeFeedCache.nextCache
  const hasMorePosts = (activeFeedCache && activeFeedCache.hasMorePosts === false) ? false : true

  let useCache = false
  if (feedCacheContainsRequestedPosts) {
    useCache = true
  }
  if (feedCacheBufferExceeded) {
    useCache = false
  }
  if (isFirstPage) {
    useCache = false
  }

  debug('getFeedFromActiveFeedCache', {useCache, feedCacheBufferExceeded, hasNextCache, isFirstPage, hasMorePosts})

  let posts

  if (useCache) {
    posts = activeFeedCache.posts
    posts = filterRequestedPosts({posts, startAt, limit})
  }
  //
  else if (!hasMorePosts) {
    posts = []
  }
  //
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
  //
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

const filterRequestedPosts = ({posts, startAt, limit}) => {
  return posts.slice(startAt, limit)
}

export {
  getAddress,
  getProfile,
  getSubscriptions,
  getSettings,
  getFeed,
}
