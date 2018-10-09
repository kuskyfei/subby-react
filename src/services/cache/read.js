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

const getSubscriptions = async (account) => {
  debug('getSubscriptions', account)

  const loggedOutSubscriptions = await indexedDb.getLoggedOutSubscriptions()
  const loggedInSubscriptions = await indexedDb.getLoggedInSubscriptions(account)
  const ethereumSubscriptionsCache = await indexedDb.getEthereumSubscriptionsCache(account)
  let ethereumSubscriptions = ethereumSubscriptionsCache

  if (await cache.ethereumSubscriptionsCacheIsExpired(account)) {
    ethereumSubscriptions = await subbyJs.getSubscriptions(account)
    ethereumSubscriptions = arrayToObjectWithItemsAsProps(ethereumSubscriptions)

    // ethereumSubscriptionsCache have a "pending deletion" status that
    // prevents them from appearing in the active subscriptions
    // these pending deletion should not be deleted when the cache
    // gets updated with fresh data from Ethereum
    if (ethereumSubscriptionsCache) {
      ethereumSubscriptions = mergeEthereumSubscriptionsCache(ethereumSubscriptions, ethereumSubscriptionsCache)
    }

    await indexedDb.setEthereumSubscriptionsCache({account, ethereumSubscriptions})
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

  const feedCache = await indexedDb.getFeedCache()
  const feedCacheIsExpired = await cache.feedCacheIsExpired()
  const feedCacheContainsRequestedPosts = feedCache.posts && feedCache.posts.length >= startAt + limit
  const feedCacheBufferExceeded = startAt + limit > feedCacheBufferSize
  const isFirstPage = startAt === 0

  let useCache = false
  if (feedCacheContainsRequestedPosts) {
    useCache = true
  }
  if (feedCacheBufferExceeded) {
    useCache = false
  }
  if (feedCacheIsExpired && isFirstPage) {
    // we use an expired cache for page 2 and beyond
    // because we don't care about new posts beyond page 1
    useCache = false
  }

  let posts

  if (useCache) {
    posts = feedCache.posts
    posts = getRequestedPostsFromFeedCachePosts({posts, startAt, limit})
  } else if (feedCacheBufferExceeded) {
    // if the user is fetching posts above the buffer size, we can assume the feed 
    // nextCache contains useful data to pass to the ethereum function, so we do
    const res = await subbyJs.getPostsFromPublishers(subscriptions, {
      startAt, 
      limit, 
      cache: feedCache && feedCache.nextCache
    })
    posts = res.posts
  } else {
    // if useCache is false and feedCacheBuffer is not exceeded, we can assume the user 
    // is making a fresh request and the old next cache should not be passed
    const res = await subbyJs.getPostsFromPublishers(subscriptions, {startAt, limit})
    posts = res.posts
  }

  // this triggers a new updateFeedCache cycle that completes asynchronously 
  // the cb is optional and will trigger once the async updateFeedCache has finished
  if (feedCacheIsExpired) {
    cache.updateFeedCache(subscriptions, cb)
  } else {
    if (cb) setTimeout(cb, 100)
  }

  return posts
}

const getRequestedPostsFromFeedCachePosts = ({posts, startAt, limit}) => {
  return posts.slice(startAt, limit)
}

const getPosts = subbyJs.getPosts

export {
  getAddress,
  getProfile,
  getSubscriptions,
  getSettings,
  getFeed,
  getPosts
}
