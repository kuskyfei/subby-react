const queryString = require('query-string')

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

const getUsernameFromUrlParams = (urlParams) => {
  return queryString.parse(urlParams).u
}

const onFinishedTyping = (cb) => {
  this.onFinishedTypingCounter = 0

  clearInterval(this.onFinishedTypingInterval)

  this.onFinishedTypingInterval = setInterval(() => {
    if (this.onFinishedTypingCounter > 1) {
      cb()
      clearInterval(this.onFinishedTypingInterval)
    }
    this.onFinishedTypingCounter++
  }, 700)
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

export {isValidAddress, getUsernameFromUrlParams, onFinishedTyping, isRouteChange}
