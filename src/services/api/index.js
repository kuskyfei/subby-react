const ethereum = require('./ethereum')
const {filterSubscriptions} = require('../util')

const ms = require('ms')
const POST_CACHE_TIME = ms('5 minutes')
const POST_CACHED_PREEMPTIVELY_COUNT = 500
const MINIMUM_UNREAD_POST_CACHED_COUNT = 200

const getAddress = async () => {
  const ethereumAddress = await ethereum.getAddress()
  return ethereumAddress
}

const getProfile = async ({username, address}) => {
  let profile = await indexDb.getProfileFromCache({username, address})

  if (profile) {
    return profile
  }

  const profile = await ethereum.getProfile({username, address})
  indexDb.setProfile(profile)

  return profile
}

const getSubscriptions = async ({username, address}) => {
  const ethereumSubscriptions = await ethereum.getSubscriptions({username, address})

  const indexDbLoggedInSubscriptions = await indexDb.getLoggedInSubscriptions({username, address})
  const indexDbLoggedOutSubscriptions = await indexDb.getLoggedOutSubscriptions()

  // indexDbLoggedInSubscriptions have a "muted" status which the ethereumSubscriptions should not overwrite
  const subscriptions = mergeSubscriptions(ethereumSubscriptions, indexDbSubscriptions, loggedOutIndexDbSubscriptions)

  await indexDb.setSubscriptions(subscriptions)
  await indexDb.setLoggedOutSubscriptions(subscriptions)

  return subscriptions
}

const updateSubscriptions = async ({indexDbSubscriptions, loggedOutIndexDbSubscriptions}) => {
  await indexDb.setSubscriptions(subscriptions)
  await indexDb.setLoggedOutSubscriptions(subscriptions)
}

const getFeed = async ({username, address, subscriptions, startAt, count, cursor}) => {
  subscriptions = filterSubscriptions(subscriptions) // remove muted or limited subscriptions
  const postQuery = {username, address, subscriptions, startAt, count, cursor}
  
  let posts = await indexDb.getFeedFromCache(postQuery)

  if (!feedCacheIsExpired()) {
    posts = await ethereum.getPosts(postQuery)
  }

  // if there is no more posts on ethereum,
  // there is no point in fetching more
  // or refilling the cache
  if (!indexDb.hasMorePostsOnEthereum()) {
    return posts
  }

  // if there is more posts on ethereum and
  // the post count received is smaller than
  // query count, it should be fetched again
  if (posts.count < count) {
    posts = await ethereum.getPosts(postQuery)
  }

  if (refillFeedCacheIsRequired({startAt, count})) {
    const cursor = indexDb.getLastFeedCacheCursor()
    refillFeedCache({...postQuery, cursor})
  }
  
  return posts
}

const refillFeedCache = async ({username, address, subscriptions, startAt, count, cursor}) => {
  const postQuery = {username, address, subscriptions, startAt, count, cursor}
  const posts = await ethereum.getPosts(postQuery)
  indexDb.setPostCache(posts)
}

const refillFeedCacheIsRequired = ({startAt, count}) => {
  const postCacheCount = await indexDb.getPostCacheCount()
  const lastPostQueried = startAt + count
  const remainingPostsInCacheCount = postCacheCount - lastPostQueried

  if (remainingPostsInCacheCount < MINIMUM_UNREAD_POST_CACHED_COUNT ) {
    return true
  }
}

// this needs to be checked for accuracy
const feedCacheIsExpired = () => {
  const lastPostCacheTimeStamp = indexDb.getLastPostCacheTimeStamp()
  const expiredTimestampThreshold = Date.now() - postCacheTime
  return lastPostCacheTimeStamp < expiredTimestampThreshold
}

const getSettings = async () => {
  return indexDb.getSettings()
}
const setSettings = async (settings) => {
  await indexDb.setSettings(settings)
}


