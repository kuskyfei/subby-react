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

// accounts are either addresses or usernames

const getProfile = async (account) => {
  debug('getProfile', account)

  let profile = await indexedDb.getProfileCache(account)

  // if cache is empty or expired, fetch from ethereum
  // and set the cache
  if (!profile || await cache.profileCacheIsExpired(account)) {
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

  if (!ethereumSubscriptionsCache || await cache.ethereumSubscriptionsCacheIsExpired(account)) {
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

const getFeed = async ({subscriptions, startAt, limit, beforeTimestamp, afterTimestamp, cursor}) => {
  debug('getFeed', {subscriptions, startAt, limit, beforeTimestamp, afterTimestamp, cursor})

  subscriptions = formatSubscriptions(subscriptions)

  const postQuery = {
    publishers: subscriptions,
    startAt,
    limit
  }

  let posts = await indexedDb.getFeedCache(postQuery)

  if (await cache.feedCacheIsExpired()) {
    posts = await subbyJs.getPostsFromPublishers(subscriptions)
    // this needs to be updated when the final cursor design is decided
    await indexedDb.setFeedCache({posts, hasMorePostsOnEthereum: true, lastFeedCacheCursor: null})
  }

  // if there is no more posts on ethereum,
  // there is no point in fetching more
  // or refilling the cache
  if (!indexedDb.hasMorePostsOnEthereum()) {
    return posts
  }

  // if there is more posts on ethereum and
  // the post count received is smaller than
  // query count, it should be fetched again
  if (posts.limit < limit) {
    posts = await subbyJs.getPostsFromPublishers(postQuery)
    // this needs to be updated when the final cursor design is decided
    await indexedDb.setFeedCache({posts, hasMorePostsOnEthereum: true, lastFeedCacheCursor: null})
  }

  if (cache.feedCacheNeedsMorePosts({startAt, limit})) {
    const cursor = indexedDb.getLastFeedCacheCursor()

    debug('postQuery', postQuery)

    cache.addPostsToFeedCache({...postQuery, cursor})
  }

  debug('getFeed returns', posts)

  return posts
}

const getPosts = subbyJs.getPosts

module.exports = {
  getAddress,
  getProfile,
  getSubscriptions,
  getSettings,
  getFeed,
  getPosts
}
