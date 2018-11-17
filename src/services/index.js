const indexedDb = require('./indexedDb')
const subbyJs = require('subby.js')
const ipfs = require('./ipfs')
const torrent = require('./torrent')
const debug = require('debug')('services:init')
const utils = require('./utils')

const {settings} = require('../settings')

const init = async () => {
  debug('init start')
  await indexedDb.init({version: settings.INDEXEDDB_VERSION})

  const localUserSettings = await getSettings()

  await subbyJs.init({provider: localUserSettings.WEB3_PROVIDER, mnemonic: 'radar blur cabbage chef fix engine embark joy scheme fiction master release'})
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
    smartContractsMock = require('subby.js/test/mock/explicit')
  }
  subbyJs.mockSmartContracts(smartContractsMock)
}

const mockWebTorrent = () => {
  torrent.mockWebTorrent()
}

const mockIpfsApi = () => {
  ipfs.mockIpfsApi()
}

const {
  getPostsFromPublisher, 
  getPostFromId, 
  onDonation, 
  getAddress, 
  terminateAccount, 
  donate, 
  publish, 
  onSignerChange,
  getSignerNetwork
} = subbyJs
const getNetwork = getSignerNetwork

const {
  setSettings,
  setSubscriptions,
  subscribe,
  unsubscribe,
  editProfile,

  getProfile,
  getSubscriptions,
  getActiveSubscriptions,
  getSettings,
  getFeed,
  isSubscribed,

  updateCache,
  UpdateCacheLoop,
  updateProfileCache,
  updateBackgroundFeedCache
} = require('./cache')

const {
  getTorrent,
  getMagnetFromTorrentFile,
  prepareMagnetForEthereum
} = require('./torrent')

const ga = require('./ga')

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
  editProfile,
  // cache read
  getProfile,
  getSubscriptions,
  getActiveSubscriptions,
  isSubscribed,
  getSettings,
  getFeed,
  // cache
  updateCache,
  UpdateCacheLoop,
  updateProfileCache,
  updateBackgroundFeedCache,
  // subby.js
  getAddress,
  getPostsFromPublisher,
  getPostFromId,
  onDonation,
  donate,
  publish,
  terminateAccount,
  onSignerChange,
  getNetwork,
  // torrent
  getTorrent,
  getMagnetFromTorrentFile,
  prepareMagnetForEthereum,
  // ga
  ga,
  // utils
  utils
}
