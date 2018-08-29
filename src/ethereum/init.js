// modules
const Web3 = require('web3')
const Promise = require('bluebird')

// abis
// const SubbyABI = require("./abis/SubbyABI.json")

// files
const HDWalletProvider = require('truffle-hdwallet-provider')
const state = require('./state')

const init = async () => {
  // Rinkeby settings:
  // const mnemonic = "test"
  // const provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/uaNKEkpjsyvArG0sHifx") // Rinkeby
  // const subbyContractAddress = ""

  // Mainnet settings:
  const mnemonic = 'test'
  const provider = new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/uaNKEkpjsyvArG0sHifx') // Mainnet
  // const subbyContractAddress = "not on mainnet yet"

  const web3 = new Web3(provider)
  Promise.promisifyAll(web3.eth)

  // // subby contract
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

export {init}
