const queryString = require('query-string')

const getProfileQueryFromUrlParams = (urlParams, address) => {
  const {u, p} = queryString.parse(urlParams)

  let profileQuery

  if (u) {
    profileQuery = isValidAddress(u) ? {address: u} : {username: u}
  }

  if (p === 'profile') {
    profileQuery = {address}
  }

  return profileQuery
}

const getUsernameFromUrlParams = (urlParams) => {
  return queryString.parse(urlParams).u
}

const getPostIdFromUrlParams = (urlParams) => {
  return queryString.parse(urlParams).id
}

const isPermalink = (urlParams) => {
  return queryString.parse(urlParams).id && queryString.parse(urlParams).u
}

const isPublisher = (urlParams) => {
  return !!queryString.parse(urlParams).u
}

const isFeed = (urlParams) => {
  return queryString.parse(urlParams).p === 'feed'
}

const isProfile = (urlParams) => {
  return queryString.parse(urlParams).p === 'profile'
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
  address = address.toLowerCase()
  address = address.trim()
  return address
}

const isValidHexNumber = (string) => {
  const containsNonHexChar = string.match(/[^0-9a-fx]/)
  return !containsNonHexChar
}

const isRouteChange = (props, prevProps) => {
  // if there is no previous props, it
  // automatically means this is a new page
  if (!prevProps) {
    return true
  }

  const prevUrlParams = queryString.parse(prevProps.location.search)
  const urlParams = queryString.parse(props.location.search)

  if (urlParams.p !== prevUrlParams.p) { // page
    return true
  }

  if (urlParams.u !== prevUrlParams.u) { // user
    return true
  }

  if (urlParams.id !== prevUrlParams.id) { // post id
    return true
  }
}

module.exports = {
  isRouteChange,
  getProfileQueryFromUrlParams,
  getUsernameFromUrlParams,
  getPostIdFromUrlParams,
  isValidAddress,
  isPermalink,
  isPublisher,
  isProfile,
  isFeed
}
