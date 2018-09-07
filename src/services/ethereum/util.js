const Web3 = require('web3')
const web3 = new Web3()
const state = require('./state')

const bigNumberToEther = (number) => {
  return web3.fromWei(number, 'ether').toString().substring(0, 6)
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const getBlockNumber = async () => state.web3.eth.getBlockNumberAsync()

export {getBlockNumber, bigNumberToEther, sleep}
