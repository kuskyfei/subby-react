/* database schema

  - profiles // object store
    - usernameOrAddress
      - username
      - thumbnail
      - bio
      - subscriberCount
      - subscribtionCount
      - tipCount
      - lastProfileCacheTimestamp
    - usernameOrAddress2
    - etc...
  - feed // object store
    - posts
      - post1
      - post2
      - etc...
    - hasMorePosts
    - lastFeedCacheCursor
    - lastFeedCacheTimestamp
  - loggedInSubscriptions // object store
    - usernameOrAddress
      - subscriptions
        - subscription1
        - subscription2
        - etc...
      - lastEthereumSubscriptionsCacheTimestamp
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
    if (!upgradeDb.objectStoreNames.contains('ethereumSubscriptions')) {
      upgradeDb.createObjectStore('ethereumSubscriptions')
    }
    if (!upgradeDb.objectStoreNames.contains('loggedOutSubscriptions')) {
      upgradeDb.createObjectStore('loggedOutSubscriptions')
    }
    if (!upgradeDb.objectStoreNames.contains('settings')) {
      upgradeDb.createObjectStore('settings')
    }
  })
}

const deleteEverything = () => new Promise(async resolve => {
  await state.db.close()

  const req = window.indexedDB.deleteDatabase('subby')
  req.onsuccess = () => {
    resolve()
  }
  req.onerror = () => {
    console.error("Couldn't delete database")
  }
  req.onblocked = () => {
    console.error("Couldn't delete database due to the operation being blocked")
  }
})

window.SUBBY_DEBUG_DELETE_INDEXEDDB = deleteEverything

state.init = init

export default state
