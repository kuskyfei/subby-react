const indexedDb = require('./indexedDb')
const subbyJs = require('subby.js')
const ipfs = require('./ipfs')
const torrent = require('./torrent')

const {settings} = require('../settings')

const init = async () => {
  await indexedDb.init({version: settings.INDEXEDDB_VERSION})
  await subbyJs.init({provider: window.SUBBY_GLOBAL_SETTINGS.WEB3_PROVIDER, mnemonic: 'no mnemonic'})
  await subbyJs.init({provider: window.SUBBY_GLOBAL_SETTINGS.WEB3_PROVIDER, mnemonic: 'no mnemonic'})
  torrent.init()
  ipfs.setProvider(window.SUBBY_GLOBAL_SETTINGS.IPFS_PROVIDER)
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

const {
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
} = require('./cache')

const {
  getTorrent,
  getMagnetFromTorrentFile,
  prepareMagnetForEthereum
} = require('./torrent')

/*
module.exports = {
  init,
  ipfs,
  mockSmartContracts,
  mockWebTorrent,
  mockIpfsApi,

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

  updateCache,

  getTorrent,
  getMagnetFromTorrentFile,
  prepareMagnetForEthereum
}
*/

const something = {}

export {
  something
}
