const ReactGA = require('react-ga')
const services = require('../../services')
const debug = require('debug')('services:ga')
const gaId = 'UA-128596742-1'

const isEnabled = async () => {
  const settings = await services.getSettings()
  if (!settings.GOOGLE_ANALYTICS) {
    debug('isEnabled', false)
    return false
  }
  init()
  debug('isEnabled', true)
  return true
}

let isInitialized = false
const init = () => {
  if (!isInitialized) {
    debug('init')

    if (window.location.protocol === 'file:') {
      ReactGA.initialize(gaId, {gaOptions: {storage: 'none'}})
      ReactGA.set({checkProtocolTask: null})
    } else {
      ReactGA.initialize(gaId)
    }
    isInitialized = true
  }
}

const pageView = async () => {
  if (!await isEnabled()) {
    return
  }

  debug('pageView')

  if (window.location.protocol === 'file:') {
    ReactGA.pageview('/' + window.location.search)
  } else {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }
}

export {pageView}
