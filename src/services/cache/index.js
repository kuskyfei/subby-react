const {
  setSettings,
  setSubscriptions,
  subscribe,
  tip,
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
  updateCache
} = require('./cache')

module.exports = {
  setSettings,
  setSubscriptions,
  subscribe,
  tip,
  publish,

  getAddress,
  getProfile,
  getSubscriptions,
  getSettings,
  getFeed,
  getPosts,

  updateCache
}
