const {
  editProfile,
  setSettings,
  resetSettings,
  setSubscriptions,
  subscribe,
  unsubscribe
} = require('./write')

const {
  getProfile,
  getSubscriptions,
  getUpdate,
  isSubscribed,
  getSettings,
  getFeed
} = require('./read')

const {
  updateCache,
  UpdateCacheLoop,
  updateProfileCache,
  updateBackgroundFeedCache
} = require('./cache')

export {
  editProfile,
  setSettings,
  resetSettings,
  setSubscriptions,
  subscribe,
  unsubscribe,

  getProfile,
  getSubscriptions,
  getUpdate,
  isSubscribed,
  getSettings,
  getFeed,

  updateCache,
  UpdateCacheLoop,
  updateProfileCache,
  updateBackgroundFeedCache
}
