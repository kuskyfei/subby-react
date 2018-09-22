/* database schema

  - profiles // object store
    - usernameOrAddress
      - username
      - thumbnail
      - bio
      - subscriberCount
      - subscribtionCount
      - tipCount
      - lastProfileCacheTimeStamp
    - usernameOrAddress2
    - etc...
  - feed // object store
    - posts
      - post1
      - post2
      - etc...
    - hasMorePostsOnEthereum
    - lastFeedCacheCursor
    - lastFeedCacheTimeStamp
  - loggedInSubscriptions // object store
    - usernameOrAddress
      - subscriptions
        - subscription1
        - subscription2
        - etc...
      - lastLoggedInSubscriptionsCacheTimeStamp
  - loggedOutSubscriptions // object store
    - subscription1
    - subscription2
    - etc....
  - settings // object store

*/

const idb = require('idb')
window.SUBBY_DEBUG_GET_IDB = idb

const state = {}

let init = async ({version}) => {
  state.db = await idb.open('subby', version, upgradeDb => {
    if (!upgradeDb.objectStoreNames.contains('profiles')) {
      upgradeDb.createObjectStore('profiles')
    }
    if (!upgradeDb.objectStoreNames.contains('feed')) {
      upgradeDb.createObjectStore('feed')
    }
    if (!upgradeDb.objectStoreNames.contains('loggedInSubscriptions')) {
      upgradeDb.createObjectStore('loggedInSubscriptions')
    }
    if (!upgradeDb.objectStoreNames.contains('loggedOutSubscriptions')) {
      upgradeDb.createObjectStore('loggedOutSubscriptions')
    }
    if (!upgradeDb.objectStoreNames.contains('settings')) {
      upgradeDb.createObjectStore('settings')
    }
  })
}

const deleteEverything = () => {
  return idb.deleteDatabase('subby')
}
window.SUBBY_DEBUG_DELETE_INDEXEDDB = deleteEverything

state.init = init

export default state
