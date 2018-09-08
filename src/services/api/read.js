const ethereum = require('../ethereum')
const indexDb = require('../indexDb')
const cache = require('./cache')
const {mergeSubscriptionsLoggedInSubscriptions, mergeSubscriptions, filterSubscriptions, formatSubscriptions} = require('./util')

const getAddress = async () => {
  const ethereumAddress = await ethereum.getAddress()
  return ethereumAddress
}

const getProfile = async ({username, address}) => {
  let profile = await indexDb.getProfileCache({username, address})

  // if cache is empty or expired, fetch from ethereum
  // and set the cache
  if (!profile || await cache.profileCacheIsExpired()) {
    profile = await ethereum.getProfile({username, address})
    indexDb.setProfileCache(profile)
  }

  return profile
}

// this will need a lot of testing to make sure the 3 lists of subscribtions don't
// overwrite each other in the wrong way
const getSubscriptions = async ({username, address}) => {
  let loggedInSubscriptions = await indexDb.getLoggedInSubscriptionsCache({username, address})
  const loggedOutSubscriptions = await indexDb.getLoggedOutSubscriptions()

  if (await cache.loggedInSubscriptionsCacheIsExpired()) {
    const ethereumSubscriptions = await ethereum.getSubscriptions({username, address})
    loggedInSubscriptions = mergeSubscriptionsLoggedInSubscriptions({ethereumSubscriptions, loggedInSubscriptions})

    // indexDbLoggedInSubscriptions have a "muted" status which the ethereumSubscriptions should not overwrite
    await indexDb.setLoggedInSubscriptionsCache(loggedInSubscriptions)
  }

  const subscriptions = mergeSubscriptions({loggedInSubscriptions, loggedOutSubscriptions})

  return subscriptions
}

const getSettings = async () => {
  return indexDb.getSettings()
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

  let posts = await indexDb.getFeedCache(postQuery)

  console.log(1, posts)

  if (await cache.feedCacheIsExpired()) {
    console.log(1.5, posts)
    posts = await ethereum.getPosts(postQuery)
  }

  console.log(2, posts)

  // if there is no more posts on ethereum,
  // there is no point in fetching more
  // or refilling the cache
  if (!indexDb.hasMorePostsOnEthereum()) {
    return posts
  }

  console.log(3, posts)

  // if there is more posts on ethereum and
  // the post count received is smaller than
  // query count, it should be fetched again
  if (posts.count < count) {
    posts = await ethereum.getPosts(postQuery)
  }

  console.log(4, posts)

  if (cache.feedCacheNeedsMorePosts({startAt, count})) {
    const cursor = indexDb.getLastFeedCacheCursor()
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
