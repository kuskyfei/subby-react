const queryString = require('query-string')

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

export {isRouteChange}
