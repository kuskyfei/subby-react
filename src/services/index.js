const indexedDb = require('./indexedDb')
const subbyJs = require('subby.js')
const ipfs = require('./ipfs')
const torrent = require('./torrent')
const debug = require('debug')('services:init')

const {settings} = require('../settings')

const init = async () => {
  debug('init start')
  await indexedDb.init({version: settings.INDEXEDDB_VERSION})

  const localUserSettings = await getSettings()

  await subbyJs.init({provider: localUserSettings.WEB3_PROVIDER})
  torrent.init()

  let ipfsProvider = localUserSettings.IPFS_PROVIDER
  if (ipfsProvider === '') {
    ipfsProvider = 'https://ipfs.infura.io:5001'
  }
  ipfs.setProvider(ipfsProvider)

  debug('init end')
}

const mockSmartContracts = ({explicit} = {}) => {
  let smartContractsMock = require('subby.js/test/mock')
  if (explicit) {
    smartContractsMock = require('subby.js/test/mockExplicit')
  }
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
  isTerminated,
  getProfile,
  getSubscriptions,
  getActiveSubscriptions,
  getSettings,
  getFeed,
  isSubscribed,

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
  // cache write
  setSettings,
  setSubscriptions,
  subscribe,
  unsubscribe,
  donate,
  publish,
  // cache read
  getProfile,
  getSubscriptions,
  getActiveSubscriptions,
  isSubscribed,
  getSettings,
  getFeed,
  // cache
  updateCache,
  updateBackgroundFeedCache,
  // subby.js
  getAddress,
  isTerminated,
  getPostsFromPublisher,
  getPostFromId,
  // torrent
  getTorrent,
  getMagnetFromTorrentFile,
  prepareMagnetForEthereum
}
