const indexedDb = require('./indexedDb')
const ethereum = require('./ethereum')
const {settings} = require('../settings')
const ipfs = require('./ipfs').default

const init = async () => {
  await indexedDb.init({version: settings.INDEXEDDB_VERSION})
  await ethereum.init({provider: window.SUBBY_GLOBAL_SETTINGS.WEB3_PROVIDER})
  ipfs.setProvider(window.SUBBY_GLOBAL_SETTINGS.IPFS_PROVIDER)
}

export {
  init,
  ipfs
}

export {
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
} from './cache'

export {getTorrent, getMagnetFromTorrentFile, prepareMagnetForEthereum} from './torrent'
