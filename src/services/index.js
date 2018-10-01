const indexedDb = require('./indexedDb')
const subbyJs = require('subby.js')
const {settings} = require('../settings')
const ipfs = require('./ipfs').default

const init = async () => {
  await indexedDb.init({version: settings.INDEXEDDB_VERSION})
  await subbyJs.init({provider: window.SUBBY_GLOBAL_SETTINGS.WEB3_PROVIDER, mnemonic: 'no mnemonic'})
  await subbyJs.init({provider: window.SUBBY_GLOBAL_SETTINGS.WEB3_PROVIDER, mnemonic: 'no mnemonic'})
  ipfs.setProvider(window.SUBBY_GLOBAL_SETTINGS.IPFS_PROVIDER)  
}

const mockSmartContracts = () => {
  const smartContractsMock = require('subby.js/test/mock')
  subbyJs.mockSmartContracts(smartContractsMock)
}

export {
  init,
  ipfs,
  mockSmartContracts
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
