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

// useful for mocking
const setIpfsApi = (ipfsApi) => {
  if (!state.ipfs) noProvider()
  state.ipfs = {...state.ipfs, ...ipfsApi}
}

// use this to call the ipfs methods directly
const getIpfs = () => state.ipfs

export {
  setIpfsApi,
  setProvider,
  getIpfs
}
