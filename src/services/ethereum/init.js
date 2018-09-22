// modules
const Web3 = require('web3')
const Promise = require('bluebird')

// abis
// const SubbyABI = require('./abis/SubbyABI.json')

// files
const HDWalletProvider = require('truffle-hdwallet-provider')
const state = require('./state')

const init = async ({provider = '', mnemonic = ''} = {}) => {
  const web3Provider = new HDWalletProvider(mnemonic, provider)
  // const subbyContractAddress = 'not on mainnet yet'

  console.log('web3Provider', web3Provider)

  const web3 = new Web3(web3Provider)
  Promise.promisifyAll(web3.eth)

  // subby contract
  // const Subby = web3.eth.contract(SubbyABI)
  // subby = Subby.at(subbyContractAddress)
  // Promise.promisifyAll(subby)

  // account
  const accounts = await web3.eth.getAccountsAsync()
  const account = accounts[0]

  // Default account is required for web3 to work.
  web3.eth.defaultAccount = account

  state.web3 = web3
  // state.subby = subby
  state.account = account
}

// useful for mocking
const setWeb3 = (web3) => {
  state.web3 = {...state.web3, ...web3}
}

export {init, setWeb3}
