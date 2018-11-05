const debug = require('debug')('services:cache:cache')

const formatSubscriptionsForGetFeed = (subscriptions) => {
  if (Array.isArray(subscriptions)) {
    return subscriptions
  }
  const formated = []
  for (const key in subscriptions) {
    formated.push(key)
  }
  return formated
}

const cacheIsExpired = (lastCacheTimestamp, cacheTime) => {
  debug('cacheIsExpired', {lastCacheTimestamp, cacheTime})
  if (!lastCacheTimestamp) return true
  const expiresAtTimestamp = lastCacheTimestamp + cacheTime
  const cacheIsExpired = Date.now() > expiresAtTimestamp
  return cacheIsExpired
}

const arrayToObjectWithItemsAsProps = (array) => {
  const obj = {}
  for (const item of array) {
    obj[item] = {}
  }
  return obj
}

const filterRequestedPosts = ({posts, startAt, limit}) => {
  return posts.slice(startAt, startAt + limit)
}

const mergeEthereumSubscriptionsCache = (ethereumSubscriptions, ethereumSubscriptionsCache) => {
  for (const account in ethereumSubscriptionsCache) {
    if (!ethereumSubscriptionsCache[account].pendingDeletion) {
      continue
    }

    if (account in ethereumSubscriptions) {
      ethereumSubscriptions[account].pendingDeletion = true
    }
  }
  return ethereumSubscriptions
}

const getActiveSubscriptionsFromSubscriptions = ({localSubscriptions, ethereumSubscriptions}) => {
  // it's important that ethereumSubscriptions is at the end, because it contains pending deletion statuses
  // whereas the others can overwrite each other as much as they want
  const activeSubscriptions = {...localSubscriptions, ...ethereumSubscriptions}

  for (const key in activeSubscriptions) {
    if (activeSubscriptions[key].pendingDeletion) {
      delete activeSubscriptions[key]
    }
  }

  return activeSubscriptions
}

const profileHasChanged = (profile1, profile2) => {
  profile1 = JSON.stringify({...profile1, lastProfileCacheTimestamp: null})
  profile2 = JSON.stringify({...profile2, lastProfileCacheTimestamp: null})
  return profile1 !== profile2
}

export {
  arrayToObjectWithItemsAsProps,
  getActiveSubscriptionsFromSubscriptions,
  mergeEthereumSubscriptionsCache,
  formatSubscriptionsForGetFeed,
  cacheIsExpired,
  filterRequestedPosts,
  profileHasChanged
}
