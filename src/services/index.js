const indexedDb = require('./indexedDb')
const subbyJs = require('subby.js')
const ipfs = require('./ipfs')
const torrent = require('./torrent')
const debug = require('debug')('services:init')

const {settings} = require('../settings')

const init = async () => {
  debug('init start')

  await indexedDb.init({version: settings.INDEXEDDB_VERSION})
  await subbyJs.init({provider: window.SUBBY_GLOBAL_SETTINGS.WEB3_PROVIDER, mnemonic: 'no mnemonic'})
  await subbyJs.init({provider: window.SUBBY_GLOBAL_SETTINGS.WEB3_PROVIDER, mnemonic: 'no mnemonic'})
  torrent.init()
  ipfs.setProvider(window.SUBBY_GLOBAL_SETTINGS.IPFS_PROVIDER)

  debug('init end')
}

const mockSmartContracts = () => {
  const smartContractsMock = require('subby.js/test/mock')
  subbyJs.mockSmartContracts(smartContractsMock)
}

const mockWebTorrent = () => {
  torrent.mockWebTorrent()
}

const mockIpfsApi = () => {
  ipfs.mockIpfsApi()
}

const {getPostsFromPublisher, getPostFromId} = subbyJs

const {
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

  updateCache,
  updateBackgroundFeedCache
} = require('./cache')

const {
  getTorrent,
  getMagnetFromTorrentFile,
  prepareMagnetForEthereum
} = require('./torrent')

export {
  // init
  init,
  ipfs,
  mockSmartContracts,
  mockWebTorrent,
  mockIpfsApi,
  // cache
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
  getPostsFromPublisher,
  getPostFromId,

  updateCache,
  updateBackgroundFeedCache,
  // torrent
  getTorrent,
  getMagnetFromTorrentFile,
  prepareMagnetForEthereum
}
