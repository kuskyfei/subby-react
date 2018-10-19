const {
  setSettings,
  setSubscriptions,
  subscribe,
  unsubscribe,
  donate,
  publish
} = require('./write')

const {
  getAddress,
  getProfile,
  getSubscriptions,
  getActiveSubscriptions,
  getSettings,
  getFeed,
  isSubscribed
} = require('./read')

const {
  updateCache,
  updateBackgroundFeedCache
} = require('./cache')

export {
  setSettings,
  setSubscriptions,
  subscribe,
  unsubscribe,
  donate,
  publish,

  getAddress,
  getProfile,
  getSubscriptions,
  getActiveSubscriptions,
  isSubscribed,
  getSettings,
  getFeed,

  updateCache,
  updateBackgroundFeedCache
}
