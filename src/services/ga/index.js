const ReactGA = require('react-ga')
const services = require('../../services')
const gaId = 'UA-000000-01'

let isInitialized = false

const isEnabled = async () => {
  const settings = await services.getSettings()
  if (!settings.GOOGLE_ANALYTICS) {
    return false
  }
  if (!isInitialized) {
    ReactGA.initialize(gaId)
    isInitialized = true
  }
  return true
}

const pageView = async () => {
  if (!isEnabled) {
    return
  }
  ReactGA.pageview(window.location.pathname + window.location.search)
}

export {pageView}
