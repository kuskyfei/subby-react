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

  const feedCacheIsExpired = await cache.feedCacheIsExpired()
  const feedCache = await indexedDb.getFeedCache()
  const feedCacheContainsNeededPosts = feedCache.posts && feedCache.posts.length >= startAt + limit
  // IMPORTANT TODO need to add buffer size to calculation
  const feedCacheBufferTooSmall = (feedCache.posts) ? feedCache.posts.length >= (startAt + limit) : true 

  let posts, nextStartAts, nextPublishers, hasMorePosts
  // if cache is expired or doesn't have the needed posts,
  // fetch from ethereum, otherwise use cache
  if (feedCacheIsExpired || !feedCacheContainsNeededPosts) {
    const res = await subbyJs.getPostsFromPublishers(subscriptions, {limit: 100})
    posts = res.posts
    nextStartAts = res.nextStartAts
    nextPublishers = res.nextPublishers
    hasMorePosts = res.hasMorePosts
  } else {
    const res = feedCache
    posts = res.posts
    nextStartAts = res.nextStartAts
    nextPublishers = res.nextPublishers
    hasMorePosts = res.hasMorePosts
  }

  // check if cache refresh is needed
  if (feedCacheBufferTooSmall && hasMorePosts) {
    // increase cache size to fetch the new needed posts
    // IMPORTANT TODO need to calculate new buffer size
    const bufferSize = 1000
    cache.updateFeedCache({subscriptions, bufferSize}, cb)
  }
  else if (feedCacheIsExpired) {
    cache.updateFeedCache({subscriptions}, cb)
  }
  else {
    // the cb will trigger once the async updateFeedCache has finished
    // or if there is no updateFeedCache launched
    if (cb) cb()
  }

  posts = getQueriedPostsFromPosts({posts, startAt, limit})
  
  return posts

  /* getFeed algorithm

    - if not expired 
      - get feed from cache
        - if query is smaller than posts in cache
          - return posts
          - if query makes the cache buffer too small
            - replenish cache buffer

      - if query is bigger than posts in cache
        - get feed from ethereum
          - return posts
          - replenish cache buffer

    - if cache is expired
      - get feed from ethereum
      - start update cache cycle
  */
}

const getQueriedPostsFromPosts = ({posts, startAt, limit}) => {
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
