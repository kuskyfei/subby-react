const ethereum = require('../ethereum')
const indexedDb = require('../indexedDb')
const cache = require('./cache')
const {mergeSubscriptionsLoggedInSubscriptions, mergeSubscriptions, filterSubscriptions, formatSubscriptions} = require('./util')

const getAddress = async () => {
  const ethereumAddress = await ethereum.getAddress()
  return ethereumAddress
}

const getProfile = async ({username, address}) => {
  let profile = await indexedDb.getProfileCache({username, address})

  // if cache is empty or expired, fetch from ethereum
  // and set the cache
  if (!profile || await cache.profileCacheIsExpired()) {
    profile = await ethereum.getProfile({username, address})

    console.log(indexedDb)

    indexedDb.setProfileCache(profile)
  }

  return profile
}

// this will need a lot of testing to make sure the 3 lists of subscribtions don't
// overwrite each other in the wrong way
const getSubscriptions = async ({username, address}) => {
  let loggedInSubscriptions = await indexedDb.getLoggedInSubscriptionsCache({username, address})
  const loggedOutSubscriptions = await indexedDb.getLoggedOutSubscriptions()

  if (await cache.loggedInSubscriptionsCacheIsExpired()) {
    const ethereumSubscriptions = await ethereum.getSubscriptions({username, address})
    loggedInSubscriptions = mergeSubscriptionsLoggedInSubscriptions({ethereumSubscriptions, loggedInSubscriptions})

    // indexedDbLoggedInSubscriptions have a "muted" status which the ethereumSubscriptions should not overwrite
    await indexedDb.setLoggedInSubscriptionsCache({username, address, loggedInSubscriptions})
  }

  const subscriptions = mergeSubscriptions({loggedInSubscriptions, loggedOutSubscriptions})

  return subscriptions
}

const getSettings = async () => {
  return indexedDb.getSettings()
}

const getFeed = async ({subscriptions, startAt, count, beforeTimestamp, afterTimestamp, cursor}) => {
  subscriptions = filterSubscriptions(subscriptions) // remove muted or limited subscriptions
  const {userSubscriptions, addressSubscriptions} = formatSubscriptions(subscriptions)

  const postQuery = {
    startAt,
    count,
    beforeTimestamp,
    afterTimestamp,
    userSubscriptions,
    addressSubscriptions
  }

  let posts = await indexedDb.getFeedCache(postQuery)

  if (await cache.feedCacheIsExpired()) {
    posts = await ethereum.getPosts(postQuery)
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
  if (posts.count < count) {
    posts = await ethereum.getPosts(postQuery)
  }

  if (cache.feedCacheNeedsMorePosts({startAt, count})) {
    const cursor = indexedDb.getLastFeedCacheCursor()
    cache.addPostsToFeedCache({...postQuery, cursor})
  }

  return posts
}

export {
  getAddress,
  getProfile,
  getSubscriptions,
  getSettings,
  getFeed
}
