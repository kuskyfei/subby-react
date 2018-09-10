// const ethereum = require('../ethereum')
const indexedDb = require('../indexedDb')

const setSettings = async (settings) => {
  await indexedDb.setSettings(settings)
}

const subscribe = async ({username, address}) => {

}

const setSubscriptions = async ({username, address, loggedInSubscriptions, loggedOutSubscriptions}) => {
  await indexedDb.setLoggedInSubscriptionsCache({address, username, loggedInSubscriptions})
  await indexedDb.setLoggedOutSubscriptions(loggedOutSubscriptions)
}

const tip = async ({username, address}) => {

}

const publish = async (post) => {

}

export {
  setSettings,
  setSubscriptions,
  subscribe,
  tip,
  publish
}
