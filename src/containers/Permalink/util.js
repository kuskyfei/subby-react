const queryString = require('query-string')

const getProfileQueryFromUrlParams = (urlParams, address) => {
  const {u, p} = queryString.parse(urlParams)

  let profileQuery

  if (u) {
    profileQuery = isValidAddress(u) ? {address: u} : {username: u}
  }
  
  if (p === 'profile') {
    profileQuery =  {address}
  }

  return profileQuery
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

module.exports = {getProfileQueryFromUrlParams, isValidAddress}
