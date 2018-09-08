// const ethereum = require('../ethereum')
const indexDb = require('../indexDb')

const setSettings = async (settings) => {
  await indexDb.setSettings(settings)
}

const subscribe = async ({username, address}) => {

}

const setSubscriptions = async ({loggedInSubscriptions, loggedOutSubscriptions}) => {
  await indexDb.setLoggedInSubscriptionsCache(loggedInSubscriptions)
  await indexDb.setLoggedOutSubscriptions(loggedOutSubscriptions)
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
