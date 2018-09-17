const queryString = require('query-string')

const getPercentScrolled = () => {
  const winheight = window.innerHeight || (document.documentElement || document.body).clientHeight
  const docheight = getDocHeight()
  const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
  const trackLength = docheight - winheight
  const pctScrolled = Math.floor(scrollTop / trackLength * 100) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
  return pctScrolled
}

const getDocHeight = () => {
  const D = document
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  )
}

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

const getUsernameFromUrlParams = (urlParams) => {
  return queryString.parse(urlParams).u
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

module.exports = {getPercentScrolled, getProfileQueryFromUrlParams, isValidAddress, getUsernameFromUrlParams}
