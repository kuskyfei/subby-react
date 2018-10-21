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
  isTerminated,
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
  isTerminated,
  getProfile,
  getSubscriptions,
  getActiveSubscriptions,
  isSubscribed,
  getSettings,
  getFeed,

  updateCache,
  updateBackgroundFeedCache
}
