const crypto = require('crypto')
const faker = require('faker')
const toNumber = require('hashcode').hashCode().value

const fake = (seed) => {
  seed = toNumber(seed)
  faker.seed(seed)
  faker.finance.ethereumAddress = () => generateEthereumAddress(seed)
  return faker
}

const formatSubscriptions = ({userSubscriptions, addressSubscriptions}) => {
  const subscriptions = {}
  for (const userSubscription of userSubscriptions) {
    subscriptions[userSubscription] = {}
  }
  for (const addressSubscription of addressSubscriptions) {
    subscriptions[addressSubscription] = {}
  }
  return subscriptions
}

const generateEthereumAddress = (seed) => {
  const addressHash = sha256(`address${seed}`)
  return addressHash
}

const sha256 = (data) => {
  if (typeof data === 'number') data = data.toString()
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 40)
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const {settings} = require('../../../../settings')
const networkDelayMock = async () => {
  if (settings.MOCK_ETHEREUM_NETWORK_DELAY) {
    await sleep(settings.MOCK_ETHEREUM_NETWORK_DELAY)
  }
}

export {fake, formatSubscriptions, networkDelayMock}