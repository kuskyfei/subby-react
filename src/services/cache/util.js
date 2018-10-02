const mergeSubscriptionsLoggedInSubscriptions = ({ethereumSubscriptions = {}, loggedInSubscriptions = {}}) => {
  for (const key in ethereumSubscriptions) {
    if (!loggedInSubscriptions[key]) {
      loggedInSubscriptions[key] = ethereumSubscriptions[key]
    }
  }

  return loggedInSubscriptions
}

const mergeSubscriptions = ({loggedInSubscriptions = {}, loggedOutSubscriptions = {}}) => {
  for (const key in loggedOutSubscriptions) {
    if (!loggedInSubscriptions[key]) {
      loggedInSubscriptions[key] = loggedOutSubscriptions[key]
    }
  }

  return loggedInSubscriptions
}

const filterSubscriptions = (subscriptions) => {
  const filtered = {}
  for (const key in subscriptions) {
    if (!subscriptions[key].muted) filtered[key] = subscriptions[key]
  }

  return filtered
}

const formatSubscriptions = (subscriptions) => {
  const formated = []
  for (const key in subscriptions) {
    formated.push(key)
  }
  return formated
}

const cacheIsExpired = (lastCacheTimestamp, cacheTime) => {
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

module.exports = {
  arrayToObjectWithItemsAsProps,
  mergeSubscriptions,
  mergeSubscriptionsLoggedInSubscriptions,
  filterSubscriptions,
  formatSubscriptions,
  cacheIsExpired
}
