const {
  editProfile,
  setSettings,
  setSubscriptions,
  subscribe,
  unsubscribe
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
  UpdateCacheLoop,
  updateBackgroundFeedCache
} = require('./cache')

export {
  editProfile,
  setSettings,
  setSubscriptions,
  subscribe,
  unsubscribe,

  getAddress,
  getProfile,
  getSubscriptions,
  getActiveSubscriptions,
  isSubscribed,
  getSettings,
  getFeed,

  updateCache,
  UpdateCacheLoop,
  updateBackgroundFeedCache
}
