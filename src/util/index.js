const queryString = require('query-string')

const sortBy = (array, property, {order = 'ascending'} = {order: 'ascending'}) => {
  if (typeof array === 'object') array = Object.values(array)

  let deepCopyArray = array.slice(0)
  deepCopyArray.sort((a, b) => a[property] - b[property])

  if (order === 'descending') deepCopyArray = deepCopyArray.reverse()

  return deepCopyArray
}

const timeout = (ms, options) => {
  let secsRemaining = ms / 1000
  if (!options || !options.silent) countdown(secsRemaining)
  return new Promise((resolve, reject) => setTimeout(() => { resolve() }, ms))
}

const countdown = (secsRemaining) => {
  setTimeout(() => {
    process.stdout.write(secsRemaining + 's left to wait...' + '\r')
    secsRemaining--
    if (secsRemaining > 0) countdown(secsRemaining)
  }, 1000)
}

const isRouteChange = (props, prevProps) => {
  // if there is no previous props, it
  // automatically means this is a new page
  if (!prevProps) {
    return true
  }

  // if the p param has changed, then the
  // route has changed
  const prevUrlParams = queryString.parse(prevProps.location.search)
  const urlParams = queryString.parse(props.location.search)

  if (urlParams.p === prevUrlParams.p) {
    return false
  }

  return true
}

export {sortBy, timeout, isRouteChange}
