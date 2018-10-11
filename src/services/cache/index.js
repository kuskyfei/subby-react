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
  getSettings,
  getFeed,
  getPosts
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
  getSettings,
  getFeed,
  getPosts,

  updateCache,
  updateBackgroundFeedCache
}
