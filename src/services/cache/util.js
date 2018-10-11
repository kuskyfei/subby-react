const formatSubscriptions = (subscriptions) => {
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

const getActiveSubscriptions = ({loggedInSubscriptions, loggedOutSubscriptions, ethereumSubscriptions}) => {
  // it's important that ethereumSubscriptions is at the end, because it contains pending deletion statuses
  // whereas the others can overwrite each other as much as they want
  const activeSubscriptions = {...loggedInSubscriptions, ...loggedOutSubscriptions, ...ethereumSubscriptions}
  return activeSubscriptions
}

const publishersMatch = (publishers, prevPublishers) => {
  if ((!publishers && prevPublishers) || (publishers && !prevPublishers)) {
    return false
  }

  if (publishers.length !== prevPublishers.length) {
    return false
  }

  const publishersObject = {}

  const {addresses, usernames} = getAddressesAndUsernamesFromAccounts(publishers)

  for (const username of usernames) {
    publishersObject[username] = username
  }

  for (let address of addresses) {
    address = address.toLowerCase()
    publishersObject[address] = address
  }

  {
    const {addresses, usernames} = getAddressesAndUsernamesFromAccounts(prevPublishers)

    for (const username of usernames) {
      if (!publishersObject[username]) {
        return false
      }
    }

    for (let address of addresses) {
      address = address.toLowerCase()
      if (!publishersObject[address]) {
        return false
      }
    }
  }

  return true
}

const getAddressAndUsernameFromAccount = (account, {nullsAreTyped = false} = {}) => {
  const addressAndUsername = {
    username: nullsAreTyped && '',
    address: nullsAreTyped && '0x0000000000000000000000000000000000000000'
  }

  if (isValidUsername(account)) {
    addressAndUsername.username = cleanUsername(account)
  } else if (isValidAddress(account)) {
    addressAndUsername.address = cleanAddress(account)
  } else {
    throw Error(`(${account}) is not a valid address or username`)
  }

  return addressAndUsername
}

const getAddressesAndUsernamesFromAccounts = (accounts) => {
  const accs = {
    addresses: [],
    usernames: []
  }

  for (const account of accounts) {
    const acc = getAddressAndUsernameFromAccount(account)
    if (acc.username) {
      accs.usernames.push(acc.username)
    }
    if (acc.address) {
      accs.addresses.push(acc.address)
    }
  }

  return accs
}

const isValidUsername = (username) => {
  if (typeof username !== 'string') {
    return false
  }
  if (username.length > 32) {
    return false
  }
  return true
}

const isValidAddress = (address) => {
  if (typeof address !== 'string') {
    return false
  }

  address = cleanAddress(address)

  if (!isValidHexNumber(address)) {
    return false
  }

  if (!address.match(/^0x/)) {
    return false
  }

  if (address.length !== 42) {
    return false
  }

  return true
}

const cleanAddress = (address) => {
  address = String(address)
  address = address.toLowerCase()
  address = address.trim()
  return address
}

const cleanUsername = (username) => {
  username = String(username)
  username = username.trim()
  return username
}

const isValidHexNumber = (string) => {
  const containsNonHexChar = string.match(/[^0-9a-fx]/)
  return !containsNonHexChar
}

export {
  arrayToObjectWithItemsAsProps,
  getActiveSubscriptions,
  mergeEthereumSubscriptionsCache,
  formatSubscriptions,
  cacheIsExpired,
  publishersMatch
}
