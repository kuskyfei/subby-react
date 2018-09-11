const indexedDb = require('../indexedDb')
const ethereum = require('../ethereum')
const {settings} = require('../../settings')

const init = async () => {
  await indexedDb.init({version: settings.INDEXEDDB_VERSION})
  await ethereum.init({provider: window.SUBBY_GLOBAL_SETTINGS.WEB3_PROVIDER})
}

export {init}

export {
  setSettings,
  setSubscriptions,
  subscribe,
  tip,
  publish
} from './write'

export {
  getAddress,
  getProfile,
  getSubscriptions,
  getSettings,
  getFeed
} from './read'

export {
  updateCache
} from './cache'
