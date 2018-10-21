const queryString = require('query-string')

const isRouteChange = (props, prevProps) => {
  if (!prevProps) return true

  const urlParams = getUrlParamsFromProps(props)
  const prevUrlParams = getUrlParamsFromProps(prevProps)

  if (!isUrlParamsChange(urlParams, prevUrlParams)) {
    return
  }

  const route = getRouteFromUrlParams(urlParams)
  const prevRoute = getRouteFromUrlParams(prevUrlParams)

  if (route !== prevRoute) return true
}

const getUrlParamsFromProps = (props) => {
  if (!props) return {}
  const urlParams = queryString.parse(props.location.search)

  return urlParams
}

const isUrlParamsChange = (urlParams, prevUrlParams) => {
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

const isUrlParamsChangeFromProps = (props, prevProps) => {
  const urlParams = getUrlParamsFromProps(props)
  const prevUrlParams = getUrlParamsFromProps(prevProps)

  return isUrlParamsChange(urlParams, prevUrlParams)
}

const getRouteFromUrlParams = (urlParams) => {
  const page = urlParams.p
  const isProfile = urlParams.u

  if (isProfile) {
    return 'feed'
  }

  switch (page) {
    case 'feed':
      return 'feed'

    case 'subscriptions':
      return 'subscriptions'

    case 'donations':
      return 'donations'

    case 'settings':
      return 'settings'

    case 'profile':
      return 'feed'

    default:
      return 'help'
  }
}

export {isRouteChange, getRouteFromUrlParams, isUrlParamsChangeFromProps}
