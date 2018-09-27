const queryString = require('query-string')

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

export {isRouteChange}
