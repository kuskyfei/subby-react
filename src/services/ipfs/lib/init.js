const IPFS = require('ipfs-api')
const state = require('./state')

const {
  urlToProviderObject,
  noProvider
} = require('./util')

const setProvider = (provider) => {
  if (!provider) throw Error(`No provider argument passed to ipfs.setProvider. Try something like 'https://infura.io:5001'.`)

  provider = urlToProviderObject(provider)
  state.ipfs = new IPFS(provider)
}

// useful for testing
const mockIpfsApi = () => {
  if (!state.ipfs) noProvider()
  const ipfsMock = require('../test/mock')
  state.ipfs = {...state.ipfs, ...ipfsMock}
}

// use this to call the ipfs methods directly
const getIpfs = () => state.ipfs

export {
  mockIpfsApi,
  setProvider,
  getIpfs
}
